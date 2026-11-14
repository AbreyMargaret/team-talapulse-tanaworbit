# TanawOrbit — Project documentation

**SI disclosure:** These documents and diagrams were drafted with the Figma Make coding assistant. The team must review the final submission for accuracy, attribution, and event-rule compliance.

TanawOrbit is an educational astronaut-health and mission-health operations prototype. It uses fictional crew members and synthetic measurements. It is not a medical device, diagnostic system, NASA product, or working spacecraft integration.

## Start here

New educational features: [Health Toolkit and Tanaw Guide](toolkit-and-guide.md), plus [measurement walkthroughs and source limitations](measurement-guides.md). These are useful extensions, not a verified list of mandatory challenge requirements. Tanaw Guide is scripted, not live AI.

For the selected Tala Pulse team name and the upload-ready cover image, see [Team identity and cover artwork](branding.md).

For public-PIN demo access, tablet layouts, and Exercise & Recovery, see the [console guide](console-guide.md). The previous display shield is removed; the PIN screen is not authentication.

Data references: [dataset guide](../datasets/README.md), [data architecture and conceptual database model](data-architecture.md), and [application logic](logic.md).

| Document                                        | Purpose                                                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [Submission form answers](submission.md)        | Copy-ready project name, summary, project details, and SI-use disclosure; instructions for the two required public links. |
| [System architecture](architecture.md)          | Mermaid diagrams and an explanation of the system that is actually implemented.                                           |
| [Technology stack](tech-stack.md)               | Languages, libraries, versions, browser APIs, and tools, with a Mermaid stack diagram.                                    |
| [Resources and attribution](resources.md)       | NASA references, photograph sources, fonts, software, licenses, and source-verification notes.                            |
| [Demo preparation](demo.md)                     | A seven-slide presentation draft and an alternative short-video script.                                                   |
| [Submission checklist](submission-checklist.md) | Publishing, SI labeling, branding, permissions, and final submission checks.                                              |
| [Provenance metadata](provenance.json)          | Machine-readable disclosure of SI assistance and synthetic-data provenance.                                               |

## What is ready and what still needs your team

The form text and technical documentation are drafted. **This does not mean the project has been submitted or that award eligibility has been verified.**

Before submitting:

1. Replace `TODO_PUBLIC_DEMO_URL` and `TODO_PUBLIC_PROJECT_URL` in [submission.md](submission.md) with real, publicly accessible HTTPS links. No published URL was provided, and this documentation does not invent one.
2. Review the challenge-specific requirements, official event year, deadline, and local-event time zone. The pasted form does not establish which challenge or event year applies.
3. Review the SI-image watermark requirements and the independent fictional mission name in the [checklist](submission-checklist.md). Documentation alone does not change the current UI or logo files.
4. Verify image provenance, permissions, and all resource links before making the originality declaration.
5. Have the team owner review and confirm the terms and originality statements personally.

## Mermaid diagrams

GitHub and many Markdown editors render the fenced `mermaid` blocks in these documents. The same diagrams are available as editable Mermaid source:

- [System architecture](diagrams/system-architecture.mmd)
- [Check-in data flow](diagrams/check-in-flow.mmd)
- [Technology stack](diagrams/tech-stack.mmd)

Open a source file in a Mermaid-compatible editor to render or export it. Mermaid is a **documentation tool**, not an application dependency. Public editor: https://mermaid.live/

## Honest scope

- The application runs in a browser using React, TypeScript, Vite, and Tailwind CSS.
- Check-ins use a Record → Review → Complete workflow and replace the selected crew member's latest reading in React memory. Per-crew drafts survive navigation, but refreshing the page resets the demo.
- Example baselines are computed separately per crew from the previous 14 synthetic JSON days. They are not medically validated or learned models.
- Earlier chart points come from 120 synthetic JSON health records. Physiological waveform shapes remain illustrative; no sensor history is connected.
- Status rules are simple demonstration rules, not validated medical thresholds.
- Mission-context previews change explanations only. The body overview is a schematic, not a scan.
- Routine reminders work only within the open page; no background delivery is guaranteed.
- Tanaw Guide uses fixed answers and limited keyword matching. It cannot diagnose, prescribe, or provide validated emergency support.
- Public demo profiles and PINs are preloaded. No real authentication, database, device integration, machine-learning model, or runtime SI service is implemented. The optional `tanaworbit-api` Worker only republishes the synthetic JSON and does not store check-ins.

The project is named **TanawOrbit**, by team **Tala Pulse**. The application, exported logo assets, team cover, and submission documents use this identity. Cover assets are documented in [branding.md](branding.md); the rename does not change the prototype's capabilities or resolve outstanding submission checks.
