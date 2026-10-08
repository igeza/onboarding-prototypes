# Onboarding Form Designer

Where a property manager builds the form used by a "Form" step in an onboarding workflow (see `rmx-onboarding-template-designer`).
The Portal Preview shows the result as a prospect sees it, using a new form-step screen in `rmr-onboarding-flow`.

**Owner** Izzy Geza · **Started** 2026-09-29 · **Design system** RMX · **Built with** rmx-prototyping 4.2.0
Source: Figma "RMR New Feature – Onboarding Workflow", node `6152:19294` (Forms).

## Screens

| Screen | What it shows |
|---|---|
| `screens/form-designer.html` | Empty form ("Add fields to get started"). Settings menu (Automated Notifications) and Add Field menu work; choosing a question type goes to the next screen |
| `screens/form-designer-questions.html` | Question 1 added, plus an untitled question 2 (pencil opens the editor) |
| `screens/form-designer-edit-question.html` | Question editor. Response Type switches the options panel (Multiple Choice, Checkboxes, Dropdown, Short Answer, Paragraph); Dependencies shows the "Show" pickers |
| `screens/field-selector.html` | Question settings with the Map to Rent Manager Field selector open: a panel that drops below (or above, if there is no room) the Map field, no backdrop; the chosen field shows highlighted in the tree and as a chip under "Selected:" |
| `screens/portal-preview.html` | Portal Preview over the designer; embeds `rmr-onboarding-flow/screens/12-form-preview.html` |

The four editor frames in Figma (Edit Yes/No, Short Answer/Paragraph, Dropdown, Checkboxes) and the two menu frames are states of the editor and
of the designer; they are built as live states of those screens rather than separate files.

## Form Templates register

`screens/form-templates.html` (Figma Register `6070:46767`): Search, Status, Add Form, and the register (Name, Create Date, Created By, Updated By). It is reached from the Mega Menu (**Communication > Forms > Form Templates**); **Pet Information** opens the form designer (`form-designer.html`). Not built (clicking does nothing): Add Form, the Status filter's options (the dropdown opens but filters nothing), row kebabs, the other two forms (Notice to Vacate, Gym Access). Search filters the rows. Mega Menu: Services > Online Listing > Workflow Templates opens the Workflow Templates register in `../rmx-onboarding-template-designer`; both opt-in links are noted in `assets/megamenu.js`.

## Not real yet

- Nothing saves (a reload starts over). Add Page, page kebab/reorder, Add Field's Text and File sections, Automated Notifications items, and the rail kebab do nothing.
- Questions are live: the rail (+) opens Add Fields (tick several, Add), the pencil on a question opens its settings, the trash deletes it. Settings depend on Response Type (options for Multiple Choice / Checkboxes / Dropdown, none for Short Answer / Paragraph) and change when the type changes; title, help text, options and the mapped field update the question. Up to 6 options for Multiple Choice / Checkboxes (option 3 onward has a trash icon to remove it); Dependencies pickers only offer two fixed choices.
- Add Field (empty state) and the rail (+) both open the two-pane Add Fields dialog (Figma 6332:12971): Available groups Response Types and General Fields (Text Box, Attachment) with add (+) icons and Select All, and a Selected list with remove and Clear All. Add puts one question per selected row on the form. Text Box has its own settings panel (Text, Width Full/Half, Delete); Attachment adds an attachment field (title, help text, map, required). Attachment UI is a first pass. There is no Add Section button. Add Fields lists the response types (same list as Add Field): tick several, Add puts one untitled question of each type on the form. The Rent Manager field tree is placeholder data.
- Property lookup, Form Name and Display Name are plain text.
- The Portal Preview needs the folder served from its parent (`/Users/izage/onboarding`), since it loads the RMR prototype by relative path. It will not work from a bundled single page.

Selection: hovering a question shows its dashed outline and pencil / trash; clicking keeps them until another question is clicked or the question is double-clicked.
The settings panel closes when you click outside it or press Escape. With more than one question it shows a counter (‹ 1/4 ›) that steps through the questions; the question being edited is highlighted and the panel follows its pencil. The settings panel overlaps the question: its top sits just under the pencil / trash and its right edge lines up with the pencil.

## Matches the Figma Designer frame (6070:63424)

Sidebar List (224px, Add Page + selected page), Form Header, canvas on `--background-ui-primary` with a Field Group (721px dashed) holding Question boxes,
the single add (+) tile-settings tab (`#E5E5E5`, no token) attached to the group, an "Add Section" primary button under it, and the Edit Yes/No popover
(540 wide, 10px padding, offset under the question). "Add Section" does nothing yet.

## Deliberate deviations

| Rule / where | What | Why we kept it |
|---|---|---|
| `bespoke-on-component` — Dialog Overlay (portal-preview) | Audit sees `is-open` after the page opens the dialog on load. | These screens are meant to be shown with the dialog open. |
| `local-css-heavy` | ~170 lines of screen-local CSS per screen. | Toggle Slider, Tooltip Text and the designer layout have no shared CSS yet. Toggle Slider uses the measured spec from the inventory (36x20 track, radius 12, 16px handle with check / remove glyph). Worth raising with Emma. |
| `control-height` 80px | Help Text box | It is a Text Box, not a single-line field. |
| `responsive-overflow` at 375px | Warnings only | The designer is a desktop authoring tool; below 1100px the tool rail and editor reflow, below that it is not designed. |

Icons: `properties`, `drag-indicator`, `play-arrow` and `view-column` come from the harvested local sheet (`assets/icons-local.svg`).
Copy from the mock, unchanged: "Form Published to RMR", "Form Aging". The mock's editor title says "Do you have pets?" while the question line above it says "Untitled Yes/No Question"; both kept.

- The kebab on a page in the page list (all form-designer screens) opens a menu with **Duplicate** and **Delete** (`assets/pages.js`). Duplicate adds a copy under the page named "<name> Copy"; Delete removes the page. There is no mock for this menu; it uses the RMX Dropdown Menu style. 

- **Form Setup footer** (Figma Designer `6070:63364`, Overlay Footer `6473:24953`): Save and Cancel sit fixed at the bottom of the page and stay hidden until something on the form changes (typing, picking a value, ticking a box, adding or deleting a question, duplicating or deleting a page; `assets/dirty-footer.js`). Save hides the footer and confirms with a toast; Cancel reloads the screen and puts back the form it opened with. The mock shows only the footer, not what Save or Cancel do.

- The Form Setup page itself no longer scrolls: the designer fills the screen under the context bar (less the footer when it shows) and the page list and canvas scroll on their own.

- **Date response type** (Figma Forms section `6152:19294`, frame "Date" `6479:26529`): Date is in the Response Type menu and in Add Fields > Response Types. Its settings are the same as Short Answer (title, help text, Map to Rent Manager Field, Required; no options). The mock does not show how a Date question looks on the canvas, so it shows a MM/DD/YYYY box with a calendar icon at the right; the Portal Preview shows it as the RMR date field (text box with the calendar icon).

- **Add Fields overlay updated** (Figma Add Fields `6070:63293`, Dialog `6341:15945`): Response Types are now Date, Yes/No, Checkboxes, Dropdown, File Upload, Short Answer, Paragraph; General Fields are Text Box and Single-Line. Multiple Choice is renamed **Yes/No** and Attachment is renamed **File Upload** (now a response type), and the Response Type menu in the editor uses the same names and order. The Yes/No editor frame (`6070:64331`) in Figma still reads "Multiple Choice", so it may not have been updated yet. The second General Field is **Attachment** (the overlay frame says Single-Line, which was a mistake): a file the form's author attaches for the person filling out the form to open, not a place for them to upload (that is **File Upload**). Its settings are an Attachment Name and a File picker (no help text, mapping or required); the canvas shows the file name with a paperclip, and the Portal Preview shows it as a download link. The prototype only remembers the file's name. The mock's sample selection ("Custom Field", "First Name") is not pre-filled.

- **Add Page** adds an empty page ("Page 2", "Page 3"...) under the others and selects it: empty canvas, blank help text, and the Page Name field renames it in the list. Clicking a page brings back its own name, help text and questions (`assets/pages.js`). Duplicate copies a page with its questions (independent copies); Delete removes it, and deleting the last page leaves a fresh empty "Page 1". The Portal Preview shows every page's questions together, in page order, as one list (there is no page-by-page preview). After a reload everything is on the first page again. Page reordering is still not built.

- An **Attachment** is not shown as a question: no number, no asterisk and no "Untitled" placeholder, in the designer and in the Portal Preview. The questions around it keep counting 1, 2, 3 without it. Its name, if given, shows as plain text above the file.

- **Form Templates row menu** (Figma Row Actions `6070:47164`): the kebab on each register row opens Send to Tenant, Publish to rmResident Portal, Copy Link, Make Inactive and Preview (`assets/row-actions.js`). Only **Preview** (opens the Portal Preview) and **Copy Link** (copies the preview's address and confirms with a toast) do anything; the other three are not built.

- **Form Templates register** (Figma `6070:46767`): a **Type** column (Prospect / Tenant) after Name, and the Status selector is now a **Type** selector (All selected / Prospect / Tenant) that filters with the search box. The register now shows the mock's two forms, Pet Information (Prospect) and Gym Access (Tenant); "Notice to Vacate" is gone because the mock does not have it.
- **Send to Tenant / Send to Prospect** (Figma section `6070:46808`; `assets/send-form.js`): the row menu item reads "Send to Prospect" for a Prospect form and "Send to Tenant" for a Tenant form, and everything in the dialogs follows (title, Tenants/Prospects field, Select dialog, message placeholder, the toast). Send dialog: Form, Tenants (opens the list), Set Expiration (typed date, mm/dd/yyyy), message, Save / Cancel. The Tenants (or Prospects) field drops a list open under it: search, Select All and a checkbox per person; the field then reads "N selected". There is no separate Select Tenants dialog (it was in the mock and was removed on request), so the "Selected Tenants (n)" chips are gone too. Save with nobody chosen outlines the Tenants field in red and does not send; otherwise it closes and a green toast reads `"Pet Information" sent to 2 prospects.` The mock's titles read "Sent to Tenant"; I used "Send to ..." to match the menu item. The people lists are made-up names (the mock's tenant names for tenants; invented prospects), and nothing is actually sent or saved.
- Toasts (Form saved, Link copied, "... sent to 2 prospects.") appear centred at the top of the screen, below the app bar and context bar, above any open dialog.

- In the question settings counter (‹ 3/3 ›), the next arrow on the last question goes back to question 1. The previous arrow stays disabled on question 1.

- **Dropdown settings** (Figma Dropdown editor `6070:64391`, updated twice): Response Options are one full-width text box per option with a blue drag handle at the right, and an Add Option link under them (up to six). Dragging the handle reorders the options; the question on the canvas shows the first one. The mock has no remove control, so options can be edited and reordered but not deleted.

- **Form Setup header** (Figma Designer `6070:63251`): Form Type is now read-only text ("Prospect", bold) instead of a selector; **Form Name** is gone and Display Name is renamed **Template Name \***; Property is **Assign to Property** with a **Select Properties** button (not built); and next to Require Approval there is a new **Publish to rmResident Portal** checkbox (unchecked). Preview and Settings are unchanged.

- **Pet Information matches the onboarding**: `form-designer.html` (opened from the Pet Information row in Form Templates) now starts with the eight questions residents answer in `rmr-onboarding-flow/10-pet-information` (Pet Owner Name, unit and address, Type of Pet, Pet Details, vaccinations Yes/No/I'm not sure, behaviours, Emergency Contact, Vaccination Records) with the same help text, answer options and required marks, and the page's help text reads "Please fill in the below information". The Portal Preview shows these questions too. The other designer screens keep their own sample states. The template is still named "Pet Information"; the onboarding screen's title is "Pet Information & Policy Agreement".

- The **Settings** button follows the Figma Button padding: 16px before the label and 8px after the arrow (it was 16px both sides), about 105px wide against the mock's 104px. Preview and Settings sit at the right of the Form Setup header; when the window is too narrow for one row they wrap onto their own row, still at the right.
