# Measurement walkthroughs and source limits

**SI-assisted, project-authored educational content. Not medical advice, device instructions, NASA-approved procedures, or clinical training.**

## Purpose

The Health Toolkit provides four-step **recording walkthroughs** for heart rate, blood pressure, sleep, fatigue, mood, and exercise. They help users choose the intended fictional crew, understand the input/unit, add context, and review an entry.

They do not teach sensor placement, select equipment, calibrate instruments, establish medical thresholds, or prescribe an intervention. No particular medical instrument was supplied or connected. The UI therefore directs actual equipment use to its instructions and mission-approved procedures rather than inventing a technique.

## Content and implementation

- Content: `datasets/health-toolkit.json` → `measurements`.
- UI: `p-console/src/HealthToolkit.tsx` → How to measure.
- Types, formatted values, and observation summaries: `p-console/src/toolkitData.ts`.
- Related-field navigation: `p-console/src/App.tsx` → `openRecord` and the pending-field focus effect.
- Source/reference validation: `scripts/verify-toolkit.mjs`, run through `pnpm test:data`.

Each guide includes its input unit/method, an educational explanation, explicit limitations, four steps, and source IDs. The last step opens the corresponding check-in field or exercise log. Fatigue and mood focus the selected self-report control. Guides do not submit or modify values.

## What each source supports

| Source                                                                                          | Supported use                                                                 | Not supported                                                                               |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Project-authored demo workflow                                                                  | Explaining this app's entry controls, units, examples, and confirmation steps | Device operation, clinical technique, medical thresholds, treatment, or readiness clearance |
| [NASA Human Research Program](https://www.nasa.gov/hrp/)                                        | General spaceflight-health research and educational context                   | Validation of the fixture values, comparison rules, subjective demo scales, or app          |
| [NASA — The Human Body in Space](https://www.nasa.gov/humans-in-space/the-human-body-in-space/) | Context about adaptation, sleep, exercise, and spaceflight hazards            | Individualized instructions, diagnosis, or treatment                                        |
| [NASA — 5 Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)                      | The five-hazard educational framework                                         | A sensor stream, personal exposure assessment, or risk score                                |

These public NASA pages were successfully retrieved during the upgrade. That establishes source accessibility at that time, not clinical review or NASA endorsement. The existing OSDR and clinical-validation limitations remain.

## Spaceflight and device limitations

Earth-based measurement positioning must not automatically be transferred to microgravity or a partial-gravity surface. Context previews change explanations, **not** device instructions, measured values, baseline calculations, or comparison thresholds.

The blood-pressure form's systolic-greater-than-diastolic check is data consistency, not clinical interpretation. The 1–5 fatigue and 1–10 effort scales are demo conventions, not validated assessments. Sleep duration and mood alone do not establish fitness for duty or a diagnosis.

The body overview is labeled **SI-GENERATED SCHEMATIC** and groups existing information. It is not a body scan, anatomical finding, disease localization, or image-derived measurement.

## Extending these guides responsibly

Before adding instructions for an actual instrument or a clinical response, obtain the applicable manufacturer instructions, mission-specific protocol, appropriate permissions, and qualified review. Record source/version/applicability separately. Do not turn a general NASA article or a synthetic dataset into a medication, emergency-triage, or exercise prescription.
