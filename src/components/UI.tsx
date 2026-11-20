import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { BatteryFull, ChevronLeft, CodeXml, Signal, Wifi, X } from 'lucide-react'
import { SHOW } from '../demo'
import { send } from '../booking/useBooking'
import type { Booking } from '../booking/model'

export function Button({ children, secondary, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { secondary?: boolean }) {
  return <button {...props} className={secondary ? 'secondary' : 'primary'}>{children}</button>
}
export function Dialog({ title, children, onClose }: {title: string; children: ReactNode; onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const el = ref.current!; el.showModal(); return () => el.close() }, [])
  return <dialog ref={ref} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose() }}>
    <div className="dialog-body"><div className="flex items-center justify-between gap-3"><h2>{title}</h2><button aria-label="Close dialog" className="icon" onClick={onClose}><X size={19}/></button></div>{children}</div>
  </dialog>
}
export function StatusBar({ booking }: {booking: Booking}) {
  const [demo, setDemo] = useState(false)
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const refresh = () => setTime(new Date())
    const timer = window.setInterval(refresh, 1000)
    document.addEventListener('visibilitychange', refresh)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', refresh) }
  }, [])
  const active = booking.reservation.status === 'active'
  const run = (type: 'reset' | 'preset' | 'shorten' | 'expire') => { send({ type }); setDemo(false) }
  const hour = time.getHours() % 12 || 12
  const displayTime = `${hour}:${String(time.getMinutes()).padStart(2, '0')}`
  return <><div className="statusbar"><b aria-label={`Current time ${time.toLocaleTimeString()}`}>{displayTime}</b>
    <div className="status-icons"><Wifi size={16} aria-label="Wi-Fi"/><Signal size={16} aria-label="Network"/><BatteryFull size={19} aria-label="Battery full"/></div></div>
    <button className="demo-icon" aria-label="Demo controls" title="Demo controls" onClick={() => setDemo(true)}><CodeXml size={15}/></button>
    {demo && <Dialog title="Demo controls" onClose={() => setDemo(false)}><div className="demo-list">
      <button onClick={() => run('preset')}>Load default 4 + 2 booking</button><button disabled={!active} onClick={() => run('shorten')}>Advance to 30 seconds remaining</button>
      <button disabled={!active} onClick={() => run('expire')}>Expire reservation immediately</button><button onClick={() => run('reset')}>Reset prototype</button></div></Dialog>}</>
}
export function Header({ title, movie = false, onBack }: { title?: string; movie?: boolean; onBack?: () => void }) {
  return <header className={'header ' + (movie ? 'movie-header' : '')}>
    <button className="icon back" aria-label="Go back" onClick={onBack ?? (() => send({ type: 'back' }))}><ChevronLeft size={25}/></button>
    <div>{movie ? <><h1>{SHOW.movie}</h1><p>{SHOW.cinema}</p></> : <h1>{title}</h1>}</div></header>
}
export function Footer({children}: {children: ReactNode}) { return <footer className="footer">{children}<div className="home-line"/></footer> }
export function Showtime({ count, edit }: { count: number; edit?: () => void }) {
  return <section className="showtime"><div className="flex items-center justify-between"><b>{SHOW.date}</b><button onClick={edit} className="edit-tickets"><span aria-hidden="true">✎</span> {count} {count === 1 ? 'Ticket' : 'Tickets'}</button></div>
  <span className="time-chip">{SHOW.time}</span></section>
}
