import { useState } from 'react'
import { Share2, X } from 'lucide-react'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Dialog } from '../components/UI'
import { ConfirmedTicket, ReservationCard } from '../components/Tickets'
import { money, seatLabel, SHOW, total } from '../demo'

export function Ticket({booking: b}: {booking: Booking}) {
  const [panel,setPanel] = useState<'close'|'share'|null>(null)
  const [copied,setCopied] = useState(false)
  const receipts = [b.receipt!, ...b.additionalReceipts]
  const lines = [SHOW.movie + ' · ' + SHOW.format, SHOW.fullDate + ' | ' + SHOW.time, SHOW.cinema,
    ...receipts.map(r => 'Confirmed: ' + r.seats.map(seatLabel).join(', ') + ' · Paid ' + money(total(r.seats.length)) + ' · ' + r.id)]
  if (b.reservation.status === 'active') lines.push('Reserved, unpaid: ' + b.reservation.seats.map(seatLabel).join(', ') + ' · ' + money(total(b.reservation.seats.length)) + ' due before ' + new Date(b.reservation.expiresAt!).toLocaleTimeString('en-IN'))
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({title:'Booking details', text:lines.join('\n')}); return }
      catch (e) { if (e instanceof DOMException && e.name === 'AbortError') return }
    }
    setCopied(false); setPanel('share')
  }
  return <><header className="ticket-header"><h1>Your Ticket</h1><button onClick={share} className="icon" aria-label="Share ticket"><Share2 size={15}/></button>
    <button className="close-ticket" aria-label="Close ticket" onClick={() => setPanel('close')}><X size={17}/></button></header>
    <main className="scroll ticket-stack">{receipts.map((r,i) => <ConfirmedTicket key={r.id} receipt={r} additional={i>0}/>)}<ReservationCard booking={b} onShare={share}/></main><div className="ticket-home"><div className="home-line"/></div>
    {panel === 'close' && <Dialog title="Your ticket is saved" onClose={() => setPanel(null)}><p>You can close this tab and return to your booking on this device. Starting a new demo booking clears this one.</p><Button onClick={() => setPanel(null)}>View ticket</Button><Button secondary onClick={() => send({type:'reset'})}>Start new demo booking</Button></Dialog>}
    {panel === 'share' && <Dialog title="Share Booking Details" onClose={() => setPanel(null)}><textarea aria-label="Booking details to share" readOnly value={lines.join('\n')} onFocus={e => e.target.select()}/>
      <Button onClick={async () => { try { await navigator.clipboard.writeText(lines.join('\n')); setCopied(true) } catch { document.querySelector('textarea')?.select() } }}>{copied ? 'Copied' : 'Copy details'}</Button></Dialog>}
  </>
}