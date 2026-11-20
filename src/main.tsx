import { createRoot } from 'react-dom/client'
import { useBooking } from './booking/useBooking'
import { StatusBar } from './components/UI'
import { Quantity } from './screens/Quantity'
import { SeatMap } from './screens/SeatMap'
import { Review, Payment } from './screens/ReviewPayment'
import { Ticket } from './screens/Ticket'
import './styles.css'

const screens = { quantity: Quantity, map: SeatMap, review: Review, payment: Payment, ticket: Ticket }
function App() {
  const booking = useBooking()
  const Screen = screens[booking.screen]
  return <div className={'phone view-' + booking.screen}><StatusBar booking={booking}/><Screen booking={booking}/></div>
}
createRoot(document.getElementById('root')!).render(<App/>)