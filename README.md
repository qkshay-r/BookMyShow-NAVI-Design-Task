# BookMyShow group booking

A mobile-first usability prototype for the Navi design assignment. The organiser buys confirmed participants’ tickets and can hold up to two additional seats for ten minutes. All payments and cinema inventory are simulated.

## Run locally

From the project directory, with Node.js 22 or newer and npm installed:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The interface fills a phone viewport and stays centred at 390 × 844 px on a large desktop window.

## Follow the 4 + 2 journey

1. Leave the quantity at four. Expand **Reserve extra seats**, choose **2**, then select **Select Seats**.
2. Tap **E6, E7, E8, E9** for the purchase, then **E10, E11** for the hold. Tapping a selected seat removes it. The remaining selections retain their tap order.
3. Tap **Pay ₹1,080** to review the ticket subtotal and ₹184.08 demo fee. **Continue** opens the ₹1,264.08 payment simulation. **Pay together** includes all six tickets for ₹1,896.12. The bin removes the extras.
4. Complete the simulation. **Your Ticket** shows the paid receipt and a separate unpaid reservation. Refresh or reopen the same browser origin to resume it.
5. Choose **Pay for 2 reserved seats** and complete the ₹632.04 payment. A second receipt confirms E10 and E11. The first receipt keeps its original seats and total.

The small code icon beside the phone's bottom navigation bar opens **Demo controls**. The 4 + 2 preset starts on the map with all six seats selected. Timer shortcuts become available after a reservation starts. Reset starts a new booking on this browser origin.

## Build and deploy

### GitHub Pages

The GitHub Pages workflow in `.github/workflows/deploy-pages.yml` builds the app from `main` and publishes `dist/` after each push. In the repository's **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. Then commit and push the workflow and `vite.config.ts` to `main`.

The project URL is `https://qkshay-r.github.io/BookMyShow-NAVI-Design-Task/`. The repository path is configured as Vite's `base`, so assets load under that URL. Open **Actions** to follow the first deployment. The Pages settings will show **Visit site** when it finishes. The booking state lives in each visitor's own browser storage.

### Local build

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory as static files. For a Git-connected Netlify or Vercel project, select Vite, use `npm run build` as the build command and `dist` as the output directory.

For a Netlify CLI deployment, sign into the intended account and select the target project when prompted.

```sh
npx netlify-cli deploy --dir=dist --prod
```

For a Vercel CLI deployment, run from the project root and select the target project.

```sh
npx vercel --prod
```

[Netlify CLI documentation](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/) · [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)

## Project structure

```text
public/                    Local poster, car artwork, Roboto font and licence
src/
  main.tsx                 Phone shell and screen registry
  demo.ts                  Show details, row geometry, seat prices and fees
  styles.css               Shared tokens and reference-based layouts
  booking/
    model.ts               Booking transitions and independent reservation state
    useBooking.ts          Persistence, expiry scheduling and cross-tab updates
  components/
    UI.tsx                 Header, status bar, demo controls, dialogs and buttons
    SeatGrid.tsx           Shared auditorium layout and seat states
    BookingDetails.tsx     Show details and expandable price breakdown
    VehicleIllustration.tsx Seat-count artwork for bicycles, scooters and group vehicles
    Tickets.tsx            Confirmed ticket, reservation card and countdown
  screens/
    Quantity.tsx           Quantity sheet and reservation accordion
    SeatMap.tsx            Seat grid, group summary, legend and booking action
    ReviewPayment.tsx      Booking review and reusable payment simulation
    Ticket.tsx             Paid receipts, outstanding reservation and sharing
```

## Integrating the next designs

Add the new React screen under `src/screens/` and register it in `main.tsx` when it needs its own route. Use `src/components/Tickets.tsx` for a new in-ticket reservation treatment. Send typed actions through `send()` in `useBooking.ts`. The model controls prices through seat counts and maintains a separate receipt for every completed payment.

- `failed` records an initial or additional payment failure, depending on the active checkout. A new success action retries the simulation.
- `success_without_hold` records the initial purchase and marks the extra reservation unavailable.
- `additional` accepts an optional subset of the held seats for partial conversion. Remaining seats keep the original expiry.
- `release` ends the unpaid hold. The paid receipts stay intact.
- Every action checks the absolute expiry before changing the booking, including a payment success. An expired checkout returns to the existing ticket screen.
- A pre-payment inventory failure can be added to the selection or review transition. The current grid uses a fixed sold-seat fixture.

The persisted key is `bms.group-booking.v1`. Monetary values use integer paise. Web Locks serialize writes where supported, and storage events update other tabs. Each browser origin has its own demo booking.

## Visual decisions and remaining polish

The interaction uses the Android-style layout, local Roboto, vehicle illustrations for all ten seat counts and a dummy QR pattern. The sheet initially selects four tickets, with optional extras collapsed. Before payment, the sheet says “to book now” and “to reserve.” The ticket uses the Scene poster and an M-Ticket ribbon. The status bar, bank offer strip and poster serve as visual context for the booking flow.

The vehicle artwork, status icons and smallest spacing details are approximations. The next design pass can replace those assets and refine device-specific safe-area spacing. The expiry and payment-failure messages are intentionally simple until the next reference screens arrive.

The bundled poster comes from the [Scene listing on BookMyShow](https://in.bookmyshow.com/movies/NCR/scene/ET00516631). The bundled font licence is in `public/Roboto-LICENSE.txt`.
