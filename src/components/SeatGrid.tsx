import { useLayoutEffect, useRef } from 'react'
import type { Booking } from '../booking/model'
import { send } from '../booking/useBooking'
import { aisleBefore, nearestBookedSeat, ROWS, rowSeats, sold, SHOW } from '../demo'

export function SeatGrid({booking: b}: {booking: Booking}) {
  const grid = useRef<HTMLDivElement>(null)
  const previous = useRef([...b.selected, ...b.reservedSelection])
  useLayoutEffect(() => {
    const seats = [...b.selected, ...b.reservedSelection]
    const added = seats.filter(id => !previous.current.includes(id))
    for (const id of previous.current.filter(id => !seats.includes(id))) {
      grid.current?.querySelector(`[data-seat="${id}"]`)?.getAnimations()
        .filter(animation => animation.id === 'seat-fill').forEach(animation => animation.cancel())
    }
    previous.current = seats
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    added.forEach((id, index) => {
      const button = grid.current?.querySelector<HTMLButtonElement>(`[data-seat="${id}"]`)
      button?.animate([
        { backgroundColor: '#fff', color: '#11913c', borderColor: 'var(--green)', transform: 'scale(1)' },
        { transform: 'scale(1.12)', offset: 0.65 },
        { transform: 'scale(1)' },
      ], { id: 'seat-fill', duration: 150, delay: index * 48, easing: 'ease-out', fill: 'backwards' })
    })
  }, [b.selected, b.reservedSelection])
  return <div ref={grid} className="map-scroll" aria-label="Cinema seating plan"><div className="auditorium">
    {['ROYAL','CLUB'].map((tier, i) => <section key={tier} className="tier"><h2>Rs.{SHOW.ticketPaise / 100} &nbsp;{tier}</h2>
      {(i ? ROWS.slice(4) : ROWS.slice(0,4)).map(row => <div className={'seat-row row-' + row} key={row}><span className="row-label">{row}</span>
        <div className="seat-numbers">{rowSeats(row).map((seat, index) => {
          const selected = b.selected.includes(seat)
          const reserved = b.reservedSelection.includes(seat)
          const state = sold(seat) ? 'sold' : selected ? 'selected' : reserved ? 'reserved' : 'available'
          const ineligible = state === 'available' && b.selected.length === b.quantity && b.reservedSelection.length < b.extras && !nearestBookedSeat(seat, b.selected, b.reservedSelection)
          return <button type="button" key={seat} data-seat={seat} disabled={state === 'sold' || ineligible} aria-label={seat + ', ' + (ineligible ? 'not adjacent' : state)}
            aria-pressed={selected || reserved} className={'seat ' + state + (aisleBefore(row, index) ? ' aisle' : '')}
            onClick={() => send({ type: 'select', seat })}>{index + 1}</button>
        })}</div></div>)}</section>)}</div></div>
}
