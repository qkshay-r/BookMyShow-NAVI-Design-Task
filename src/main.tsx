import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { send, useBooking } from './booking/useBooking'
import { StatusBar } from './components/UI'
import { Quantity } from './screens/Quantity'
import { SeatMap } from './screens/SeatMap'
import { Review, Payment } from './screens/ReviewPayment'
import { Ticket } from './screens/Ticket'
import './styles.css'

const screens = { quantity: Quantity, map: SeatMap, review: Review, payment: Payment, ticket: Ticket }
function App() {
  const booking = useBooking()
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
  return <div key={resetVersion} className={'phone view-' + booking.screen}><StatusBar booking={booking}/><Screen booking={booking}/></div>
}
createRoot(document.getElementById('root')!).render(<App/>)
