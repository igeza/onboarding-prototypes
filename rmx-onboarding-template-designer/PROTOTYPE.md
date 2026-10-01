# Onboarding Template Designer

The RMX (Rent Manager Express) side of the resident onboarding work: where a property manager creates and configures the
onboarding workflow that prospects then see in rmResident Portal. Companion to `rmr-onboarding-flow/` (the portal side).

**Owner** Izzy Geza · **Started** 2026-09-29 · **Design system** RMX · **Built with** rmx-prototyping 4.2.0
Source: Figma "RMR New Feature – Onboarding Workflow", node `6151:19293` (Onboarding Template Designer).

## Screens

| Screen | What it shows |
|---|---|
| [`screens/workflow-templates.html`](screens/workflow-templates.html) | Workflow Templates register (Default / Residential / Commercial), search, Show Inactive, Add Workflow Template |
| [`screens/add-workflow-template.html`](screens/add-workflow-template.html) | The same register with the Add Workflow Template dialog open. Cancel / X closes it; Save goes to the details screen |
| [`screens/workflow-template-details.html`](screens/workflow-template-details.html) | The designer: template name, Active, "Steps must be completed in order", trigger and due date, and the step register (action dropdown per step) |
| [`screens/select-files.html`](screens/select-files.html) | Details screen with the Select Files dialog open (from "Select Files" on the File Upload step) |

Flow: register → Add Workflow Template → Save → designer → Select Files. Clicking a template name on the register also opens the designer.
Open `flow.html` for the whole flow as one link: all four screens are embedded in a single file, so moving between them never loads a page (browser Back works too). It is generated from `screens/`, so it needs rebuilding after any screen edit. Open `index.html` for the index.

## Connected through the Mega Menu

Two Mega Menu entries are opted in (everything else in the menu still does nothing): **Services > Online Listing > Workflow Templates** opens the Workflow Templates register (`screens/workflow-templates.html`; Add Workflow Template, then the designer, work from there), and **Communication > Forms > Form Templates** opens the Form Templates register in `../rmx-onboarding-form-designer/screens/form-templates.html`. Both prototypes carry the same two links, so you can move between them from any screen's menu. `flow.html` (the one-file bundle) does not include these links; use the screens in `screens/`, served from the parent folder.

## Tenants and Prospect (reached from the Mega Menu)

**Rental Info > General > Tenants** opens `screens/tenants.html` (Figma RMX Pages `1979:27399`); the old "Tenant Register" menu entry is removed. Charlie Apegian (first row, orange marker) is a link and opens `screens/prospect.html` (Figma Onboarding Workflow `6140:21170`, Prospect Details - Workflow): scoreboard, an Onboarding Overview tile (clicking the step row opens the Onboarding Overview dialog from the same frame), History / Notes, Rent Quotes, Forms, Lead Information, Preferences, Reservation, and the Action Bar rail. Search filters the Tenants register; every other control is marked not built (clicking does nothing): Bulk Actions, Saved Filters, Add Tenant / Add Guest, row kebabs, the other tenants, paging, Jump to Board, View Workflow Project, the Action Bar buttons, all links inside the tiles.

Forms tile rows open the Form Details dialogs from Figma `6363:18800`: Pet Information (Approved) opens Form Approved, New Pet (Complete) opens Form Completed, Vehicle Information (Pending Approval) opens Form Need Approval (the newer frame `6386:14029`: Submitted Date, numbered responses and Path / Current Value / New Value mapping tiles; Reject is the secondary button). All three show the same mock content (Samantha Carpenter, Pet Information); Approve opens the Add Note dialog, and Add marks that row Approved. Reject and Go to field are not built.

Icons: `units`, `library-add` and `library-add-filled` were harvested from the mock's own instances into `assets/icons-local.svg`. The Stage field's history button uses the core `schedule` clock glyph instead of the mock's Express history icon, because that glyph could not be harvested (the export returns the library placeholder). Swap it for `prospect-stage-history` (library key `e851774b09449cfbfe0e9316ea49c6487bc4111e`) when it is harvested.

Menu links to these screens are also in `../rmx-onboarding-form-designer/assets/megamenu.js`.

## Not real yet

- Every template opens the same "Default Onboarding" designer; nothing saves or persists.
- Preview opens a Portal Preview overlay with the rmResident Portal onboarding flow (`../rmr-onboarding-flow`, all six steps, starting at the first step, with no dashboard, side menu or header). It needs the parent folder served, since it loads that prototype by relative path.
- Steps reorder by dragging the handle at the end of the row (order is not saved). The step kebab has Copy (duplicates the step under itself, including its choices) and Delete. Add Step appends an empty row (blank name, Action "Select Action"). Choosing an Action swaps in the Additional Information control that action uses (Signable Document: documents multiselect; File Attachment: Select Files; Setup Payment Method: steps multiselect; Form: form picker; Renters Insurance Selection: insurance options multiselect, which decides which cards the resident sees on the Insurance step in Portal Preview (Master Policy = Enroll in Master Policy, Upload Policy = I've Already Purchased a Policy, LeaseTrack = the LeaseTrack card, No Insurance = I'll Purchase a Policy Later; none chosen shows all four; kept in the browser tab); Make a Payment: none). The Required column is hidden for now (markup kept).
- Settings (the main button, not its caret) opens the Settings overlay (Figma Workflow Project - Settings `6387:17661`): name, description, type, properties, naming convention, the two checkboxes and the collapsible rmResident Portal Settings section with the Dashboard Message. Save closes it with a toast; nothing is stored. The mock's "Default Onbaording" is built as "Default Onboarding".
- Not built (clicking does nothing): Preview Board (hidden), the Settings caret, row kebab,
  property "+N" pill lists, Select Properties, Open Script Builder, Add File / delete file, the page-level print, refresh and help.
- Dropdown option lists are placeholders where the mocks only show a closed field (Trigger By, Due Date, Additional Information pickers, Map to Rent Manager Field). "Select Documents to Send Out" is a multiselect with a search bar on top (filters as you type, "No results" when nothing matches). "Select Steps to Include" on the Setup Payment Method step is a multiselect (Payment Method, Autopay): options toggle with checkboxes and the menu stays open.
  The Action list is the one in the mock.
- Search filters the register rows; Show Inactive does nothing (no inactive templates).

## Working on it

```
node <skill>/scripts/check.mjs .          # stamp + audit, before sharing
node <skill>/scripts/bundle.mjs .         # self-contained copies for publishing
```

## Deliberate deviations

| Rule / where | What | Why we kept it |
|---|---|---|
| `bespoke-on-component` — Dialog Overlay (add-workflow-template, select-files) | The audit renders the page after the dialog has opened, and the prototype's own `app.js` adds `is-open` when it does. | The screen is meant to be *shown* with the dialog open, so it opens on load. Nothing hand-written is on the element. |
| `control-height` 32px — step register cells | Fields and dropdowns inside register rows are 32px. | Matches the mock (Cell 44px holding a 32px Input Field). |
| `control-height` 80px — Help Text | Text Box is 80px. | It is a Text Box, not a single-line field. |
| `contrast` 3.64:1 — link blue | `--text-link` on white. | System token; not overridden. |
| `responsive-overflow` at 375px | Step register and template register scroll inside their container below 768px. | Per `responsive.md` a wide register scrolls in its container; the step register needs a design for phone width if that matters. |
| Callout text weight — all screens | Callout text is Regular (400), not the shared 600. | Requested by Izzy: the "All steps in this workflow…" callout should not be bold. Raise with Emma if the system default should change. |
| Select Files fields — 32px controls | Fields inside the Select Files dialog are 32px tall, the sidebar header is 44px, list items 36px and the footer buttons are 16px apart. | Measured off Figma Dialog Overlay `6245:11269`; RMX controls are 36px elsewhere. |
| `control-height` 24px — prospect.html tile header actions | Text buttons (Add Note, Add Quote, Send Form, Cancel, Unit Picker, Move In, open icons) are 24px. | Matches the mock: Tile header action text buttons are compact, not 36px. |
| `checkbox-checked-colour` — prospect.html Form Details dialogs | Checked response checkboxes are gray (`--text-primary`), not orange. | Matches the mock: the responses are read-only, so the boxes and radios are drawn in the disabled gray. |
| Dropdown menus — all dropdowns | Menu is the Figma Dropdown Menu (node `6165:20109`): as wide as its input, no border, 36px items, soft shadow; hover `--container-tertiary`, selected `--container-secondary` with white text. | Requested by Izzy. The hover fill `#f5f8fa` is the Figma value, matched to the nearest token. |

Copy changes from the mock (typos and placeholders):
- Register totals: mock reads "4 of 4 Transactions" with three rows; built as "3 of 3 Workflow Templates".
- Header properties text: mock reads "***All Properties"; built as "All Properties".
- Details subtitle: the mock text is cut off at "…to see wh"; completed as "…to see what they will see."
- Action dropdown: mock reads "FIle Attachment"; built as "File Attachment".
- Search placeholder kept as in the mock ("Find a templates").

Icons: `view_column`, `play_arrow`, Express `properties` and Express `drag-indicator` are not in the core sheet; their geometry was harvested from the mock's
own icon instances into `assets/icons-local.svg` (and inlined per screen). The mock's row-end "reorder" icon is `drag-indicator` per the component in the file.

## Select Files

`select-files.html` (Figma Dialog Overlay `6245:11269`, 864 wide): a Sidebar List of files on the left (RMX Sidebar List and Sidebar List Item; Add at the top, a trash icon and a drag handle on each file) and the selected file's editor on the right (File Name, Help Text, Map to Rent Manager Field, Allow multiple uploads). It opens empty. Add, Delete (trash) and drag-to-reorder all work; Save keeps the named files, and the File Attachment cell then reads "N Selected" with a pencil that reopens them; nothing is saved, the Rent Manager field list is placeholder data, and the Preview still shows the two fixed upload boxes. Shared code is in `assets/files-mock.js`.

## What the multiselects drive in Portal Preview

Choices are kept in the browser tab and read by `../rmr-onboarding-flow`. A step whose Additional Information has nothing chosen does not appear in the preview (Documents to Sign, Renters Insurance, Setup Payment Method, and the Form step); steps with no choice to make (File Upload, Pay Charges) always appear (File Upload shows its default boxes until files are saved). Hidden steps also leave the progress bar and are skipped by Back / Next / Skip. Every option starts chosen (the Form picker starts on its first form), so the preview opens with the full flow; untick to see steps and options drop out. If everything in a field is unticked, that step is hidden.

- Select Documents to Send Out: which documents are listed on Documents to Sign (the count updates).
- Select Steps to Include (Setup Payment Method): Payment Method = the payment method screen; Autopay = the monthly payment and autopay screens. Only Payment Method finishes on the first screen (Skip / Save); only Autopay skips it and starts at monthly payments.
- Renters Insurance options: which cards show on the Insurance step.
- Select Files (File Upload step): the files saved there become the upload boxes, in order, each with its name as the title, its help text underneath, and several files allowed when "Allow multiple uploads" is ticked. With no files saved, the File Upload step still appears and shows the two default boxes (Profile Photo and Proof of Income).
