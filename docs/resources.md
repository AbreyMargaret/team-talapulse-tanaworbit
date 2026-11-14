# Resources, data provenance, and attribution

**SI-assisted inventory.** This is a source list, not a legal opinion or an eligibility certification. The team must confirm permissions and the current event's rules before submitting.

## NASA resources — form link entries

| Link Text                                           | Full Link URL                                                                 | Actual use                                                                                                                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NASA Human Research Program                         | https://www.nasa.gov/hrp/                                                     | Linked in the application's guidance topics as general spaceflight-health research context. It does not supply example readings or thresholds.                                   |
| NASA — The Human Body in Space                      | https://www.nasa.gov/humans-in-space/the-human-body-in-space/                 | Linked in the cardiovascular-adaptation guidance; educational context for bodily adaptation, sleep, isolation, and other spaceflight considerations.                             |
| NASA — PUMA Technology Monitors Pilots and Patients | https://www.nasa.gov/technology/puma-technology-monitors-pilots-and-patients/ | Reviewed for this documentation to explain the inspiration behind multi-signal physiological monitoring. It is not a device integration or data source for the displayed values. |

All three pages returned successful responses and their content was inspected while preparing these docs. Availability can change; recheck them before submission. The descriptions in the application are educational summaries, not NASA-approved medical recommendations.

### What PUMA means here

NASA's article describes the **Portable Unit for Metabolic Analysis (PUMA)** and measurements of oxygen and carbon dioxide partial pressure, volume flow rate, heart rate, gas pressure, and gas temperature.

The prototype borrows only the idea of presenting several physiological signals together. Its SpO₂ percentage, end-tidal CO₂ example, body-temperature tile, ambient-pressure tile, respiration figure, and drawn waveforms should **not** be described as an exact PUMA sensor model or engineering simulation. It does not compute validated oxygen uptake, carbon dioxide production, or metabolic function.

### What is not NASA data

- Crew identities, crew IDs, roles, mission details, check-in times, and orbital labels are fictional.
- Initial measurements, baseline values, earlier chart samples, status rules, and physiological traces are synthetic examples created with SI assistance.
- No astronaut clinical record, NASA numerical health dataset, PUMA telemetry, NASA API feed, or clinical reference range was imported.
- A citation provides context; it does not validate the prototype's numbers, status rules, or benefits.

Do not say “trained on NASA medical data,” “NASA-validated,” “connected to NASA PUMA,” or “predicts astronaut health risk.”

## Other resources — form link entries

These entries cover the direct tools and external assets used in this prototype and its documentation. The lockfile is the authoritative inventory of transitive software packages.

| Link Text                                              | Full Link URL                                                | Contribution or material used                                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Figma Make — SI-assisted development                   | https://www.figma.com/make/                                  | Interface and code generation/refinement; synthetic examples; vector graphics; submission and technical documentation.     |
| React                                                  | https://react.dev/                                           | UI framework; React and React DOM packages.                                                                                |
| TypeScript                                             | https://www.typescriptlang.org/                              | Typed application source and compiler.                                                                                     |
| Vite                                                   | https://vite.dev/                                            | Frontend development and production-build tooling.                                                                         |
| Vite React plugin                                      | https://github.com/vitejs/vite-plugin-react                  | React build integration.                                                                                                   |
| Tailwind CSS                                           | https://tailwindcss.com/                                     | CSS framework and Vite integration.                                                                                        |
| Node.js                                                | https://nodejs.org/                                          | Development/build runtime.                                                                                                 |
| pnpm                                                   | https://pnpm.io/                                             | Package management and script execution.                                                                                   |
| oxfmt                                                  | https://oxc.rs/docs/guide/usage/formatter                    | Code and documentation formatting.                                                                                         |
| DM Sans — Google Fonts                                 | https://fonts.google.com/specimen/DM+Sans                    | Locally hosted interface font.                                                                                             |
| IBM Plex Mono — Google Fonts                           | https://fonts.google.com/specimen/IBM+Plex+Mono              | Locally hosted numeric and operational-label font.                                                                         |
| Rachel McDermott — Unsplash photographer               | https://unsplash.com/@mrsrachelmcdermott                     | Source credit for the stock portrait used to illustrate a fictional crew member.                                           |
| Rachel McDermott portrait — source image               | https://images.unsplash.com/photo-1506863530036-1efeddceb993 | Source of `public/images/crew-alex.jpg`.                                                                                   |
| NASA — Unsplash contributor profile                    | https://unsplash.com/@nasa                                   | Contributor credit returned when selecting both Earth photographs; original NASA provenance still needs team verification. |
| Earth photograph — NASA attribution via Unsplash       | https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4 | Source of `public/images/earth.jpg`.                                                                                       |
| Earth-orbit photograph — NASA attribution via Unsplash | https://images.unsplash.com/photo-1451187580459-43490279c0fa | Source of `public/images/earth-orbit.jpg`.                                                                                 |
| Unsplash License                                       | https://unsplash.com/license                                 | Review the applicable photograph-use terms and any additional rights or endorsement considerations.                        |
| Mermaid                                                | https://mermaid.js.org/                                      | Syntax/tooling for the documentation's architecture, stack, and sequence diagrams.                                         |
| Mermaid Live Editor                                    | https://mermaid.live/                                        | Optional tool for rendering/editing the supplied `.mmd` files; not an app dependency.                                      |

### Asset-level inventory

| Repository artifact                                                  | Origin                                                                                        | Notes for submission                                                                                                                                                                          |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/images/crew-alex.jpg`                                        | Stock portrait by Rachel McDermott, selected through Unsplash.                                | Not SI-generated; the real pictured person is not claimed to be an astronaut, named crew member, patient, or endorser. Review likeness and context-of-use rights.                             |
| `public/images/earth.jpg`                                            | Unsplash image attributed to NASA at selection.                                               | Used decoratively in the personal profile banner. Do not assume that a contributor attribution alone establishes the original NASA asset's license or full credit.                            |
| `public/images/earth-orbit.jpg`                                      | Unsplash image attributed to NASA at selection.                                               | Used in the mission overview. Verify original provenance and check that the submitted crop contains no prohibited or misleading branding.                                                     |
| `public/images/tanaworbit-mark.svg` and `.png`                       | Original vector composition and raster export authored with SI assistance.                    | Generic orbital ellipses, a pulse line, and a dot; not a NASA insignia. Current files do not carry a visible SI watermark. Resolve the requirement before using them in the final submission. |
| `public/images/tanaworbit-logo.svg` and `.png`                       | Same original mark plus the TanawOrbit wordmark.                                              | SI-assisted graphic; same visible-watermark action applies. Do not describe the logo as NASA-created or NASA-endorsed.                                                                        |
| `public/fonts/dm-sans-400-700.woff2`                                 | Google Fonts / DM Sans.                                                                       | SIL Open Font License notice is retained in `public/fonts/OFL-DM-Sans.txt`.                                                                                                                   |
| `public/fonts/ibm-plex-mono-400.woff2` and `ibm-plex-mono-500.woff2` | Google Fonts / IBM Plex Mono.                                                                 | SIL Open Font License notice is retained in `public/fonts/OFL-IBM-Plex-Mono.txt`.                                                                                                             |
| `public/favicon.png`                                                 | Inherited project scaffold asset; provenance not established in this task.                    | Verify its origin and permitted use, or replace it with an appropriately labeled team asset before asserting that every image has been accounted for.                                         |
| `p-console/src/App.tsx`, `p-console/src/index.css`, `p-console/index.html`                         | Project-specific source created/refined with SI assistance on top of the Figma Make scaffold. | Disclose SI assistance and retain upstream software notices. No runtime SI model is implemented.                                                                                              |
| `docs/` documents and diagrams                                       | SI-assisted project documentation based on the source.                                        | Review factual statements; visible SI-assisted labels are included in the diagrams. Keep labels in exported diagram images.                                                                   |

### Tala Pulse team-cover artwork

The later branding addition is documented in [branding.md](branding.md):

- `public/images/tala-pulse-team-cover.svg`
- `public/images/tala-pulse-team-cover.png`
- `public/images/tala-pulse-team-cover.jpg`

These files are original SI-generated vector artwork and raster exports, not externally sourced photographs. Each exported format includes the visible **SI-GENERATED ARTWORK** label and provenance metadata. The cover reuses the project's DM Sans and IBM Plex Mono fonts under the retained SIL Open Font License notices. The selected team name is **Tala Pulse**; name availability has not been checked.

Reproducible design/export sources are in `docs/branding/`. The export script uses:

| Link Text | Full Link URL                                 | Contribution                                      |
| --------- | --------------------------------------------- | ------------------------------------------------- |
| librsvg   | https://gnome.pages.gitlab.gnome.org/librsvg/ | SVG rasterization through `rsvg-convert`.         |
| Pillow    | https://pillow.readthedocs.io/                | PNG/JPEG export and embedded provenance metadata. |

These are artwork-export utilities, not browser application dependencies. The new cover's labeling does not add watermarks to the older TanawOrbit logo files or clear other outstanding submission checks.

### Image URL verification

The image identifiers and photographer/contributor credits above come from the earlier asset-selection records. The app serves downloaded image copies from `public/images/`.

During this documentation task, requests to the Unsplash photographer/profile and license pages were blocked with HTTP 401 in the execution environment. This does not prove the URLs are inaccessible to a signed-out human browser, but their public accessibility and current terms **were not independently verified here**. Check those pages yourself, retain source records, and provide canonical photo-page URLs if available. Do not remove a necessary credit just because an automated request was blocked.

### Third-party software and license checks

`package.json` lists direct dependencies and `pnpm-lock.yaml` records exact resolved packages. Use their upstream repositories and packaged license notices when redistributing source or build artifacts. Do not apply a blanket “all work is original” or “all assets are public domain” claim to external dependencies or images.

This document does not introduce third-party health data, copyrighted music, narration, or video footage. If your team adds any, add the source and permission information before submitting.

## Policy links for the team's review

These are reference/checklist links, not numerical data sources:

- NASA Space Apps: https://www.spaceappschallenge.org/
- NASA brand guidelines: https://www.nasa.gov/nasa-brand-center/brand-guidelines/
- NASA images and media-use guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/

The current event's official rules and organizer guidance govern the final submission. A disclaimer or this attribution list does not by itself establish compliance.

## Synthetic JSON and demo entry

`datasets/` contains four fictional crew profiles with public sample PINs, one independent fictional mission, 120 example health records, comparison configuration, an exercise catalog, and 20 exercise records. These were SI-generated for this prototype, not supplied by NASA or a clinical study. `p-console/src/data.ts` computes example baselines and chart series from those files. The app does not write to JSON or a database. See [dataset provenance](../datasets/README.md) and [logic](logic.md).

New source files `p-console/src/DemoSignIn.tsx`, `p-console/src/ExercisePanel.tsx`, `p-console/src/data.ts`, and `p-console/src/demo.css` were created with SI assistance. The entry screen reuses the already credited Earth and portrait photographs; it does not introduce new photographs. NASA's existing Human Body in Space and HRP links support general exercise context, not the example durations, effort scales, or comparison thresholds.

## Health Toolkit educational references and original content

Add this NASA resource entry to the submission alongside the existing HRP/body/PUMA references:

| Link Text                             | Full Link URL                     | Use                                                                                                          |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| NASA — 5 Hazards of Human Spaceflight | https://www.nasa.gov/hrp/hazards/ | General educational hazard framework for context previews; not a clinical data feed or validated risk score. |

The HRP, Human Body in Space, and five-hazards pages were publicly retrieved during this upgrade. They support general explanations, not the project-authored recording steps, reminder intervals, subjective scales, comparison thresholds, or individual care. No instrument-specific instructions or medication protocols were sourced or implemented.

`datasets/health-toolkit.json`, `datasets/assistant-faq.json`, the Health Toolkit UI, original body schematic, and scripted Tanaw Guide were created with SI assistance. The body illustration is visibly labeled **SI-GENERATED SCHEMATIC** and not a scan. The guide's answers are fixed text, not a live model or clinical service. No new photographs, vendor components, or paid registry assets were added.

See [measurement source limits](measurement-guides.md) and [toolkit/guide behavior](toolkit-and-guide.md).
