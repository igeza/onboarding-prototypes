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
Open `flow.html` for the whole flow as one link, starting on Administration: every screen is embedded in a single file, so moving between them never loads a page (browser Back works too). It is generated from `screens/`, so it needs rebuilding after any screen edit. Open `index.html` for the index.

## Connected through the Mega Menu

Two Mega Menu entries are opted in (everything else in the menu still does nothing): **Services > Online Listing > Workflow Templates** opens the Workflow Templates register (`screens/workflow-templates.html`; Add Workflow Template, then the designer, work from there), and **Communication > Forms > Form Templates** opens the Form Templates register in `../rmx-onboarding-form-designer/screens/form-templates.html`. Both prototypes carry the same two links, so you can move between them from any screen's menu. The Administration tab and Rental Info > General > Tenants are linked too. In `flow.html` (the one-file bundle) the Administration, Tenants and Workflow Templates links move between its embedded screens, and Form Templates opens the form designer in the same tab (the bundle has to sit next to the `rmx-onboarding-form-designer` folder).

## Tenants and Prospect (reached from the Mega Menu)

**Rental Info > General > Tenants** opens `screens/tenants.html` (Figma RMX Pages `1979:27399`); the old "Tenant Register" menu entry is removed. Every tenant row opens `screens/tenant-details.html?t=<name>` (Figma RMX Pages `4713:45950`, banners left out; Leases, Contacts, History/Notes, Transactions, Recurring Charges, Forms, Service Issues, UDFs, Pets, General, Addresses, Miscellaneous; all controls not built). **Rental Info > General > Prospects** opens `screens/prospects.html` (built like Tenants, no Status/Guest controls); only Charlie Apegian has a detail page, which is `screens/prospect.html` (Figma Onboarding Workflow `6140:21170`, Prospect Details - Workflow) (Figma Onboarding Workflow `6140:21170`, Prospect Details - Workflow): scoreboard, an Onboarding Overview tile (clicking the step row opens the Onboarding Overview dialog from the same frame), History / Notes, Rent Quotes, Forms, Lead Information, Preferences, Reservation, and the Action Bar rail. Search filters the Tenants register; every other control is marked not built (clicking does nothing): Bulk Actions, Saved Filters, Add Tenant / Add Guest, row kebabs, the other tenants, paging, Jump to Board, the Action Bar buttons, all links inside the tiles.

Forms tile rows open the Form Details dialogs from Figma `6363:18800`: Pet Information (Approved) opens Form Approved, New Pet (Complete) opens Form Completed, Vehicle Information (Pending Approval) opens Form Need Approval (the newer frame `6386:14029`: Submitted Date, numbered responses and Path / Current Value / New Value mapping tiles; Reject is the secondary button). All three show the same mock content (Samantha Carpenter, Pet Information); Approve opens the Add Note dialog, and Add marks that row Approved. Reject and Go to field are not built.

Icons: `units`, `library-add` and `library-add-filled` were harvested from the mock's own instances into `assets/icons-local.svg`. The Stage field's history button uses the core `schedule` clock glyph instead of the mock's Express history icon, because that glyph could not be harvested (the export returns the library placeholder). Swap it for `prospect-stage-history` (library key `e851774b09449cfbfe0e9316ea49c6487bc4111e`) when it is harvested.

Menu links to these screens are also in `../rmx-onboarding-form-designer/assets/megamenu.js`.

## Administration > Onboarding Templates (second option)

Shown **alongside** the Workflow Templates designer above, so both ways of setting up onboarding can be compared; one will be chosen later. Reached from the Mega Menu's **Administration** tab (Figma `6392:18975`, rmResident Portal section).

| Screen | What it shows |
|---|---|
| [`screens/administration.html`](screens/administration.html) | Administration page (3.0.1): category list with rmResident Portal selected, Integrations / Locations / rmResident Portal items, Find an item. **Onboarding Templates** opens the register |
| [`screens/onboarding-templates.html`](screens/onboarding-templates.html) | Register: Name, Description, Properties, Created By, Updated By, Active. Add Workflow Template opens the Add dialog; a name opens the template |
| [`screens/add-onboarding-template.html`](screens/add-onboarding-template.html) | Add Onboarding Template dialog (Template Name, Description, Properties). Save opens the empty template; Cancel / X return to the register |
| [`screens/onboarding-template.html`](screens/onboarding-template.html) | Onboarding Template dialog: General, Onboarding Setup (steps), Onboarding Completion. Add Step / the pencil open Add Step |

- **Add Step** starts empty. Choosing an Action fills Step Name with the Action (until you type your own) and shows that Action's Additional Information: Signable Document and Renters Insurance / Setup Payment Method (multiselects), Form (single select), File Attachment (the Files list with Add File and the file editor, the same editor as Select Files in the Workflow designer; the layout was specified in Figma `6402:17169`), Make a Payment (nothing). Add Step opens over a second dark scrim that also dims the Onboarding Template behind it. Buttons: Save & New (Add only: saves the step and opens a fresh empty Add Step), Save (saves and closes), Cancel; Edit Step has only Save and Cancel; the Add / Edit Step header has no help icon, only Close; the mock's Save & Close was renamed to Save & New on request.
- Steps can be edited and deleted, and reordered by dragging the row or its handle (the row lifts: it grows slightly, gets a shadow, follows the pointer while the other rows slide out of its way, then settles into its slot on release; it can travel any number of places in one drag), or by focusing the handle and pressing Up / Down. The order is not used by the portal preview. Saving the template writes the choices to the same tab storage the Workflow designer uses, so the rmResident Portal preview follows whichever designer was used last. A saved new template is added to the register for this tab only. Flex is offered in Setup Payment Method but the portal prototype ignores it.
- Copy kept from the mock: the register button reads "Add Workflow Template" (Figma) although the dialog is "Add Onboarding Template". Totals read "N of N Onboarding Templates" (the mock's "4 of 4 Transactions" is placeholder).
- Not built: Select Properties, row kebabs, property "+N" lists, Show Inactive, the other Administration categories and items, Help.
- `--icon-rm12` and `--brand-600` (Figma variables Icon/icon-Rm12 and Light/Brand/600) are defined on the Administration page because `tokens.css` does not carry them yet. Worth raising with Emma. The eight illustrations in `assets/admin/` were exported from the Figma file.

## Dropdown menus and scrollbars (all screens)

- **Dropdown menus always show on top.** While open, a menu is lifted into a fixed layer above everything (above dialogs, their footers and the dimming), lined up under its field, or above it when there is no room below. It closes when the page or dialog scrolls. This lives in `assets/app.js` (`portalMenu`), in both prototypes.
- **A scrollbar never moves the fields.** Scrolling dialog bodies (Onboarding Template, Add Step, Form Details, Settings, the Files editor) reserve a 12px scrollbar track up front and take it out of their own right padding, so the bar appears in space that was already empty. Rules are at the end of `assets/proto.css`. Dialogs where the whole overlay scrolls (Select Files, Add Workflow Template, the form designer's Add Fields) are not changed.

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
| Pill text colour — all screens | Pill text is `--text-link`; `rmx.css` still sets `--text-secondary`. | Library Pill anatomy (Figma 886:39) is blue text on a white fill with a `--border-secondary` border. Overridden in `proto.css`; worth raising with Emma so `rmx.css` matches. |
| `bespoke-on-component` — Dialog Overlay (add-onboarding-template, onboarding-template) | The audit sees `is-open` after the page opens the dialog on load. | Same as add-workflow-template: the screen is meant to be shown with the dialog open. |
| `mostly-bespoke` — administration.html | The Administration page is mostly local CSS (header row, category list, item grid). | The system has no Administration page component; built from Figma 3.0.1. Worth raising with Emma. |
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

## Hidden from the index

The workflow flow (Workflow templates, Add workflow template, Workflow template details, Select files) is commented out of `index.html` because onboarding is now set up from Administration. The screens are untouched and their links still work.

- Onboarding Template dialog General section follows Figma `6416:17860` (now named "Template Details"; updated three times): row 1 Template Name and Assign to Property + Select Properties; row 2 Trigger By (Lease Signed), Due Date (7 days) and Description; then Active / Steps must be completed in order. The dialog is 968px wide. The mock shows only the selected values; the option lists (Lease Signed / Application Approved / Move-In Scheduled; 3 / 7 / 14 / 30 days) are carried over from the old workflow designer. They are not saved or used by the portal prototypes.

- Fields above a register (Search, Type, Status) use the Input Field Register style: white fill, blue border, blue label and a blue search icon.


**Onboarding Template Detail (Figma Onboarding Template Designer section `6392:18975`, Template Details v3 `6636:26622`)**: `screens/onboarding-template.html` is now a full page (it was a dialog) reached from a register row or from Save in Add Onboarding Template. Header: Template Name, Trigger By, Active, Steps must be completed in order, the property and its +N pill, and Settings. Below it the step list (Signable Document, File Attachments selected, Renters Insurance, Make a Payment, File Attachment) and the File Upload step: Action, Step Name, Required/Optional Contact Types, Required, an RMR preview, Display Rules (switch and a Pet Type / is equal to / Dog rule) and File Requests. Settings opens the dialog from frame `6613:19288` (Assign to Property, contact types, Expiration/Due Date radios, Due Date, Description). Add Onboarding Template now has Template Name, Assign to Property, Trigger By, Contact Types, Expiration/Due Date, Description and Steps must be completed in order. Working: choosing a step (each shows Action, Step Name, contact types, Required, the RMR preview for its action, and Display Rules; a File Upload step also shows File Requests), Add step, step kebab (Duplicate, Delete), changing the Action, the Required and other checkboxes, the display-rules switch, Add Rule / remove rule, Add File / remove file. File requests feed the preview live. Not built: reordering steps, property selection, date picking, saving the template, the rule field/value lists beyond Pet Type, equal/not equal and Dog/Cat (sample values).


**Step pages (Figma frames Renters Insurance `6646:30277`, Make a Payment `6646:31273`, Form `6646:32802`)**: the step list is now Signable Document, File Attachments, Renters Insurance, Make a Payment, Form. Renters Insurance adds **Select Options to Offer** (multi-select: Master Policy, Purchased Policy, LeaseTrack); Form adds **Select Form** (Pet Addendum, Pet Information, Gym Access, Notice to Vacate); Make a Payment has only the shared fields. Each step shows its RMR page in the preview (insurance options and the chosen form feed the preview). The selected step has a blue bar on its left edge. There is no frame for Signable Document, so it keeps the shared fields only.


**Forms in History / Notes**: the Forms tile is gone from Tenant Details and the Prospect page. A form shows in History / Notes instead: "Form Pet Information sent to <name>" and then "…submitted by <name>" (the prospect also has "…approved by James Brown"). Clicking a submitted or approved row opens the Form Details dialog. Sending and approving forms happens from the Forms register.


**Settings dialog (Figma `6613:19288`)**: Description is now a multi-line box and there is a new **Message that displays after onboarding is completed** box (default "Your property management will be in touch soon for next steps!"). The fields sit in a white bordered card on the grey dialog body. Save keeps the message for the RMR Onboarding Submitted overlay.


**Onboarding Template Designer update (Figma `6392:18975`, Nov 2026)**: the Onboarding Templates register has Name, Description, Properties, Created By, Updated By and Active, the button reads "Add Onboarding Template", and the third template is now Student (was Residential). On the detail page: the step list is Account Information, File Upload, Renters Insurance, Make a Payment, Form, Payment Setup. A top bar shows a read-only **Step Type**, Step Name, Select Form (Form step), Required, and **Self-enroll in master policy** (Renters Insurance). The Action and contact-type dropdowns are gone. **Display Rules** is a card with an "Enable display rules" checkbox. **Payment Setup** has a callout and no preview. A new template opens on the **Empty State** ("Add steps to get started"), and **Add** offers a step-type menu; the last step can now be deleted.
- Copy changes from the mock: Form step name is "Form" (mock reads "Make a Payment"); Payment Setup step name is "Payment Setup" (mock reads "Payments Setup").
- Not in the new frames, so dropped: the Renters Insurance "Select Options to Offer" picker (all options are offered in the preview), the default Profile Photo / Proof of Income file requests (File Upload starts with one blank request), and Signable Document in the default step list (still in the Add menu).
- The flow.html bundle was not rebuilt; rebuild it before sharing.


**Settings dialog, updated (Figma `6613:19288`)**: the contact-type text and the Required / Optional Contact Types dropdowns are gone. Due Date is now a dropdown (3 / 7 / 14 / 30 days, default 7 days) with a calendar button that is not built; the date picker is removed from this screen. The Expiration / Due Date radios still switch the label.


**Step previews**: every step on the Onboarding Template Detail page shows a preview, including Account Information (new portal page `../rmr-onboarding-flow/screens/01a-account-information.html`, Figma RMR Onboarding `6070:39963`) and Payment Setup. In the preview the details inside the step card (titles, labels, field values, links, copy) are drawn as rounded gray blocks that cover the words; the header, Onboarding bar and buttons stay readable. This is done in the portal's `assets/app.js` and `assets/rmr.css` for the iframe named `rmr-thumb` only.


**Row kebabs on Prospects and Tenants (Figma Send Onboarding section `6752:27975`; menu lists from Izzy's Rent Manager screenshots)**: the row kebab on `prospects.html` and `tenants.html` opens the Rent Manager action list (long, so it scrolls inside; opens above the kebab when there is more room there). **Send Onboarding** and **Send Form** sit right after Send Email; the position is our choice, the mocks do not say. Every other item does nothing. The lists end where the screenshots were cut off (prospects after Show All Estimates, tenants after Add Charge); the real menus continue.
- **Send Onboarding** opens the Send Onboarding dialog (Dialog Overlay `6791:27670`, 298px): Onboarding Template (Default Onboarding), a **Due Date** dropdown (3 / 7 / 14 / 30 days, default 7 days) and an **Expire [3] days after due date** row (a checked checkbox; unticking greys the number). Send closes it with an "Onboarding sent" toast; nothing is stored and the template is always Default Onboarding. (This replaced the earlier Expiration Date field and date picker.)
- **Send Form** (Figma Send Form to Tenants `6070:46808`, dialog `6768:37219`, 856px; bulk dialog `6768:37676`, 1038px): Form (Pet & Policy Agreement, Pet Information, Gym Access, Notice to Vacate), a Tenant / Prospect field showing the row's person, Set Expiration (date picker, a week out), the person's contacts as a table (checkbox, Name, Email Address, Web User tick, Contact Type; Primary / Co-Applicant / Guarantor, sample contacts for Charlie Apegian, Arlo Swift and Eli Beer, everyone else just the primary), and Send Message. Send needs at least one contact ticked (otherwise the table outlines red and a failure toast shows) and then closes the dialog with a green toast `"<form>" sent.`. The mock's title reads "Sent Form"; built as "Send Form". Emails are blank, as in the mock.
- **Bulk** is a mode you enter from **Bulk Actions**. The menu is the Rent Manager one (Mass Edit Mode, History / Note, Service Manager, Financial, Reports, Communication, Manage Prospects; from Izzy's screenshot). **Send Form** and **Send Onboarding** sit in Communication after Send Email (our placement). Choosing one turns the first-column checkboxes on (empty until ticked; the header box selects all); ticking rows shows the blue bar ("3 prospects selected") with just that one action, and the x leaves bulk mode. One bulk action at a time. Bulk Send Form uses the 1038px dialog (a Prospect / Tenant column groups each person's contacts); bulk Send Onboarding uses the 298px dialog. Every other Bulk Actions item does nothing. The Tenants menu uses the same groups with Tenant names and no Manage group (no mock; our guess).
- Not built: the Send Onboarding item in the Prospect page Action Bar, and the Prospect Leasing Board.
- Code: `assets/send-onboarding.js` (loaded by both registers).


**Checkboxes**: an unchecked box is empty everywhere (the tick is hidden until checked; rule in `assets/rmx.css`, both RMX prototypes). The checkboxes above a register (Show Inactive, Exclude Subaccounts) turn **blue** when checked (`rmx-check--blue`); the select-all in a gray register header, row checkboxes and form checkboxes are **orange**. The Bulk Actions menu has a maximum height and scrolls inside.


**Properties register and Send Form to Property (Figma Send to Property section `6070:46986`; register `6796:48913`, dialog `6070:47029`)**: `screens/properties.html` (Mega Menu: **Rental Info > General > Properties**). Search, Saved Filters, Show Inactive (blue), Add Property, and the register: color block, Name, Short Name, Email (with envelope), Manager Name, Primary Address, Billing Address, row kebab, "19 of 42 Properties" (sample rows from the mock; long addresses are cut with an ellipsis). Not built: Add Property, Saved Filters, Show Inactive, row links, paging, the other properties.
- The row kebab lists Send Email, **Send Form**, then the Rent Manager items from Izzy's screenshot (Add Management Inspection, Create Service Issue, Write Letters, Report Writer, Add to Phone Broadcasts, Add to Text Broadcasts).
- **Send Form** opens the 440px dialog from the mock: Form (a selector: Pet Info & Policy Agreement, Pet Information, Gym Access, Notice to Vacate), Property (the row's property), Set Expiration (date picker, a week out), Send Message. Send closes it with a toast naming the chosen form, e.g. `"Pet Info & Policy Agreement" sent`. Bulk Send Form shows "3 selected" in the Property field.
- Bulk mode works as on Prospects and Tenants (Bulk Actions > Send Form, then tick rows); the Bulk Actions menu here has only Reports and Communication (no mock; our guess). There is no Send Onboarding on properties.
- Code: `assets/send-onboarding.js` with `data-kind="property"`. The table id is `props-register` because `properties` is the id of the Properties icon symbol.


**Add Onboarding Template and Settings, updated again (Figma `6392:19030`, `6613:19288`)**: both dialogs now have the same shape: Template Name \*, Assign to Property \* with Select Properties, Trigger By (Add only; empty to start), a **Due Date dropdown** (3 / 7 / 14 / 30 days, default 7 days), an **Expire [3] days after due date** row (a checkbox, checked, with a small number box; unticking greys the box out), Description, and in Settings the completion message. The Expiration Date / Due Date radios, the calendar button, the Contact Types dropdown and "Steps must be completed in order" are gone from the dialogs (that checkbox stays on the detail page). The Add dialog's header has only Close. Nothing is saved: the days and the Expire setting are not used by the portal prototype.

**Spacing on the step page**: a section heading (16px semibold) sits 2px above its description (14px), the description 8px above its card, sections 24px apart (Display Rules, File Requests), Add File 12px under its card. Inside the Display Rules card everything is 8px apart with 16px padding, with or without rules (the empty rules container no longer adds a gap).


**All RMX flows are connected**: both prototypes can be entered from `rmx.html` (start on Administration for onboarding, or on Form Templates for forms) and the Mega Menu is wired the same way in both: Workspace (back to `rmx.html`), Administration, Rental Info > General > Tenants / Prospects / Properties, Services > Online Listing > Workflow Templates, Communication > Forms > Form Templates / Forms. So you can start on forms and reach onboarding (Administration > Onboarding Templates > a template) and the other way round. Every other menu item still does nothing.

**Sent forms reach RMR**: a successful Send Form (row menu, bulk bar, or Form Templates) also writes the form name and its expiration date to the browser tab (`rmx-sent-forms`); the RMR Forms page lists them under Required (see `rmr-tenant-portal/PROTOTYPE.md`).

**Payment Setup callout**: the description above Display Rules is a Callout (white, 1px blue border, blue info icon, regular text) instead of plain text.

**Tenant Register and editable emails (Figma Send Form to Tenants)**: the register's title is now **Tenant Register** (as in the Send Form frames); its last visible row from the mock is Olivia Brown (Tri-County Mall, 104D +1). In every Send Form dialog the **Email Address** cell of each contact is a text field you can type in (not saved anywhere; the mock leaves them empty).

**Send Form dialog matched to the mock (Figma `6768:37219`)**: the top row is Form 248px, then Tenant (or Prospect) and Set Expiration sharing the rest (271px each; bulk has Form and Set Expiration only); the Name cell is plain text and the Email Address cell is a bordered 32px field (editable); the dark table header has thin white column dividers; the message placeholder is italic. The mock's title reads "Sent Form"; built as "Send Form".

**Close icon on the send dialogs**: the X in the Send Onboarding and Send Form to Property dialogs is the same plain blue icon as in the Send Form dialog (24px, no border box). Those two dialogs keep only the X; Send Form also has the help icon beside it.

**Prospect page and Leasing Board update (Figma RMX Onboarding Tracking `6140:21170`; Prospect Details - Workflow `6061:35017`, Onboarding Overview `6061:38572`, Prospect Leasing Board `6058:33855`)**: the onboarding steps start with **Account Information**; **Documents to Sign is gone** from the Onboarding Overview tile and dialog (Account Information has no details under it) and from the Add Step menu on the template page. The tile's open icon is replaced by a **Jump to Board** link that opens the new `screens/prospect-board.html`: the Prospect Leasing Board (Leasing Board title, Search, Saved Filters, an "Assigned to = Name" quick filter, Show Quick Filters, View Small / Large, Customize, Add Prospect, Sort, and six columns with the sample cards; Rory Burke's card shows the onboarding stage and step). Charlie Apegian's card opens the Prospect page; the other cards, filters and controls are not built. The mock still shows a Forms tile on the Prospect page; it stays out (forms show in History / Notes). The RMR onboarding flow still has its own Documents to Sign step, not changed here.

**Onboarding template update (Figma `6392:18975`, Nov 2026)**:
- **Step page**: the step list header reads **Step (6/10)** (count of 10). The step bar is Step Type, Step Name, Required, **Display conditionally** with an info icon (hover tooltip "When enabled, this step is displayed conditionally, based on defined rules."), and on Renters Insurance Self-enroll. The Display Rules heading, description and "Enable display rules" checkbox are gone: ticking Display conditionally shows a **Display Rules** card (rules and Add Rule) at the top of the content and a branch icon on the step in the list. **Select Form** moved from the step bar into a card in the content. **File Requests** has the new description, **Add File above the cards**, and each file card has a muted title (the file name), File Name, Help Text, **Required** and Allow multiple uploads; **Map to Rent Manager Field is gone**. The Payment Setup callout reads "Payment Setup step displays Autopay options based on Charges & Payments settings."
- **Settings dialog**: Assign to Property, Due Date, Description and the completion message only (the Expire row is gone); the fields are 16px apart with 16px padding all round, so the spacing is even.
- **Add Onboarding Template**: new **Copy from** dropdown first (Blank, Standard, Commercial, Student; not wired), no Expire row; Due Date stays a dropdown.
- **Register**: the first template is **Standard** (was Default) with a small icon beside the name. Its link and the detail page's template name ("Default Onboarding") are unchanged.

**Display Rules layout (Figma Make a Payment `6646:31273`)**: with Display conditionally ticked, the step page shows the callout, then a **Display Rules** heading *above* a card that holds only the rule rows (field, operator, value); **Add Rule** is a link at the right end of the Display Rules heading. The content column is wider (up to 889px) and the preview is 606px, as in the mock. Make a Payment now also has a callout ("Make a Payment reflects payment options based on Payment Policies set for each property.").

**Property Send Form**: the Include Prospects checkbox is removed; the dialog is Form, Property, Set Expiration and the message.
The Property field's search icon is blue (`--icon-primary`).
Text areas have no resize grip (`textarea { resize: none }` in `proto.css`, also in the form designer).

**Form Details dialog is 1200px wide** (was 968px), per the Figma Form Completed / Form Need Approval / Form Approved dialogs (node `6363:18800`). It still shrinks to the window width on small screens.

**Form Details responses match the Pet Information form (Figma Form Completed)**: 1. Do you have pets? (Yes/No), 2. Type of Pet, 3. Pet Details, 4. Is your pet up to date on vaccinations? (Yes/No). The read-only radios and checkboxes use the design system's disabled colours (`--icon-disabled` ring/dot/fill, `--text-disabled` labels). The Vehicle Information (Pending Approval) dialog is unchanged.

The help text under a question in the Form Details dialogs is regular, not italic.

**Prospect: History / Notes tile is two columns wide** (was one), so the Note text is no longer cut off; Rent Quotes sits beside it in the third column. Below 1280px the tiles stack as before.

**Leasing Board (Figma 6058:33855)**: swim lanes are at least 300px wide (all six fit at 1920px) and the board scrolls horizontally when the window is narrower, instead of squeezing the lanes. The property and unit icons and text on a card are grey (`--text-primary`); the icons were white, so the row looked shifted.

Leasing Board cards: every line of text on a card is grey (`--text-primary`); only the prospect name is blue.

Leasing Board cards have rounded corners (`--radius-sm`, 4px), including the colour bar on the left.

Leasing Board: 8px padding inside each swim lane (was 16px), so the cards sit 8px from the lane edge as in Figma.

Leasing Board cards: the labels (Last Contact:, Next Contact:, Agent:, Onboarding Stage:, Onboarding Step:) are semi-bold; their values stay regular.

Leasing Board: the swim lane titles ("Application Sent (2)") are grey (`--text-primary`) and semi-bold, count included.
