import { aisleBefore, available, rowSeats, SHOW } from '../demo'

export const MIN_RESERVATION_TICKETS = 4

export type Screen = 'quantity' | 'map' | 'review' | 'payment' | 'ticket'
type Purchase = 'selecting' | 'reviewing' | 'payment_pending' | 'payment_failed' | 'purchased'
type Hold = 'none' | 'active' | 'expired' | 'released' | 'unavailable' | 'converted'
export interface Receipt { seats: string[]; id: string }
export interface Booking {
  version: 1; screen: Screen; quantity: number; extras: number; selected: string[]; reservedSelection: string[]
  hasAutofilled: boolean
  reviewChange?: { type: 'together' | 'remove'; seats: string[] }
  purchase: Purchase; receipt: Receipt | null; additionalReceipts: Receipt[]
  reservation: { status: Hold; seats: string[]; expiresAt: number | null }
  additional: 'idle' | 'pending' | 'failed'; payingSeats: string[]
}
export const fresh = (): Booking => ({
  version: 1, screen: 'quantity', quantity: 3, extras: 0, selected: [], reservedSelection: [], hasAutofilled: false,
  purchase: 'selecting', receipt: null, additionalReceipts: [],
  reservation: { status: 'none', seats: [], expiresAt: null }, additional: 'idle', payingSeats: [],
})
export type Action =
  | { type: 'reset' | 'preset' | 'map' | 'review' | 'back' | 'together' | 'remove' | 'checkout'
    | 'undo' | 'success' | 'failed' | 'tick' | 'shorten' | 'expire' | 'release' | 'success_without_hold' }
  | { type: 'quantity' | 'extras'; value: number }
  | { type: 'select'; seat: string }
  | { type: 'additional'; seats?: string[] }

export function reconcile(s: Booking, now: number): Booking {
  // Older saved bookings stored the reserved seats after the book-now seats.
  if (!Array.isArray(s.reservedSelection)) {
    s = { ...s, selected: s.selected.slice(0, s.quantity), reservedSelection: s.selected.slice(s.quantity) }
  }
  if (typeof s.hasAutofilled !== 'boolean') {
    s = { ...s, hasAutofilled: s.selected.length > 0 || s.reservedSelection.length > 0 || Boolean(s.receipt) }
  }
  if (!s.receipt && s.quantity < MIN_RESERVATION_TICKETS && s.extras > 0) {
    return { ...s, extras: 0, selected: s.selected.slice(0, s.quantity), reservedSelection: [] }
  }
  if (s.reservation.status !== 'active' || now < (s.reservation.expiresAt ?? 0)) return s
  return { ...s, screen: 'ticket', additional: 'idle', payingSeats: [],
    reservation: { ...s.reservation, status: 'expired' } }
}
function pickSeats(s: Booking, seat: string): Booking {
  if (s.screen !== 'map' || !available.has(seat)) return s
  if (s.selected.includes(seat)) {
    const selected = s.selected.filter(id => id !== seat)
    return { ...s, selected }
  }
  if (s.reservedSelection.includes(seat)) return { ...s, reservedSelection: s.reservedSelection.filter(id => id !== seat) }
  const selected = [...s.selected]
  const reservedSelection = [...s.reservedSelection]
  const row = seat[0]
  const seats = rowSeats(row)
  const start = seats.indexOf(seat)
  for (let i = start; i < seats.length; i++) {
    const id = seats[i]
    if (!available.has(id) || (i > start && aisleBefore(row, i))) break
    if (selected.includes(id) || reservedSelection.includes(id)) continue
    if (selected.length < s.quantity) selected.push(id)
    else if (reservedSelection.length < s.extras) reservedSelection.push(id)
    else break
    if (s.hasAutofilled) break
  }
  return { ...s, selected, reservedSelection, hasAutofilled: true }
}
export function transition(previous: Booking, action: Action, now: number): Booking {
  const s = reconcile(previous, now)
  const chosen = s.selected
  const unpaid = s.reservation
  switch (action.type) {
    case 'reset': return fresh()
    case 'preset': return { ...fresh(), screen: 'map', quantity: SHOW.initialSeats.length, extras: 2, selected: SHOW.initialSeats, reservedSelection: SHOW.extraSeats, hasAutofilled: true }
    case 'tick': return s
    case 'back':
      if (s.screen === 'map') return { ...s, screen: 'quantity', quantity: Math.min(10, s.quantity),
        extras: s.extras + Math.max(0, s.quantity - 10), selected: chosen.slice(0, 10),
        reservedSelection: [...chosen.slice(10), ...s.reservedSelection] }
      if (s.screen === 'review') return { ...s, screen: 'map', purchase: 'selecting', reviewChange: undefined }
      if (s.screen === 'payment') return s.receipt ? { ...s, screen: 'ticket', additional: 'idle', payingSeats: [] }
        : { ...s, screen: 'review', purchase: 'reviewing' }
      return s
    case 'quantity':
    case 'extras': {
      if (s.screen !== 'quantity' || !Number.isInteger(action.value)) return s
      if (action.type === 'extras' && s.quantity < MIN_RESERVATION_TICKETS) return s
      const min = action.type === 'quantity' ? 1 : 0
      if (action.value < min || action.value > (min ? 10 : 2)) return s
      const next = reconcile({ ...s, [action.type]: action.value }, now)
      const selected = chosen.slice(0, next.quantity)
      return { ...next, selected, reservedSelection: s.reservedSelection.slice(0, next.extras) }
    }
    case 'map': return s.screen === 'quantity' ? { ...s, screen: 'map' } : s
    case 'select': return pickSeats(s, action.seat)
    case 'review': return s.screen === 'map' && chosen.length === s.quantity && s.reservedSelection.length === s.extras
      ? { ...s, screen: 'review', purchase: 'reviewing' } : s
    case 'together':
    case 'remove': {
      if (s.screen !== 'review' || !s.reservedSelection.length) return s
      const selected = action.type === 'together' ? [...chosen, ...s.reservedSelection] : chosen
      return { ...s, selected, quantity: selected.length, extras: 0, reservedSelection: [],
        reviewChange: { type: action.type, seats: s.reservedSelection } }
    }
    case 'undo': {
      if (s.screen !== 'review' || !s.reviewChange) return s
      const seats = s.reviewChange.seats
      const selected = chosen.filter(id => !seats.includes(id))
      return { ...s, selected, quantity: selected.length, extras: seats.length, reservedSelection: seats, reviewChange: undefined }
    }
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
      const extra = s.reservedSelection
      const active = extra.length > 0 && action.type === 'success'
      return { ...s, screen: 'ticket', purchase: 'purchased', receipt: { id: SHOW.bookingId, seats: chosen },
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
