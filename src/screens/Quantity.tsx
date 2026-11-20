import { useState } from 'react'
import { SeatGrid } from '../components/SeatGrid'
import { Armchair, ChevronDown, Info } from 'lucide-react'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Dialog, Header, Showtime } from '../components/UI'
import { money, SHOW } from '../demo'

export function ReservationAccordion({ booking }: {booking: Booking}) {
  const [open, setOpen] = useState(booking.extras > 0)
  const [info, setInfo] = useState(false)
  return <><div className="reserve-accordion">
    <div className="reserve-heading"><span className="icon-tile"><Armchair/></span>
      <button aria-expanded={open} aria-controls="reserve-settings" onClick={() => setOpen(!open)} className="accordion-title">Reserve extra seats</button>
      <button className="info-icon" aria-label="About reserving extra seats" onClick={() => setInfo(true)}><Info size={15}/></button>
      <button className="expand" onClick={() => setOpen(!open)} aria-label={open ? 'Collapse reserve options' : 'Expand reserve options'}><ChevronDown size={20} style={{ transform: open ? 'rotate(180deg)' : undefined }}/></button></div>
    <div className="accordion-panel" data-open={open} aria-hidden={!open} inert={!open}><div id="reserve-settings"><p>Temporarily reserve up to 2 nearby seats for late confirmations. Unpaid reserved seats are released after 10 min.</p>
      <div className="segments" aria-label="Extra seat quantity">{[0,1,2].map(n => <button key={n} aria-label={n + ' extra seats'} aria-pressed={booking.extras === n} onClick={() => send({ type: 'extras', value: n })}>{n}</button>)}</div></div></div>
    </div>{info && <Dialog title="Reserve extra seats" onClose={() => setInfo(false)}><p>Choose up to two extra seats beside your group. Your 10-minute hold starts after you pay for the first tickets. You can buy the extra seats from Your Ticket before the hold expires.</p></Dialog>}</>
}
export function Quantity({ booking: b }: {booking: Booking}) {
  const count = Math.max(10, b.quantity)
  return <><div className="quantity-background" inert><Header movie/><Showtime count={b.quantity}/><SeatGrid booking={b}/></div><div className="scrim"/>
    <section className="quantity-sheet" aria-labelledby="quantity-title"><div className="sheet-grip"/>
    <h2 id="quantity-title">How many seats?</h2><img className="seat-car" src="./seat-car.svg" alt="" />
    <div aria-label="Tickets to purchase" className="quantities">{Array.from({ length: count }, (_, i) => i+1).map(n => <button key={n} aria-label={n + ' tickets'} aria-pressed={n === b.quantity} onClick={() => send({ type: 'quantity', value: n })}>{n}</button>)}</div>
    <div className="sheet-rule"/><ReservationAccordion booking={b}/>
    {b.extras > 0 && <div className="quantity-summary"><Armchair size={18}/>{b.quantity} to book now <span>•</span> {b.extras} to reserve</div>}
    <div className="categories">{['CLUB','ROYAL'].map(tier => <div key={tier}><small>{tier}</small><b>{money(SHOW.ticketPaise,0)}</b><strong>AVAILABLE</strong></div>)}</div>
    <Button onClick={() => send({ type: 'map' })}>Select Seats</Button><div className="home-line"/></section></>
}
