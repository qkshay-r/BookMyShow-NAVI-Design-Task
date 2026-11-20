import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { ROWS, rowSeats, sold, SHOW } from '../demo'

export function SeatGrid({booking: b}: {booking: Booking}) {
  return <div className="map-scroll" aria-label="Cinema seating plan"><div className="auditorium">
    {['ROYAL','CLUB'].map((tier, i) => <section key={tier} className="tier"><h2>Rs.{SHOW.ticketPaise / 100} &nbsp;{tier}</h2>
      {(i ? ROWS.slice(4) : ROWS.slice(0,4)).map(row => <div className={'seat-row row-' + row} key={row}><span className="row-label">{row}</span>
        <div className="seat-numbers">{rowSeats(row).map((seat, index) => {
          const position = b.selected.indexOf(seat)
          const state = sold(seat) ? 'sold' : position < 0 ? 'available' : position < b.quantity ? 'selected' : 'reserved'
          const aisle = row < 'E' && index === (row === 'A' ? 8 : 11)
          return <button type="button" key={seat} disabled={state === 'sold'} aria-label={seat + ', ' + state}
            aria-pressed={position >= 0} className={'seat ' + state + (aisle ? ' aisle' : '')}
            onClick={() => send({ type: 'select', seat })}>{index + 1}</button>
        })}</div></div>)}</section>)}</div></div>
}
