# Smart Agents: Onboarding Workflow

The Smart Agents workflow builder, showing the **Prospect Onboarding** agent: a trigger ("When a lease is signed") feeding an Onboarding checklist, conditional branches (pet, vehicle, move-in coordination) with additional Onboarding steps, and a closing trigger and Notify step.

**Owner** Izzy Geza · **Started** 2026-11-13 · **Design system** RMX · **Built with** rmx-prototyping 4.6.1
Source: Figma "RMR New Feature – Onboarding Workflow", node `6941:27114`.

## Screens

| Screen | What it shows |
|---|---|
| [`screens/prospect-onboarding.html`](screens/prospect-onboarding.html) | Agents tab, "Prospect Onboarding" workflow header, Step Palette (left), dotted canvas with dashed connectors (centre), Onboarding inspector (right) |

## What works

- Zoom (25–200%) with −/+, Fit, trackpad pinch, or Ctrl/Cmd + scroll; it zooms about the cursor. Plain scroll pans the canvas.
- Drag a step card to reorder it within its Onboarding node or move it into another one (a blue line shows where it will land). Dropping onto a collapsed node adds it to the bottom.
- The canvas is a flowing layout, and the dashed connectors are redrawn from the real node positions. Collapsing an Onboarding node (its chevron) pulls everything below it up.
- Click an Onboarding node to select it (inspector: Settings and Connections). Click a **step** inside it to select the step (blue border, Figma "Step edit") and the inspector shows that step's settings, the same ones the Onboarding Template designer offers for that step type:
  - every step: Step Name * (also renames the card and the inspector title), Required
  - Renters Insurance: "Allow prospects to self-enroll in master policy" (wording from the Figma Step edit frame; the template says "Self-enroll in master policy")
  - Payment Setup and Make a Payment: the template's info text, as a plain section above Settings
  - Form: Select Form (Pet Addendum, Pet Information, Gym Access, Notice to Vacate, plus the step's own form); the card's second line follows the choice
  - File Upload: **File Request**, one file per File Upload step (File Name *, Help Text, Required, Allow multiple uploads); there is no Add File, so a second file means a second File Upload step
- The palette's Onboarding Steps list only shows while an Onboarding node (or one of its steps) is selected. Selecting a Trigger, Condition or Notify node, or empty canvas, hides it and empties the inspector.
- With an Onboarding node (or one of its steps) selected, clicking a step in the palette, or dragging it onto an Onboarding node, adds it to the bottom of that node (if a step is selected, clicking a palette step inserts the new one right after it); the layout and connectors reflow and the new step is selected.
- Click a Trigger node: the inspector shows a Settings dropdown of onboarding triggers (a lease is signed, onboarding is started / sent / completed, a step is completed, onboarding is overdue, an application is approved, a security deposit is paid, renters insurance is verified, move-in date is reached, a prospect becomes a tenant). Options read without "When" (the canvas adds it back); choosing one renames the trigger on the canvas and in every Connections list. The list of triggers is invented for this prototype (not from the design); confirm it with product.
- Click a Condition node: the inspector shows the condition's tests (field, is / is not, and a value that is a dropdown for yes/no, status and lease-type fields and free text for Unit and Property), "Add condition", "Remove condition", an "Any / All conditions are true" choice once there is more than one, and a plain-language summary. Editing a test rewrites the condition's title in the inspector, on the canvas and in the Connections lists (e.g. "If prospect has no pet"). The field list and value choices are invented for this prototype.
- Click a Notify node: Settings has "Who to notify" (Property manager, Leasing agent, Prospect, Maintenance team, Accounting; ticking people rewrites the node text, e.g. "Notify the PM and the leasing agent that onboarding was completed") a "Specific person" search (type a name, pick to add a removable chip; chosen people are added to the node text) and a Message field with a hamburger menu beside its title that fills in a message template; plus Connections. The recipients, the people list and the templates are invented for this prototype.
- Every inspector header uses the same layout (icon, type label, title, delete) on a white background; the icon and type label take the node type's colour and the bottom rule is the standard grey (Onboarding navy, Trigger green, Condition purple, Notify orange).
- Delete (trash) on a selected step removes it from its Onboarding node.
- Step Library search filters the library. The inspector is resizable (drag the divider; double-click resets).
- Connections list the selected Onboarding node's real connections in the chart (From, If for condition targets, To). The × removes that connection and its line; choosing a node in "Connect to" and pressing Connect draws a new one. Lines are straight where the nodes overlap; otherwise they run down, across and down with two rounded bends (lines merging into one node join just above it). Save shows a "Workflow saved" toast (nothing is stored).

## Not real yet

- Dragging steps from the Step Library, moving or reordering nodes and steps, Undo, Reset and the Health Findings tab.
- Trigger, Condition and Notify nodes have no inspector designed, so selecting one just clears the selection and leaves the inspector empty.
- Nothing saves; step settings reset on reload. The Rent Manager field mapping for file requests is not shown, as in the template.
- The checklist has four steps (as in the Figma "Step edit" frame, which drops the duplicate Renters Insurance that the main frame still shows).

## Deliberate deviations

| Rule | Where | Why we kept it |
|---|---|---|
| Hex colours for step types | `assets/agents.css` (`--ag-*`) | The Figma design hard-codes trigger green, condition purple, notify orange, assign brown, wait teal and the pale node tints. Foundations has no tokens for them, so they are named once in this file. Ask Emma whether they should become tokens. |
| Icons not in RMX Iconography | `assets/icons-local.svg` | `call-split`, `how-to-reg`, `pause-circle`, `undo`, `home-work`, `drag-dots`, `onboarding-mark` were not found in the library; they use the glyph geometry exported from this Figma design. `bolt`, `lightbulb`, `campaign-outline`, `zoom-in`, `zoom-out`, `fit-screen`, `drag-indicator` come from RMX Iconography. |
| Custom canvas, palette, node and inspector layout | `assets/agents.css` | No RMX components exist for a workflow canvas. They are built from tokens and are not tagged as library components. |
| Unchecked checkbox tick | `assets/agents.css` | The foundation `rmx.css` draws the tick on unchecked boxes; hidden here until checked (the form-designer prototype patches this the same way). Worth raising with Emma. |
| Workflow badge weight | Agent head | The design uses Roboto Medium 12/20; Foundations has no such style, so the badge uses Label/S/SemiBold with a 20px line-height. |
| Tag corner radius 3px and 12.6px tracking | Step tags | Taken from the design (Web/Label/S/Medium); there is no 3px radius token. |
