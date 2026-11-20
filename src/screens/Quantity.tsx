import { useState } from 'react'
import { SeatGrid } from '../components/SeatGrid'
import { Armchair, ChevronDown, Info } from 'lucide-react'
import { MIN_RESERVATION_TICKETS, type Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Dialog, Header, Showtime } from '../components/UI'
import { money, SHOW } from '../demo'
import { VehicleIllustration } from '../components/VehicleIllustration'

export function ReservationAccordion({ booking }: {booking: Booking}) {
  const [expanded, setExpanded] = useState(booking.extras > 0)
  const [info, setInfo] = useState(false)
  const eligible = booking.quantity >= MIN_RESERVATION_TICKETS
  const open = eligible && expanded
  return <><div className="reserve-accordion" data-disabled={!eligible} onClick={eligible ? () => setExpanded(value => !value) : undefined}>
    <div className="reserve-heading"><span className="icon-tile"><Armchair/></span>
      <button aria-expanded={open} aria-controls="reserve-settings" className="accordion-title" disabled={!eligible}>Reserve extra seats</button>
      <button className="info-icon" aria-label="About reserving extra seats" disabled={!eligible} onClick={event => { event.stopPropagation(); setInfo(true) }}><Info size={15}/></button>
      <span className="expand" aria-hidden="true"><ChevronDown size={20} style={{ transform: open ? 'rotate(180deg)' : undefined }}/></span></div>
    <p className="reservation-guidance">{eligible
      ? 'Temporarily reserve up to 2 nearby seats.'
      : `Select at least ${MIN_RESERVATION_TICKETS} tickets to reserve extra seats.`}</p>
    <div className="accordion-panel" data-open={open} aria-hidden={!open} inert={!open}><div id="reserve-settings">
      <div className="segments" aria-label="Extra seat quantity">{[0,1,2].map(n => <button key={n} aria-label={n + ' extra seats'} aria-pressed={booking.extras === n} disabled={!eligible} onClick={event => { event.stopPropagation(); send({ type: 'extras', value: n }) }}>{n}</button>)}</div></div></div>
    <div className="quantity-summary">
      <Armchair size={16} aria-hidden="true"/>
      {booking.quantity} to book now <span aria-hidden="true">•</span> {booking.extras} to reserve
    </div>
    </div>{info && <Dialog title="Reserve extra seats" onClose={() => setInfo(false)}><p>Choose up to two extra seats beside your group. Your 10-minute hold starts after you pay for the first tickets. You can buy the extra seats from Your Ticket before the hold expires.</p></Dialog>}</>
}
export function Quantity({ booking: b }: {booking: Booking}) {
  const count = Math.max(10, b.quantity)
  return <><div className="quantity-background" inert><Header movie/><Showtime count={b.quantity}/><SeatGrid booking={b}/></div><div className="scrim"/>
    <section className="quantity-sheet" aria-labelledby="quantity-title"><div className="sheet-grip"/>
    <h2 id="quantity-title">How many seats?</h2><div className="vehicle-stage" key={b.quantity}><VehicleIllustration count={b.quantity}/></div>
    <div aria-label="Tickets to purchase" className="quantities">{Array.from({ length: count }, (_, i) => i+1).map(n => <button key={n} aria-label={n + ' tickets'} aria-pressed={n === b.quantity} onClick={() => send({ type: 'quantity', value: n })}>{n}</button>)}</div>
    <div className="sheet-rule"/><ReservationAccordion booking={b}/>
    <div className="categories">{['CLUB','ROYAL'].map(tier => <div key={tier}><small>{tier}</small><b>{money(SHOW.ticketPaise,0)}</b><strong>AVAILABLE</strong></div>)}</div>
    <Button onClick={() => send({ type: 'map' })}>Select Seats</Button><div className="home-line"/></section></>
}
