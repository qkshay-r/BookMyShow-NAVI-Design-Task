import { useState } from 'react'
import { ChevronRight, Share2, X } from 'lucide-react'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, DemoControls, Dialog } from '../components/UI'
import { ConfirmedTicket, ReservationCard } from '../components/Tickets'
import { money, nearestBookedSeat, seatLabel, total } from '../demo'

function ChooseSeat({booking, close}: {booking: Booking; close: () => void}) {
  const seats = booking.reservation.seats
  const booked = [booking.receipt!, ...booking.additionalReceipts].flatMap(receipt => receipt.seats)
  const options = seats.map(seat => {
    const neighbour = nearestBookedSeat(seat, booked, seats)
    const location = `Row ${seat[0]}, seat ${seat.slice(1)}`
    if (!neighbour) return { seat, beside: false, description: location, summary: location }
    const step = Number(neighbour.slice(1)) - Number(seat.slice(1))
    const between = seat[0] + (Number(seat.slice(1)) + Math.sign(step))
    const beside = Math.abs(step) === 1
    const description = beside ? `Next to your group · directly beside ${neighbour}`
      : `One seat away · ${between} is between you and ${neighbour}`
    return { seat, beside, description, summary: beside ? 'Beside your group' : 'One seat away' }
  }).sort((a, b) => Number(b.beside) - Number(a.beside))
  const [choice, setChoice] = useState(options[0].seat)
  const selected = options.find(option => option.seat === choice) ?? options[0]
  return <><header className="ticket-header"><h1>Choose your seat</h1><button className="close-ticket" aria-label="Close seat choice" onClick={close}><X size={17}/></button></header>
    <main className="scroll seat-choice"><h2>Which seat are you paying for?</h2><p>Choose 1 of your {seats.length} reserved seats.</p>
      <fieldset aria-label="Reserved seats">{options.map(option => <label key={option.seat}>
        <input type="radio" name="reserved-seat" checked={selected.seat === option.seat} onChange={() => setChoice(option.seat)}/>
        <span><b>{seatLabel(option.seat)}</b><strong>{money(total(1))}</strong><small>{option.description}</small></span>
      </label>)}</fieldset>
      <p>Only the selected seat will be paid for. The other seat stays reserved until the hold expires.</p>
      <section className="choice-total"><div><b>1 seat · {seatLabel(selected.seat)}</b><strong>{money(total(1))}</strong></div>
        <p>{selected.summary}</p>
        <Button onClick={() => send({type:'additional', seats:[selected.seat]})}>Pay for seat {selected.seat}<ChevronRight size={17}/></Button></section>
    </main><div className="ticket-home"><div className="home-line"/></div></>
}

export function Ticket({booking: b}: {booking: Booking}) {
  const [showClose, setShowClose] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [choosing, setChoosing] = useState(false)
  if (choosing && b.reservation.status === 'active' && b.reservation.seats.length > 1) {
    return <ChooseSeat booking={b} close={() => setChoosing(false)}/>
  }
  const receipts = [b.receipt!, ...b.additionalReceipts]
  return <><header className="ticket-header"><h1>Your Ticket</h1><button type="button" className="icon" aria-label="Share ticket"><Share2 size={15}/></button>
    <button className="close-ticket" aria-label="Close ticket" onClick={() => setShowClose(true)}><X size={17}/></button></header>
    <main className="scroll ticket-stack">{receipts.map((r,i) => <ConfirmedTicket key={r.id} receipt={r} additional={i>0}/>)}<ReservationCard booking={b} chooseOne={() => setChoosing(true)}/></main><div className="ticket-home"><div className="home-line"/></div>
    {showClose && <Dialog title="Your ticket is saved" onClose={() => setShowClose(false)}><p>You can close this tab and return to your booking on this device. Resetting the prototype clears this booking and returns to the number of seats with 4 to book and 2 to reserve.</p>
      <Button onClick={() => { setShowClose(false); send({type:'reset_group'}) }}>Reset prototype (4+2)</Button>
      <Button secondary disabled={b.reservation.status !== 'active'} onClick={() => { setShowClose(false); send({type:'expire'}) }}>Simulate expiry</Button>
      <Button secondary onClick={() => { setShowClose(false); setShowDemo(true) }}>Demo controls</Button>
    </Dialog>}
    {showDemo && <DemoControls booking={b} onClose={() => setShowDemo(false)}/>}
  </>
}
