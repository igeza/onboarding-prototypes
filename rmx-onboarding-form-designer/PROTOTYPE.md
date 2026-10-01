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
