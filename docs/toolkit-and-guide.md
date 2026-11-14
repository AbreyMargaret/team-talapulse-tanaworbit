# Health Toolkit, routines, contexts, and Tanaw Guide

**SI-assisted documentation.** These features are educational extensions, not a claim that every item is mandatory for the challenge or that the app is clinically accurate.

## Entry points

- **Dashboard next-step cards:** connect an example observation with a recording walkthrough, the current run's routine, or provenance.
- **Alerts → Understand this observation:** opens relevant measurement context; a scripted crew review note opens evidence instead.
- **Health Toolkit:** ninth state-selected screen, available from the sidebar or touch dock's More menu.
- **Mission context preview:** available above the profile on console screens.
- **Tanaw Guide:** floating button, bottom-right on desktop and above the touch dock on touch layouts. The opened guide is a focus-contained dialog; on phones it becomes a full-screen sheet.

## Toolkit sections

### How to measure

Six four-step project-authored recording walkthroughs, with current demo values, explanations, limitations, and source references. The last step opens the relevant form field or exercise log. These are not instrument-placement or clinical protocols. See [measurement-guides.md](measurement-guides.md).

### Your routine

Three actions are tracked **per crew member in this mounted demo run**, not from the preloaded history:

1. Health check-in completes after the existing review/confirm flow.
2. Exercise completes after confirming a new `manual_demo` session for the current mission day.
3. Guidance review is a manual, explicitly self-reported acknowledgement.

Completion is an interface-learning checklist, not medical clearance, adherence certification, or an audit record.

### Body overview

Five selectable topics group existing values: well-being, cardiovascular context, respiratory context, sleep/recovery, and activity. The schematic does not scan, localize disease, evaluate an organ, or generate additional findings.

Respiration is a display-only synthetic fixture and links to the physiological demo, not to an unsupported respiratory-input field. Other actions open supported check-in fields or the exercise log.

### Mission context

Orbital station, deep-space transit, lunar surface, and Mars surface are educational scenario previews. Selecting one changes descriptive notes, communication/gravity context, and highlighted hazards.

**It does not change the source mission, any reading, synthetic baseline, comparison rule, or physiological value.** Existing source data remains from the fictional orbital mission. No environment-specific medical ranges or clinically calibrated gravity transformations are implemented.

The five-hazard framework explains the app's limits as well as relevant context. For example, ordinary vitals cannot measure radiation dose, and crew measurements do not establish habitat air safety.

### Evidence & sources

The panel distinguishes:

- Synthetic health JSON fixtures
- Current-run manual demo overrides
- Display-only temperature/respiration fixtures
- Computed prior-day example baselines
- General NASA educational references
- Project-authored entry instructions and unvalidated comparison rules

Source links provide context, not medical validation. OSDR, live sensors, approved device instructions, and actual astronaut clinical records are not integrated.

## In-page routine reminders

`p-console/src/useRoutineReminders.ts` manages a demonstration timer without a server or persistent scheduler.

- Default: five minutes. Options: Off, one, five, or fifteen minutes.
- Timing begins after demo entry and restarts when the crew or selected interval changes.
- The timer is stopped on sign-out or when all three current-run tasks are complete.
- A non-blocking banner shows remaining actions, opens the checklist, supports a five-minute snooze, and can be dismissed.
- Snooze schedules a new prompt five minutes from that action. Dismiss schedules the next prompt using the selected interval.
- Completing only part of the routine does not restart the current timer.
- Changing tabs/screens inside the app does not create a background reminder service.

These are **demo intervals, not a NASA or mission medical schedule**. Browser suspension/throttling, page closure, refresh, and device conditions can delay or stop a prompt. There are no push notifications or guarantees of delivery.

## Tanaw Guide — scripted educational help

`datasets/assistant-faq.json` contains seven fixed answer topics. The interface always identifies the guide as **SCRIPTED DEMO / NOT LIVE AI**.

- Topic buttons select a fixed answer.
- Free text is matched to topic keywords, not sent to a language model.
- A small set of templates inserts the selected crew's current demo sleep, example baseline, baseline window, and selected context.
- Known urgent-symptom/medication/diagnosis wording returns a scope-limitation response and points users away from relying on the prototype.
- Unrecognized wording returns a fixed fallback, not a generated answer.
- Answers link to their applicable references and to related app sections.
- Reset clears the conversation. Closing the guide unmounts it and clears its messages.
- No conversation is persisted or sent to an AI service.

The keyword safeguard is **not triage, emergency detection, a comprehensive symptom classifier, or a clinical safety system**. The app cannot diagnose, prescribe medication/doses, or clear exercise as safe. The directly visible toolkit scope notice does not depend on the guide answering a question.

## Loading and accessibility

The Toolkit and guide are loaded as separate frontend chunks. A loading view is provided; an error boundary offers a way back without deliberately discarding current demo state. This is not a verified offline medical library or an offline-first deployment.

The guide contains focus, closes with Escape, makes the console behind it inert during the dialog, and returns focus to its launcher. This is ordinary modal accessibility—not the removed privacy shield or real access control.

## Storage and security scope

All context selections, task acknowledgements, timers, chat messages, and current-run entries are temporary React memory. JSON files remain unchanged. Public demo PINs still do not authenticate or protect records. No backend, paid registry, API key, AI provider, database, localStorage, or sessionStorage was added.
