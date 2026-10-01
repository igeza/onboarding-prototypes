# Onboarding Template Designer

An **RMX (Rent Manager Express)** prototype, built with the `rmx-prototyping` skill 4.2.0.

- **Use the `rmx-prototyping` skill for any work in this folder.** It holds the
  component inventory, the tokens and the rules; nothing here restates them.
- **Do not move or rename files.** This prototype gets published and its links
  live in tickets and Slack. Fix things where they are.
- **One screen per file** in `screens/`, one state per file. A new screen starts
  from an existing one, never from a blank document.
- **Run `node <skill>/scripts/check.mjs . --fix` before sharing a link**, and
  again after any hand-editing session on a canvas.
- **Deviations from the design system belong in `PROTOTYPE.md`** with a reason —
  not in this file, and not quietly in the CSS.
- If `check` reports `stamp-stale`, the skill has moved on since 4.2.0.
  Re-check and fix; do not silence it.
