# Tala Pulse — Team identity and cover artwork

**SI disclosure:** The cover graphic and earlier naming drafts were created with the Figma Make coding assistant. The team selected the names and the explanation below. Trademark clearance has not been established by choosing a name or a domain.

## Team and project

| Field                                  | Selected                                                |
| -------------------------------------- | ------------------------------------------------------- |
| Team name                              | **Tala Pulse**                                          |
| Project name                           | **TanawOrbit**                                          |
| Descriptive project title for the form | **TanawOrbit: Astronaut Health & Mission Operations**   |
| Team tagline                           | **Human health. Beyond Earth.**                         |
| Official site                          | **https://www.tanaw-orbit.app/**                        |
| Space Apps team page                   | **https://www.spaceappschallenge.org/2026/find-a-team/tala-pulse/** |

**Team: Tala Pulse.** Tala means “star,” while Pulse represents health and human life.

**Project: TanawOrbit.** Tanaw represents observation and perspective, while Orbit establishes the spaceflight context.

TanawOrbit combines a Filipino word with an English spaceflight term.

**Tanaw.** In Filipino, tanaw relates to a view or something visible from a distance, the act of looking toward or observing something, and a wider perspective or outlook. In “tanaw sa hinaharap,” it means looking toward the future. This connects to the system’s purpose: helping astronauts observe, understand, and reflect on their health information.

**Orbit.** Orbit is the path of an object around a celestial body. It connects the name to spaceflight, space stations and spacecraft, mission operations, and repeated cycles, similar to recurring health check-ins and routines.

**Combined meaning.** TanawOrbit can be interpreted as “a clear view of health in orbit.”

### Copy-ready team introduction

> We are Tala Pulse. Tala means “star,” and Pulse represents health and human life. Our project, TanawOrbit, joins tanaw, a Filipino word for looking and perspective, with orbit. It can be read as “a clear view of health in orbit.” The prototype uses simulated measurements, example baseline comparisons, and educational guidance. Our focus is human-centered understanding, not medical diagnosis.

## Cover image

![Tala Pulse Filipino team cover](../public/images/tala-pulse-team-cover.png)

The cover is an **original graphic**, not a photograph of team members or a photorealistic space scene. The artwork pairs large, understated typography with an abstract wireframe planet, an orbital path, and an illustrative pulse line.

| File                                                             | Use                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| [PNG cover](../public/images/tala-pulse-team-cover.png)          | Recommended upload: lossless, **2400 × 1000 pixels**. |
| [JPEG cover](../public/images/tala-pulse-team-cover.jpg)         | Smaller upload alternative with the same dimensions.  |
| [Self-contained SVG](../public/images/tala-pulse-team-cover.svg) | Editable vector master with embedded font data.       |
| [SVG template](branding/team-cover.template.svg)                 | Readable design source for text and layout edits.     |
| [Export script](branding/generate_cover.py)                      | Rebuilds the SVG, PNG, and JPEG with metadata.        |

The SVG has a 12:5 landscape aspect ratio. No platform-specific size requirement was supplied. Check the upload preview and do not crop out the visible **SI-GENERATED ARTWORK** label; request a resized version if your platform requires a different ratio.

### Design choices

- Dark navy ground, white typography, muted blue labeling, and cyan scientific line work.
- DM Sans and IBM Plex Mono, matching the application.
- An abstract planet rather than borrowed NASA photography or an agency emblem.
- No NASA logos, flags, patches, or mission identifiers in the artwork.
- A visibly labeled illustrative signal, not a medical tracing or actual telemetry.
- A visible SI-generated watermark plus provenance metadata in all three exported formats.

The cover uses the selected team name and a “FILIPINO TEAM” heading, with TanawOrbit as the project. The project rename does not change the mission label or resolve the unwatermarked-logo items in the submission checklist.

## Exporting after an edit

Edit `docs/branding/team-cover.template.svg`, then run:

```sh
python3 docs/branding/generate_cover.py
```

The asset-export environment needs Python 3, Pillow, and librsvg's `rsvg-convert`. These are **artwork-export tools only**, not new application dependencies. The font files and their SIL Open Font License notices are retained in `public/fonts/`.

Keep the watermark and metadata on submitted copies. The watermark is included to support the supplied SI-disclosure requirements; your team must still review the official current event rules and final artifact.
