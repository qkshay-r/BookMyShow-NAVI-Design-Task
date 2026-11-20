import { ChevronDown, Pencil } from 'lucide-react'
import { useState } from 'react'
import { money, seatLabel, SHOW, total } from '../demo'
import { Dialog } from './UI'

export function BookingDetails({seats}: {seats: string[]}) {
  const [policy, setPolicy] = useState(false)
  return <><section className="card booking-details"><div className="details-inner">
    <div className="flex justify-between"><h2>{SHOW.movie}</h2><strong>{seats.length}</strong></div>
    <div className="date-line"><b>{SHOW.fullDate} | {SHOW.time}</b><span><Pencil size={13}/> M-Ticket</span></div>
    <p>{SHOW.format.replace(', 2D',' (2D)')}</p><p>{seats.map(seatLabel).join(', ')}</p><p>{SHOW.cinema} (SCREEN {SHOW.screen})</p></div>
    <div className="cancel-block"><b>Cancellation Available</b><p>This venue supports booking cancellation. <button onClick={() => setPolicy(true)}>View cancellation policy</button></p></div></section>
    {policy && <Dialog title="Cancellation policy" onClose={() => setPolicy(false)}><p>This demo uses a 20-minute cancellation cutoff before showtime. All tickets and charges shown here are simulated.</p></Dialog>}</>
}
export function PriceSummary({count}: {count: number}) {
  return <section className="card prices">{[[('Ticket(s) price (' + count + ')'), SHOW.ticketPaise],['Convenience fees', SHOW.feePaise]].map(([label, unit]) =>
    <details key={label}><summary><span>{label} <ChevronDown size={15}/></span>{money(count * Number(unit))}</summary>
      <small>{count} × {money(Number(unit))} per ticket</small></details>)}
    <div className="order-total"><b>Order total</b><b>{money(total(count))}</b></div></section>
}