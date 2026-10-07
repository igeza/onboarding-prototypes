# RMR Tenant Portal — prototype notes

**Purpose:** the tenant side of rmResident Portal (residents who already live there). Prospect onboarding is the separate `rmr-onboarding-flow` prototype; the two share nothing at runtime.

Source: Figma "RMR Forms", file `RGELIjO4RU4FdsjdB2CsbG`, node `6438:20115`. Open `index.html`.

## Screens

- `13-forms` Available tab (New Pet, Gym Access, Start) → `15-form-new-pet` (Cancel back, Submit → `14-forms-submitted`). Tabs switch between 13 and 14.
- The header, full tenant menu (Forms selected), bell and Samantha Carpenter avatar are as mocked.

## Faked / not real

- Only New Pet opens a form; Gym Access has no mock, so its Start does nothing.
- Every menu item does nothing (there is no tenant dashboard yet).
- The Submitted tab shows New Pet with a Submitted date (MM/DD/YYYY): the day you pressed Submit in this tab, or today if opened directly. The mock leaves the cell empty; the format is not from a mock. Nothing else is saved or validated.
- Form body matches the onboarding Pet Information step (same questions), inside the 1140px card with Cancel / Submit inside it.

## Notes

- `assets/` was copied from `rmr-onboarding-flow` (tokens, buttons, inputs, dropdown, `app.js`); the Forms styles (banner, tabs, forms card) are at the end of `rmr.css`. Icons are the mock's own exports.
- `app.js` still carries the onboarding step logic; it is inert here (no step pages) but can be trimmed.
