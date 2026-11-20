import { Armchair, Clock3, CreditCard, Trash2 } from 'lucide-react'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Footer, Header } from '../components/UI'
import { BookingDetails, PriceSummary } from '../components/BookingDetails'
import { money, plural, seatLabel, SHOW, total } from '../demo'

export function Review({booking: b}: {booking: Booking}) {
  const extra = b.reservedSelection
  return <><Header title="Confirm booking"/><main className="scroll padded review">
    <BookingDetails seats={b.selected}/><PriceSummary count={b.quantity}/>
    {extra.length > 0 && <section className="card extra-review"><div className="seat-clock"><Armchair size={31}/><Clock3 size={17}/></div><div className="extra-main">
      <div className="seat-tags">{extra.map(s => <span key={s}>{s}</span>)}</div>
      <h3>{extra.length} {plural(extra.length,'seat')} reserved for later</h3>
      <p>You can purchase {extra.length === 1 ? 'this seat' : 'these seats'} within <b>10 minutes</b> after completing this booking.</p>
      <div className="extra-actions"><button onClick={() => send({ type: 'together' })}>Pay together</button>
      <button aria-label="Remove extra seats" onClick={() => send({ type: 'remove' })}><Trash2 size={16}/></button></div></div></section>}
    </main><Footer><div className="pay-bar"><div><small>Total</small><strong>{money(total(b.quantity))}</strong></div>
      <Button onClick={() => send({ type: 'checkout' })}>Continue</Button></div></Footer></>
}
export function Payment({booking: b}: {booking: Booking}) {
  const extra = Boolean(b.receipt)
  const seats = extra ? b.payingSeats : b.selected
  return <><Header title="Payment"/><main className="scroll padded payment">
    <section className="card payment-info"><div className="payment-mark"><CreditCard size={24}/></div><h2>Simulated payment</h2>
      <p>{extra ? 'Complete your reserved-seat purchase.' : 'Complete your ticket purchase.'}</p>
      <div className="payment-show"><strong>{SHOW.movie}</strong><p>{SHOW.date} | {SHOW.time}</p><p>{SHOW.cinema}</p><b>{seats.map(seatLabel).join(', ')}</b></div>
    </section><PriceSummary count={seats.length}/>
    <p className="demo-notice">Demo payment only. No money will be charged.</p>
    {(b.additional === 'failed' || b.purchase === 'payment_failed') && <p role="status">Payment failed. You can try again.</p>}</main>
    <Footer><Button onClick={() => send({ type: 'success' })}>Pay {money(total(seats.length))}</Button></Footer></>
}