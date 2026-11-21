import { Clock3, Info, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { SeatGrid } from '../components/SeatGrid'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { Button, Dialog, Footer, Header, Showtime } from '../components/UI'
import { money, plural, SHOW } from '../demo'

function SeatLegend() {
  return <div className="legend">{[['available','Available',''],['selected','Selected','(Book now)'],['reserved','Reserved','(Buy within 10 min)'],['sold','Sold','']].map(([key,label,sub]) =>
    <div key={key}><i className={'sample ' + key}/><span>{label}<small>{sub}</small></span></div>)}</div>
}
export function SeatMap({booking: b}: {booking: Booking}) {
  const [info, setInfo] = useState(false)
  const left = b.quantity + b.extras - b.selected.length - b.reservedSelection.length
  const nowLeft = Math.max(0, b.quantity - b.selected.length)
  let hint = b.selected.join(', ') + (b.extras ? ' · ' + b.extras + ' to reserve' : '')
  if (nowLeft > 0) hint = `Select ${nowLeft} ${plural(nowLeft, 'seat')} to book now`
  else if (left > 0) hint = `Reserve ${left} ${plural(left, 'seat')} for later`
  return <><Header movie/><Showtime count={b.quantity} reserved={b.extras} edit={() => send({ type: 'back' })}/>
    <main className="scroll map-body">{b.extras > 0 && <section className="group-banner"><span className="icon-tile"><UsersRound/></span>
      <div><button onClick={() => setInfo(true)} className="group-title">Group booking <Info size={14}/></button><p>{b.quantity} seats now + {b.extras} reserved for later.</p></div>
      <div className="count-pair"><b>{b.quantity}</b> + <b>{b.extras}</b></div></section>}
    <SeatGrid booking={b}/><div className="screen-end"><div className="cinema-screen"><i/></div><p>All eyes this way please!</p></div>
    {b.extras > 0 && <div className="hold-note"><span className="icon-tile"><Clock3/></span><div><b>Reserved seats are kept for 10 minutes</b><p>You can purchase the {b.extras} reserved {plural(b.extras,'seat')} after booking.</p></div></div>}
    </main><SeatLegend/><div className="offer"><b className="bank-check">✔</b><span>YES Private Debit Card Offer</span><small>1/3<i>━ ▬ ▬</i></small></div>
    <Footer><div className="selection-hint" aria-live="polite">{hint}</div>
    <Button disabled={left > 0} onClick={() => send({ type: 'review' })}>Pay {money(b.quantity * SHOW.ticketPaise,0)}</Button></Footer>
    {info && <Dialog title="Group booking" onClose={() => setInfo(false)}><p>Choose any available seats to reserve. Green seats are included in your first payment. Yellow seats are held for 10 minutes after that payment.</p></Dialog>}</>
}
