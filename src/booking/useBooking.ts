import { useEffect, useSyncExternalStore } from 'react'
import { fresh, reconcile, transition, type Action, type Booking } from './model'

const KEY = 'bms.group-booking.v1'
function read(fallback: Booking) {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    const value = JSON.parse(raw)
    if (value?.version === 1 && value.reservation && Array.isArray(value.selected) && Array.isArray(value.additionalReceipts)) return value as Booking
  } catch { /* Storage may be disabled for this browser session. */ }
  return fallback
}
let current = reconcile(read(fresh()), Date.now())
const listeners = new Set<() => void>()
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn) } }
function publish(next: Booking) {
  current = next
  listeners.forEach(fn => fn())
}
export function send(action: Action) {
  const update = () => {
    const next = transition(read(current), action, Date.now())
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* Continue in memory. */ }
    publish(next)
  }
  if (navigator.locks) void navigator.locks.request(KEY, update)
  else update()
}
export function useBooking() {
  const booking = useSyncExternalStore(subscribe, () => current)
  useEffect(() => {
    const sync = () => {
      const saved = read(current)
      const next = reconcile(saved, Date.now())
      publish(next)
      if (next !== saved) send({ type: 'tick' })
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('pageshow', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('pageshow', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  useEffect(() => {
    if (booking.reservation.status !== 'active') return
    const timer = window.setTimeout(() => send({ type: 'tick' }), Math.max(0, booking.reservation.expiresAt! - Date.now()))
    return () => clearTimeout(timer)
  }, [booking.reservation.status, booking.reservation.expiresAt])
  return booking
}
