# RMR Onboarding Flow — prototype notes

**Purpose:** clickable prototype of the rmResident Portal onboarding workflow, built from the Figma section
"Option 1 – Like ApplyNow" (file `RGELIjO4RU4FdsjdB2CsbG`, node `6095:19091`). First half of a two-part effort;
the RMX setup/configuration side comes next.

Open `index.html` (or `screens/01-dashboard.html`) in a browser.

## Flow (order of screens)

1. `01-dashboard` (33%) → Start / View links per task
2. `02-docs-to-sign` → `03-file-upload` → `04-insurance` → `05-pay-charges` → `06-pay-charges-payment`
3. `07-setup-payment-method` → `08-setup-monthly-payment` → (Turn On AutoPay) `09-autopay`, or (Flexible Rent / Manual) straight to `10-pet-information`
4. `10-pet-information` → `11-dashboard-complete` (100%)

The Figma frames named "Pay Charges" and "Payment Method" are consecutive steps, not variants. The
Payment Method / Monthly Payment / Autopay frames are stacked vertically in the file and are ordered here top to bottom.
The Figma note says the Payment Method fields would be pre-filled if the payment method was saved on Pay Charges (and vice versa
depending on step order) — not built; fields are empty as in the mock.

## Last step and Submit (Figma "Form" `6070:43065`, "Prospect Dashboard - Submit" `6473:24568`)

- `10-pet-information` (the last step) now ends with Back, **Save** and **Submit Onboarding** (no Skip). Submit Onboarding goes to `11-dashboard-complete`.
- **Save** marks the step done and goes to `13-dashboard-submit`: the dashboard at 100% with every step "View", `$0.00` balance and a **Submit Onboarding** button, i.e. everything done but not yet submitted. That button goes to `11-dashboard-complete`. Where Save leads is our reading of "this screen appears if they don't submit"; the mocks do not show the link.
- Every onboarding step screen (02 to 10) has a **Back to Dashboard** button at the right of the Context Bar. It is the secondary button style; there is no mock for it, so its look is assumed. It is hidden in the RMX Portal Preview.

## What's real vs faked

Real (from Figma): layout, copy, colors, spacing, type, icons/images (`assets/img`, downloaded from the mocks, unedited), the
step labels on each screen exactly as mocked.

Faked / prototype-only:
- All data (charges, documents, "Visa ending in 1234", balances, dates).
- Routing: Back/Next/Start/View, and the Monthly Payment choice routing (AutoPay → autopay screen; others skip it).
- Radios, checkboxes and selects are live; file "upload" only shows the chosen file name. Sign / print / download / View Options / Edit do nothing.
- `<select>` options (Country, State, Pet type, Account type, Frequency, Day of Month) are placeholder lists — the mocks only show the collapsed control.
- Nothing is validated; Terms checkbox does not gate Next.

## Deviations from the mocks

- Icons stay as individual SVG files in `assets/img/` instead of a single `assets/icons.svg`, so the exported SVGs are used unmodified.
- Frame-level background image fills (the full-frame thumbnails behind each mock) are not used; the "rmResident Portal Background" layer is.
- Footer on the dashboard: only the visible first footer instance is built (the mock has a second, off-canvas duplicate with an info icon).
- Font: Lato via Google Fonts (400 / 700 / 400 italic). The mock's `Lato Medium` (footer company name) renders as the nearest available weight.
- Terms and Conditions text is styled as a link (blue) to match the mock's rendered screenshot; the design context returned it as plain text.
- Layout is fluid (menu fixed 264px, cards max 1184px) rather than fixed 1920×937 frames; at 1920×937 it should match the mocks.
- Screens were generated from one script for consistency; the output is plain, hand-editable HTML.

## Driven by the template designer

- `04-insurance` shows only the insurance options chosen on the Renters Insurance step in `rmx-onboarding-template-designer` (read from the browser tab's session storage, key `rmx-insurance-options`). Opened on its own, with nothing chosen, all four cards show.
- `02-docs-to-sign` lists only the documents chosen in the designer (key `rmx-documents`). The Setup Payment Method step follows `rmx-payment-steps`: Payment Method = `07`, Autopay = `08` and `09`; only Payment Method makes `07` the last page (Skip / Save), only Autopay redirects `07` to `08`.
- A step disappears when the designer's choice for it is empty (`rmx-documents`, `rmx-insurance-options`, `rmx-payment-steps`, `rmx-form`): it leaves the stepper and Back / Next / Skip jump over it. With no designer data at all (prototype opened on its own) every step shows.
- `03-file-upload` builds its upload boxes from the files saved in the designer's Select Files dialog (`rmx-files`); with none saved it shows the default boxes, Profile Photo and Proof of Income.
