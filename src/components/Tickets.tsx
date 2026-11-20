import { useEffect, useState } from 'react'
import { ChevronRight, Clock3, ClockAlert, Share2 } from 'lucide-react'
import type { Booking, Receipt } from '../booking/model'
import { send } from '../booking/useBooking'
import { money, plural, seatLabel, SHOW, total } from '../demo'
import { Button, Dialog } from './UI'

function DummyQR() {
  const insideFinder = (x: number, y: number) => (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)
  const squares = Array.from({length: 625}, (_, i) => {
    const x = i % 25, y = Math.floor(i / 25)
    return !insideFinder(x, y) && Math.sin(i * 91.714 + x * y) > 0 ? <rect key={i} x={x} y={y} width="1" height="1"/> : null
  })
  return <svg className="dummy-qr" role="img" aria-label="Demo ticket QR pattern" viewBox="-1 -1 27 27" shapeRendering="crispEdges">
    {squares}{[[0,0],[18,0],[0,18]].map(([x,y]) => <g key={x+'-'+y}><rect x={x} y={y} width="7" height="7"/><rect x={x+1} y={y+1} width="5" height="5" fill="white"/><rect x={x+2} y={y+2} width="3" height="3"/></g>)}</svg>
}
export function ConfirmedTicket({receipt, additional = false}: {receipt: Receipt; additional?: boolean}) {
  const [details, setDetails] = useState(false)
  return <article className="ticket card" aria-label={additional ? 'Additional confirmed ticket' : 'Confirmed ticket'}>
    {additional && <div className="additional-title">Additional tickets confirmed</div>}
    <div className="ticket-top"><div className="poster"><img src="./scene.jpg" alt="Scene film poster"/><span>M-Ticket</span></div>
      <div className="ticket-copy"><h2>{SHOW.movie}</h2><p>{SHOW.format}</p><p>{SHOW.date} | {SHOW.time}</p><p>{SHOW.cinema}</p></div><span className="vertical-ticket">M-Ticket</span></div>
    <div className="perforation"><button onClick={() => setDetails(true)}>Tap for support, details &amp; more actions</button></div>
    <div className="ticket-stub"><DummyQR/><div className="stub-copy"><h3>{receipt.seats.length} Ticket(s)</h3><b>SCREEN {SHOW.screen}</b><p>{receipt.seats.map(seatLabel).join(', ')}</p><strong>BOOKING ID: {receipt.id}</strong></div></div>
    <div className="ticket-policy">Cancellation available up to 20 minutes before showtime</div>
    <div className="ticket-total"><span>Total Amount</span><b>{money(total(receipt.seats.length))}</b></div>
    {details && <Dialog title="Ticket details" onClose={() => setDetails(false)}><p><b>Booking ID {receipt.id}</b></p><p>Payment successful for {receipt.seats.map(seatLabel).join(', ')}.</p><p>{SHOW.cinema} · Screen {SHOW.screen}</p><p>These demo tickets are stored on this device.</p></Dialog>}
  </article>
}
export function Countdown({expiresAt}: {expiresAt: number}) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const refresh = () => setNow(Date.now())
    refresh()
    const timer = window.setInterval(refresh, 250)
    document.addEventListener('visibilitychange',refresh)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange',refresh) }
  }, [expiresAt])
  const s = Math.max(0, Math.ceil((expiresAt-now)/1000))
  const time = [Math.floor(s/60),s%60].map(n=>String(n).padStart(2,'0')).join(':')
  return <div className="countdown"><Clock3 size={21}/><span><b>Reserved for</b><small>Minutes remaining</small></span><strong role="timer">{time}</strong></div>
}
export function ReservationCard({booking: b}: {booking: Booking}) {
  const r = b.reservation
  if (['none','converted'].includes(r.status)) return null
  if (r.status === 'expired') return <section className="reservation-card reservation-cancelled" role="status">
    <div className="cancellation-heading"><ClockAlert size={19} aria-hidden="true"/><h2>Reservation cancelled</h2></div>
    <p>The timer expired and {r.seats.map(seatLabel).join(', ')} {r.seats.length === 1 ? 'was' : 'were'} released.</p>
    <p>Your paid tickets are confirmed.</p>
  </section>
  const n = r.seats.length
  if (r.status !== 'active') return <section className="reservation-card inactive"><h2>Reservation {r.status}</h2><p>{r.seats.map(seatLabel).join(', ')} · {r.status === 'unavailable' ? 'Could not be held' : 'Released'}</p><p>Your purchased tickets remain confirmed.</p></section>
  return <section className="reservation-card"><h2>{n} Reserved {plural(n,'seat')}</h2><p className="reserved-list">{r.seats.map(seatLabel).join(', ')}</p>
    <p>Complete payment before your reservation expires.</p><Countdown expiresAt={r.expiresAt!}/>
    <div className="reserved-price"><span>Total for {n} {plural(n,'seat')}</span><b>{money(total(n))}</b></div>
    <Button onClick={() => send({type:'additional'})}>Pay for {n} reserved {plural(n,'seat')}<ChevronRight size={18}/></Button>
    <Button secondary disabled><Share2 size={16}/>Share Booking Details</Button></section>
}
