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
    {showIntroduction && <Dialog title="+2 Seat Reservation" label="Designer's note" onClose={() => setShowIntroduction(false)}>
      <p>The feature allows users to book confirmed seats while temporarily reserving nearby seats for friends who haven't decided yet. The following limits balance user flexibility with business needs.</p>
      <h3 className="designer-note-heading">Why these limits?</h3>
      <ul className="designer-note-limits">
        <li><strong>Minimum 4 tickets:</strong> Ensures an initial purchase commitment before additional seats can be reserved.</li>
        <li><strong>Maximum 2 extra seats:</strong> Limits the amount of unpaid inventory blocked from other moviegoers.</li>
        <li><strong>10-minute limit:</strong> Gives friends a short window to confirm without holding seats indefinitely.</li>
      </ul>
    </Dialog>}
  </div>
}
createRoot(document.getElementById('root')!).render(<App/>)
