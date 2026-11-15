# Demonstration preparation

**SI-assisted presentation/script draft.** No public presentation upload or video has been created by this document. Choose **one** of the following demo formats and provide its actual public URL in the submission form.

Official site for the project link: https://tanaw-orbit.app

Space Apps team page: https://www.spaceappschallenge.org/2026/find-a-team/tala-pulse/

On the title slide, Tala means “star,” and Pulse represents health and human life. Tanaw represents observation and perspective. Orbit establishes the spaceflight context. The combined line is “a clear view of health in orbit.”

Before capturing the application, resolve the mission-name and generated-image labeling items in [submission-checklist.md](submission-checklist.md). Keep “simulated data” and “not a medical device” visible. Avoid NASA insignia, flags, or generated NASA mission identifiers.

## Option A — Seven-slide presentation

The seven numbered sections below are the **entire slide deck**, including the title/introduction. Preparation notes and Option B are not extra slides. Export only these seven sections.

Use the app's restrained navy, white, blue, and cyan visual language. Add a small, legible `SI-assisted content · Synthetic health data · Educational concept` footer to each slide. Where a generated graphic is used, include the visible `SI-generated graphic` label on or next to that graphic and retain it in exports; confirm the required watermark treatment with the event rules.

### Slide 1 — TanawOrbit

**Astronaut Health & Mission Operations**

Understand measurements in context.

**Monitor → Compare → Notice change → Understand → Review guidance**

Educational prototype. Fictional crew. No NASA-device connection.

**Visual:** One reviewed dashboard screenshot. If using the SI-generated logo, ensure its required watermark is visible.

### Slide 2 — The challenge

**A number alone does not tell the whole story.**

- Long-duration missions make sleep, fatigue, adaptation, and well-being important operational considerations.
- A health interface should connect a measurement to a person's usual pattern and relevant context.
- It must make uncertainty and the need for human review clear.

**Reference:** NASA, The Human Body in Space — https://www.nasa.gov/humans-in-space/the-human-body-in-space/

### Slide 3 — One crew, connected views

**A mission overview that leads to the individual.**

- Select one of five fictional crew members.
- Review heart rate, blood pressure, sleep, fatigue, mood, temperature, and respiration.
- Open a simple daily check-in to record measurements and context.

**Visual:** Mission Overview and Daily Health Check-In screenshots, each readable at presentation size.

### Slide 4 — Compare and understand

**Make the comparison visible.**

- Switch between heart rate, blood pressure, sleep, and fatigue trends.
- Distinguish the latest measurement from dashed example baselines.
- Read a plain-language observation, then review or acknowledge it.

**Limitation:** History consists of synthetic JSON records; example personal baselines are computed from the prior 14 fixture days. No clinical interpretation or persistent record store is implemented.

**Visual:** Sleep trend next to Recent Changes or the observation log.

### Slide 5 — Multiple signals, honest boundaries

**PUMA-inspired physiological visualization**

- Illustrative heart rate, oxygen-related and carbon-dioxide-related values, respiration, airflow, temperature, and pressure.
- Static waveforms demonstrate presentation, not real-time sensing.
- No actual NASA/PUMA connection or validated PUMA sensor simulation.

**Reference:** NASA, PUMA Technology Monitors Pilots and Patients — https://www.nasa.gov/technology/puma-technology-monitors-pilots-and-patients/

**Visual:** Physiological Monitoring screen with its simulation notice visible.

### Slide 6 — How we built it

**A transparent browser-only prototype**

- React + TypeScript + Vite + Tailwind CSS.
- Custom SVG charts; local images/fonts; browser CSV downloads.
- Static synthetic JSON and temporary React state; refresh resets demo changes.
- Public-PIN demo entry and Exercise & Recovery; no real authentication.
- SI-assisted development; no runtime AI, backend, database, or medical hardware.
- A source-linked Health Toolkit, context previews, in-page routine prompts, and scripted Tanaw Guide.

**Visual:** A simplified version of the [architecture diagram](diagrams/system-architecture.mmd), retaining the visible SI-assisted diagram label.

### Slide 7 — Impact, sources, and next steps

**Designed for clearer understanding—not diagnosis.**

- Intended impact: make personal changes easier to discuss and review.
- Next steps: crew-user research, expert review, longitudinal data methods, security, and device validation.
- Current work demonstrates interaction and communication; health outcomes have not been evaluated.

**NASA references:**

- Human Research Program — https://www.nasa.gov/hrp/
- The Human Body in Space — https://www.nasa.gov/humans-in-space/the-human-body-in-space/
- PUMA Technology Monitors Pilots and Patients — https://www.nasa.gov/technology/puma-technology-monitors-pilots-and-patients/

**Credits:** SI-assisted prototype. Stock imagery via Unsplash; fonts via Google Fonts. Include the complete public repository/resource-document link in the exported deck after publishing.

## Option B — Video of 30 seconds or less

Aim for **27 seconds**, leaving room for transitions and ending cleanly before 30 seconds. Record ordinary screen capture; do not assume a script's word count guarantees the final duration.

| Time    | Screen action                                                               |
| ------- | --------------------------------------------------------------------------- |
| 0–4 s   | Open the reviewed dashboard with its educational/simulation labels visible. |
| 4–8 s   | Show Mission Overview and select a fictional crew member.                   |
| 8–13 s  | Show check-in inputs, using only synthetic values.                          |
| 13–18 s | Show the sleep trend and dashed baseline.                                   |
| 18–22 s | Show an observation and the guidance view.                                  |
| 22–27 s | Show the physiological panel and finish with the non-diagnostic disclosure. |

### Suggested narration

> Meet TanawOrbit, an educational mission-health dashboard. Select a fictional crew member, record a check-in, and compare measurements with example baselines. Review changes in sleep and fatigue, explore guidance, and view PUMA-inspired simulated signals. Built with React and SI assistance, it supports understanding—not diagnosis. No real astronaut data or NASA device is connected.

If narration is SI-generated, acknowledge that in the video's description and audio metadata. If the video itself includes SI-generated visuals, preserve the required visible labels/watermarks. The current project has not generated audio or video.

### Public upload checks

- Export and inspect the actual slide file or finished video.
- Confirm that the presentation contains at most seven slides, or measure the video and confirm a maximum of 30 seconds.
- Make the artifact publicly viewable without a login, permission request, password, or registration.
- Copy the **full HTTPS URL**, not an edit-only link, into the Project Demonstration field.
- Keep the public sharing settings intact through judging.
