import { useState } from 'react'
import { Armchair, CreditCard, Trash2, Undo2 } from 'lucide-react'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Dialog, Footer, Header } from '../components/UI'
import { BookingDetails, PriceSummary } from '../components/BookingDetails'
import { money, plural, seatLabel, SHOW, total } from '../demo'

export function Review({booking: b}: {booking: Booking}) {
  const [confirm, setConfirm] = useState<'together' | 'remove' | null>(null)
  const extra = b.reservedSelection
  const seats = b.reviewChange?.seats ?? extra
  const paying = confirm === 'together'
  return <><Header title="Confirm booking"/><main className="scroll padded review">
    <BookingDetails seats={b.selected}/><PriceSummary count={b.quantity}/>
    {seats.length > 0 && <section className="card extra-review">
      <div className="extra-heading"><Armchair size={19}/><h3>{b.reviewChange
        ? b.reviewChange.type === 'together' ? 'Added to this payment' : 'Removed from reservation'
        : `${seats.length} ${plural(seats.length,'seat')} reserved for later`}</h3></div>
      <div className="seat-tags">{seats.map(s => <span key={s}>{s}</span>)}</div>
      {b.reviewChange ? <div className="extra-actions"><button onClick={() => send({ type: 'undo' })}><Undo2 size={15}/>Undo</button></div> : <>
        <p>Pay now or buy these seats within <b>10 minutes</b> of completing your booking.</p>
        <div className="extra-actions"><button onClick={() => setConfirm('together')}>Pay now</button>
          <button onClick={() => setConfirm('remove')}><Trash2 size={15}/>Delete</button></div></>}
    </section>}
    {confirm && extra.length > 0 && <Dialog title={paying ? 'Pay for these seats now?' : 'Delete reserved seats?'} onClose={() => setConfirm(null)}>
      <p>{paying ? `Add ${extra.join(', ')} to this payment for ${money(total(extra.length))}. Your new total will be ${money(total(b.quantity + extra.length))}.`
        : `Remove ${extra.join(', ')} from your reservation? Your ${b.quantity} book-now tickets will still be included.`}</p>
      <div className="review-dialog-actions"><Button secondary onClick={() => setConfirm(null)}>Cancel</Button>
        <Button onClick={() => { send({ type: confirm }); setConfirm(null) }}>{paying ? 'Pay now' : 'Delete'}</Button></div>
    </Dialog>}
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
