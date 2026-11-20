import { available, SHOW } from '../demo'

export type Screen = 'quantity' | 'map' | 'review' | 'payment' | 'ticket'
type Purchase = 'selecting' | 'reviewing' | 'payment_pending' | 'payment_failed' | 'purchased'
type Hold = 'none' | 'active' | 'expired' | 'released' | 'unavailable' | 'converted'
export interface Receipt { seats: string[]; id: string }
export interface Booking {
  version: 1; screen: Screen; quantity: number; extras: number; selected: string[]
  purchase: Purchase; receipt: Receipt | null; additionalReceipts: Receipt[]
  reservation: { status: Hold; seats: string[]; expiresAt: number | null }
  additional: 'idle' | 'pending' | 'failed'; payingSeats: string[]
}
export const fresh = (): Booking => ({
  version: 1, screen: 'quantity', quantity: 4, extras: 0, selected: [],
  purchase: 'selecting', receipt: null, additionalReceipts: [],
  reservation: { status: 'none', seats: [], expiresAt: null }, additional: 'idle', payingSeats: [],
})
export type Action =
  | { type: 'reset' | 'preset' | 'map' | 'review' | 'back' | 'together' | 'remove' | 'checkout'
    | 'success' | 'failed' | 'tick' | 'shorten' | 'expire' | 'release' | 'success_without_hold' }
  | { type: 'quantity' | 'extras'; value: number }
  | { type: 'select'; seat: string }
  | { type: 'additional'; seats?: string[] }

export function reconcile(s: Booking, now: number): Booking {
  if (s.reservation.status !== 'active' || now < (s.reservation.expiresAt ?? 0)) return s
  return { ...s, screen: 'ticket', additional: 'idle', payingSeats: [],
    reservation: { ...s.reservation, status: 'expired' } }
}
export function transition(previous: Booking, action: Action, now: number): Booking {
  const s = reconcile(previous, now)
  const chosen = s.selected
  const unpaid = s.reservation
  switch (action.type) {
    case 'reset': return fresh()
    case 'preset': return { ...fresh(), screen: 'map', extras: 2, selected: [...SHOW.initialSeats, ...SHOW.extraSeats] }
    case 'tick': return s
    case 'back':
      if (s.screen === 'map') return { ...s, screen: 'quantity', quantity: Math.min(10, s.quantity),
        extras: s.extras + Math.max(0, s.quantity - 10) }
      if (s.screen === 'review') return { ...s, screen: 'map', purchase: 'selecting' }
      if (s.screen === 'payment') return s.receipt ? { ...s, screen: 'ticket', additional: 'idle', payingSeats: [] }
        : { ...s, screen: 'review', purchase: 'reviewing' }
      return s
    case 'quantity':
    case 'extras': {
      if (s.screen !== 'quantity' || !Number.isInteger(action.value)) return s
      const min = action.type === 'quantity' ? 1 : 0
      if (action.value < min || action.value > (min ? 10 : 2)) return s
      const next = { ...s, [action.type]: action.value }
      return { ...next, selected: chosen.slice(0, next.quantity + next.extras) }
    }
    case 'map': return s.screen === 'quantity' ? { ...s, screen: 'map' } : s
    case 'select':
      if (s.screen !== 'map' || !available.has(action.seat)) return s
      if (chosen.includes(action.seat)) return { ...s, selected: chosen.filter(x => x !== action.seat) }
      if (chosen.length >= s.quantity + s.extras) return s
      return { ...s, selected: [...chosen, action.seat] }
    case 'review': return s.screen === 'map' && chosen.length === s.quantity + s.extras
      ? { ...s, screen: 'review', purchase: 'reviewing' } : s
    case 'together': return s.screen === 'review' ? { ...s, quantity: chosen.length, extras: 0 } : s
    case 'remove': return s.screen === 'review' ? { ...s, selected: chosen.slice(0, s.quantity), extras: 0 } : s
    case 'checkout': return s.screen === 'review' ? { ...s, screen: 'payment', purchase: 'payment_pending' } : s
    case 'additional': {
      if (s.screen !== 'ticket' || unpaid.status !== 'active') return s
      const seats = [...new Set(action.seats ?? unpaid.seats)]
      if (!seats.length || seats.some(x => !unpaid.seats.includes(x))) return s
      return { ...s, screen: 'payment', additional: 'pending', payingSeats: seats }
    }
    case 'failed':
      if (s.screen !== 'payment') return s
      return s.receipt ? { ...s, additional: 'failed' } : { ...s, purchase: 'payment_failed' }
    case 'success':
    case 'success_without_hold': {
      if (s.screen !== 'payment') return s
      if (s.receipt) {
        if (unpaid.status !== 'active' || !s.payingSeats.length) return s
        const remaining = unpaid.seats.filter(x => !s.payingSeats.includes(x))
        const receipt = { seats: s.payingSeats, id: SHOW.bookingId + '-' + (s.additionalReceipts.length + 2) }
        return { ...s, screen: 'ticket', additional: 'idle', payingSeats: [],
          additionalReceipts: [...s.additionalReceipts, receipt],
          reservation: { seats: remaining, status: remaining.length ? 'active' : 'converted', expiresAt: remaining.length ? unpaid.expiresAt : null } }
      }
      const extra = chosen.slice(s.quantity)
      const active = extra.length > 0 && action.type === 'success'
      return { ...s, screen: 'ticket', purchase: 'purchased', receipt: { id: SHOW.bookingId, seats: chosen.slice(0, s.quantity) },
        reservation: { status: active ? 'active' : extra.length ? 'unavailable' : 'none',
          expiresAt: active ? now + SHOW.holdMs : null, seats: extra } }
    }
    case 'release': return unpaid.status === 'active' ? { ...s, screen: 'ticket', additional: 'idle', payingSeats: [],
      reservation: { ...unpaid, status: 'released', expiresAt: null } } : s
    case 'expire':
    case 'shorten': return unpaid.status === 'active'
      ? reconcile({ ...s, reservation: { ...unpaid, expiresAt: Math.min(unpaid.expiresAt!, now + (action.type === 'expire' ? 0 : 30000)) } }, now) : s
  }
}
