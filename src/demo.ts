export const SHOW = {
  movie: 'Scene', cinema: 'INOX: Pacific Mall, Jasola', date: 'Fri, 20 Nov',
  fullDate: 'Fri, 20 Nov, 2026', time: '10:30 PM', format: 'Tamil, 2D', screen: 4,
  ticketPaise: 27000, feePaise: 4602, holdMs: 600000, bookingId: 'SCE4JSL',
  initialSeats: ['E6', 'E7', 'E8', 'E9'], extraSeats: ['E10', 'E11'],
}
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const
export const aisleBefore = (row: string, index: number) => row < 'E' && index === (row === 'A' ? 8 : 11)
export const rowSeats = (row: string) => Array.from({ length: row === 'A' ? 11 : row < 'E' ? 13 : 11 }, (_, i) => row + (i + 1))
export const sold = (seat: string) => seat.startsWith('C') || ['A7', 'A8'].includes(seat)
export const available = new Set(ROWS.flatMap(rowSeats).filter(s => !sold(s)))
// Return the uninterrupted section of the selection containing this seat.
function connectedSeats(seat: string, seats: string[]) {
  const row = seat[0]
  const start = Number(seat.slice(1))
  let first = start
  let last = start
  while (!aisleBefore(row, first - 1) && seats.includes(row + (first - 1))) first--
  while (!aisleBefore(row, last) && seats.includes(row + (last + 1))) last++
  return rowSeats(row).slice(first - 1, last)
}
export function nearestBookedSeat(seat: string, booked: string[], reserved: string[]) {
  const run = connectedSeats(seat, [...booked, ...reserved])
  const distance = (id: string) => Math.abs(Number(id.slice(1)) - Number(seat.slice(1)))
  return run.filter(id => booked.includes(id)).sort((a, b) => distance(a) - distance(b))[0]
}
export const seatLabel = (seat: string) => (seat[0] < 'E' ? 'RY-' : 'CL-') + seat
export const money = (paise: number, decimals = 2) =>
  '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
export const total = (count: number) => (SHOW.ticketPaise + SHOW.feePaise) * count
export const plural = (n: number, word: string) => word + (n === 1 ? '' : 's')
