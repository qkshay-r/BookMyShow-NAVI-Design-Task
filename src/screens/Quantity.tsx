import { useState } from 'react'
import { SeatGrid } from '../components/SeatGrid'
import { Armchair, Info } from 'lucide-react'
import { MIN_RESERVATION_TICKETS, type Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Dialog, Header, Showtime } from '../components/UI'
import { money, SHOW } from '../demo'
import { VehicleIllustration } from '../components/VehicleIllustration'

function ReservationOptions({ booking }: {booking: Booking}) {
  const [info, setInfo] = useState(false)
  const eligible = booking.quantity >= MIN_RESERVATION_TICKETS
  return <><section className="reserve-options" aria-labelledby="reserve-title" data-disabled={!eligible}>
    <div className="reserve-heading"><Armchair size={19} aria-hidden="true"/>
      <h3 id="reserve-title">Reserve extra seats</h3>
      <button className="info-icon" aria-label="About reserving extra seats" disabled={!eligible} onClick={() => setInfo(true)}><Info size={15}/></button></div>
    <p className="reservation-guidance">{eligible
      ? 'Temporarily reserve up to 2 nearby seats.'
      : `Select at least ${MIN_RESERVATION_TICKETS} tickets to reserve extra seats.`}</p>
    <div className="segments" role="group" aria-label="Extra seat quantity">{[0,1,2].map(n =>
      <button key={n} aria-label={n + ' extra seats'} aria-pressed={booking.extras === n} disabled={!eligible}
        onClick={() => send({ type: 'extras', value: n })}>{n}</button>)}</div>
    <output className="quantity-summary" aria-label="Seat selection summary" aria-atomic="true">
      <span><strong>{booking.quantity}</strong> to book now</span>
      <span><strong>{booking.extras}</strong> to reserve</span>
    </output>
    </section>{info && <Dialog title="Reserve extra seats" onClose={() => setInfo(false)}><p>Choose up to two extra seats beside your group. Your 10-minute hold starts after you pay for the first tickets. You can buy the extra seats from Your Ticket before the hold expires.</p></Dialog>}</>
}
export function Quantity({ booking: b }: {booking: Booking}) {
  const count = Math.max(10, b.quantity)
  return <><div className="quantity-background" inert><Header movie/><Showtime count={b.quantity}/><SeatGrid booking={b}/></div><div className="scrim"/>
    <section className="quantity-sheet" aria-labelledby="quantity-title"><div className="sheet-grip"/>
    <h2 id="quantity-title">How many seats?</h2><div className="vehicle-stage" key={b.quantity}><VehicleIllustration count={b.quantity}/></div>
    <div aria-label="Tickets to purchase" className="quantities">{Array.from({ length: count }, (_, i) => i+1).map(n => <button key={n} aria-label={n + ' tickets'} aria-pressed={n === b.quantity} onClick={() => send({ type: 'quantity', value: n })}>{n}</button>)}</div>
    <div className="sheet-rule"/><ReservationOptions booking={b}/>
    <div className="categories">{['CLUB','ROYAL'].map(tier => <div key={tier}><small>{tier}</small><b>{money(SHOW.ticketPaise,0)}</b><strong>AVAILABLE</strong></div>)}</div>
    <Button onClick={() => send({ type: 'map' })}>Select Seats</Button><div className="home-line"/></section></>
}
