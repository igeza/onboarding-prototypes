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

- `10-pet-information` (the last step) now ends with Back, **Submit** and **Finish Onboarding** (no Skip), as in the Figma Form frame. Finish Onboarding goes to `11-dashboard-complete`.
- **Submit** marks the step done and goes to `13-dashboard-submit`: the dashboard at 100% with every step "View", `$0.00` balance and a **Finish Onboarding** button, i.e. everything done but not yet submitted. That button opens the Onboarding Submitted overlay (Figma `6645:24131`, close it to continue) and then goes to `11-dashboard-complete`. Where Save leads is our reading of "this screen appears if they don't submit"; the mocks do not show the link.
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

## Submit / Update (Figma "RMR Onboarding" section `6095:19091`)

So a resident can tell whether a step is done: a step's main button says **Submit** until the step is done, and **Update** once it is (Update is our addition; the mocks only show Submit). Steps with the button: Documents to Sign, File Upload, Insurance, Setup Payment Method (the Autopay page) and Additional Information. Submit saves the step and goes to the next one; **Update** saves any changes and goes back to the dashboard. **Skip** leaves the step as it was and moves on. On Documents to Sign, as mocked, Submit stays disabled until every document is signed. The Pay Charges pages and the Payment Method choice screens keep their own Back / Next buttons.


**Submit / Update gating**: a step's main button stays disabled until its required information is in. Every question or field marked * needs an answer (text, dropdown choice, chosen radio, uploaded file); File Upload also needs every file box filled; Insurance "Already purchased" needs the interested-party box ticked and the * fields. Once a step is done the button reads Update and stays disabled until something is uploaded or changed. Documents to Sign keeps its own rule (every document signed).

Finish Onboarding (Pet Information) is disabled until every other step is marked complete and this step's required information is filled in.


**Saved payment method (Figma Payment Method `6070:42409`)**: if Save as Your Payment Method is ticked when Submit Payment is used on the Pay Charges payment, Set up Payment Method opens with "Visa ending in 1234" as a saved method (pencil opens the add form), the platform-fee note and terms checkbox at the bottom. Without a saved method it shows the add form as before. The card number is a placeholder.

**Review step (`14-finish`)**: a last step, Review, is added to every page's stepper. Submit on Additional Information now goes to it. It lists each step (hidden ones left out) with Completed / Skipped / Not started and View / Start links, and holds **Finish Onboarding**, which stays disabled until every step is complete and then opens the Onboarding Submitted overlay (close it to reach the completed dashboard). Finish Onboarding was removed from Pet Information. The 100% dashboard (`13-dashboard-submit`) still has its own Finish Onboarding button.

The Onboarding Submitted overlay shows the message set in the RMX template Settings (Message that displays after onboarding is completed) when one is saved in the same browser tab.


## Account Information (Figma `6070:39963`)

`screens/01a-account-information.html` is built from the Account Information frame: First / Last Name, Email Address (Manage Subscription link, mark-email-read icon), Employer, Profile Photo, Phone Numbers register (type dropdown, primary-phone radio, delete icon, Add Phone Number), the text-message consent note, and Emergency Contacts. Skip and Submit both go to File Upload. It is used as the preview for the Account Information step in the RMX template designer and is not yet part of the dashboard's step routing. The mock's stepper has no Documents to Sign; the page's stepper lists Account Information, File Upload, Insurance, Pay Charges, Setup Payment Method, Pet Information. Nothing is validated or saved; the dropdowns, Add Phone Number, delete and Manage Subscription do nothing. `delete.svg` and `mark-email-read.svg` come from the mock.

**Thumbnail mode** (iframe named `rmr-thumb`, used by the RMX designer): text inside the step card is wrapped in `.skel` spans and drawn as rounded gray blocks (`rmr.css`, `app.js`).

**Display conditionally in the pet forms**: question 6 (Vaccination Records) shows only while question 3 (up to date on vaccinations) is answered Yes. Driven by `data-cond-q` / `data-cond-val` on the question and `assets/conditional.js`; the form preview uses the same script for rules set in the designer.
