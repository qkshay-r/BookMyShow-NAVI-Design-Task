import { useState } from 'react'
import { Share2, X } from 'lucide-react'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Dialog } from '../components/UI'
import { ConfirmedTicket, ReservationCard } from '../components/Tickets'

export function Ticket({booking: b}: {booking: Booking}) {
  const [showClose, setShowClose] = useState(false)
  const receipts = [b.receipt!, ...b.additionalReceipts]
  return <><header className="ticket-header"><h1>Your Ticket</h1><button type="button" disabled className="icon" aria-label="Share ticket"><Share2 size={15}/></button>
    <button className="close-ticket" aria-label="Close ticket" onClick={() => setShowClose(true)}><X size={17}/></button></header>
    <main className="scroll ticket-stack">{receipts.map((r,i) => <ConfirmedTicket key={r.id} receipt={r} additional={i>0}/>)}<ReservationCard booking={b}/></main><div className="ticket-home"><div className="home-line"/></div>
    {showClose && <Dialog title="Your ticket is saved" onClose={() => setShowClose(false)}><p>You can close this tab and return to your booking on this device. Starting a new demo booking clears this one.</p><Button onClick={() => setShowClose(false)}>View ticket</Button><Button secondary onClick={() => send({type:'reset'})}>Start new demo booking</Button></Dialog>}
  </>
}
