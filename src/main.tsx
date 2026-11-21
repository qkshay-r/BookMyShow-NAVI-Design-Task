import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { send, useBooking } from './booking/useBooking'
import { Dialog, StatusBar } from './components/UI'
import { Quantity } from './screens/Quantity'
import { SeatMap } from './screens/SeatMap'
import { Review, Payment } from './screens/ReviewPayment'
import { Ticket } from './screens/Ticket'
import './styles.css'

const screens = { quantity: Quantity, map: SeatMap, review: Review, payment: Payment, ticket: Ticket }
function App() {
  const booking = useBooking()
  const [showIntroduction, setShowIntroduction] = useState(true)
  const [resetVersion, setResetVersion] = useState(0)
  useEffect(() => {
    const reset = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'r' || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]')) return
      event.preventDefault()
      send({ type: 'reset' })
      setResetVersion(version => version + 1)
    }
    window.addEventListener('keydown', reset)
    return () => window.removeEventListener('keydown', reset)
  }, [])
  const Screen = screens[booking.screen]
  return <div key={resetVersion} className={'phone view-' + booking.screen}><StatusBar booking={booking}/><Screen booking={booking}/>
    {showIntroduction && <Dialog title="Introducing +2 Seat Reservation" onClose={() => setShowIntroduction(false)}>
      <p>Booking for a group? You can now <strong>reserve up to 2 extra seats</strong> when booking 4 or more tickets.</p>
      <p>Pay for your confirmed friends now and keep 2 nearby seats reserved for another 10 minutes after payment.</p>
      <p>If you don't purchase the extra seats within that time, they'll automatically become available to others.</p>
    </Dialog>}
  </div>
}
createRoot(document.getElementById('root')!).render(<App/>)
