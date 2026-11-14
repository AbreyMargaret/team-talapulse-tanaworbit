# Tala Pulse — Team identity and cover artwork

**SI disclosure:** These name suggestions, copy, and the original cover graphic were created with the Figma Make coding assistant. Tala Pulse is the team-selected cover name; availability and trademark clearance have not been checked.

## Team and project

| Field                                  | Recommendation                                        |
| -------------------------------------- | ----------------------------------------------------- |
| Team name                              | **Tala Pulse**                                        |
| Project name                           | **TanawOrbit**                                        |
| Descriptive project title for the form | **TanawOrbit: Astronaut Health & Mission Operations** |
| Team tagline                           | **Human health. Beyond Earth.**                       |

**Why it works:** “Tala” means “star” in Filipino, connecting the team's Philippine identity to space exploration. “Pulse” connects health awareness, human presence, and the rhythm of teamwork. The project name **TanawOrbit** combines “tanaw,” meaning “view” or “sight,” with “orbit,” connecting observation with spaceflight. TanawOrbit is used consistently in the application, logo, cover, and submission documents.

### Copy-ready team introduction

> We are Tala Pulse, a Filipino team bringing the spirit of bayanihan to space-health innovation. Our project, TanawOrbit, explores how thoughtful design and technology can make complex spaceflight-health information easier to understand. It connects simulated measurements, example baseline comparisons, and educational guidance. Our focus is human-centered understanding—not medical diagnosis.

### Alternative team names

- **CrewSignal** — emphasizes clear information and communication.
- **Aster Collective** — a broader space-and-exploration identity.
- **Beyond Baseline** — emphasizes understanding change in context.

**TanawOrbit** is the selected project name. Search visibility, domain availability, and trademark clearance have not been verified; selecting a name does not establish exclusive rights to it.

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
