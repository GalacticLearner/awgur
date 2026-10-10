---
name: awgur
description: Plain civic permit records in a street atlas.
colors:
  ink: "#193b36"
  muted: "#49645f"
  paper: "#f6f4eb"
  surface: "#fffef8"
  green: "#17594e"
  line: "#ccd5cb"
  amber: "#825012"
  red: "#9d332c"
  green-hover: "#10463d"
  secondary-border: "#a1b7ac"
  secondary-hover: "#e4ece1"
  warning-surface: "#f3d29b"
  warning-ink: "#593509"
  warning-border: "#c8974a"
  warning-hover: "#eac283"
  nav-selected: "#deeadc"
  nav-selected-ink: "#174d40"
  planned-surface: "#f3e9cb"
  planned-ink: "#6f4b10"
  ongoing-surface: "#f7e3d9"
  ongoing-ink: "#913325"
  completed-surface: "#e2ecde"
  completed-ink: "#225a43"
  cancelled-surface: "#e6e8df"
  cancelled-ink: "#485646"
  warning-chip-surface: "#f3dfb9"
  warning-chip-ink: "#69400c"
  record-selected: "#e3ecdf"
  record-hover: "#eaf0e3"
  map-planned: "#94651b"
  map-ongoing: "#b54432"
  map-completed: "#27796a"
  map-idle: "#94aaa3"
typography:
  headline:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "clamp(25px,3vw,36px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.025em"
  section:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.015em"
  title:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  record-body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  note:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
  status:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  status: "4px"
  control: "8px"
  record: "12px"
  sheet: "16px"
spacing:
  step-4: "4px"
  step-8: "8px"
  step-12: "12px"
  step-16: "16px"
  step-24: "24px"
  step-32: "32px"
  step-48: "48px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-primary-hover:
    backgroundColor: "{colors.green-hover}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-warning:
    backgroundColor: "{colors.warning-surface}"
    textColor: "{colors.warning-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-warning-hover:
    backgroundColor: "{colors.warning-hover}"
    textColor: "{colors.warning-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  input-record:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px"
  chip-planned:
    backgroundColor: "{colors.planned-surface}"
    textColor: "{colors.planned-ink}"
    typography: "{typography.status}"
    rounded: "{rounded.status}"
    padding: "5px 7px"
  record-row:
    textColor: "{colors.ink}"
    padding: "16px 0 18px"
  nav-active:
    backgroundColor: "{colors.nav-selected}"
    textColor: "{colors.nav-selected-ink}"
    rounded: "{rounded.control}"
---

# Design System: awgur

## Overview

**Creative North Star: "Civic street atlas"**

A civic street atlas: warm paper, dark green ink, forest actions, amber schedule notes and rust red clash warnings. Public Sans, ruled lists and labelled records make public responsibility readable. The voice is plain and factual; the public name is lowercase awgur.

The reusable signature is a map connected to an expandable street record. The ledger feeds the decision: dates, agency, restoration responsibility and findings retain their context. This is a working civic record with compact supporting notes, rather than a marketing presentation.

**Key Characteristics:**
- Paper and green civic materials.
- Ruled records instead of nested cards.
- Locally bundled Public Sans.
- Map and sheet share selection.
- Text and icons accompany status.

## Colors

The palette is warm paper and green ink, with amber and rust reserved for schedule and clash information. The frontmatter owns exact values; it captures shared colors and the implemented state variants, not every one-off map overlay tint.

### Primary
- **Forest action:** green drives primary actions, focus outlines, links and ledger points; green-hover deepens the action on hover.

### Secondary
- **Schedule amber:** amber and warning tokens carry schedule cautions and approval-with-warning actions.

### Tertiary
- **Clash rust:** red signals actionable findings. Informational Clock Risk findings use muted ink instead.

### Neutral
- **Warm paper / record surface:** paper fills the shell and first paint; surface supports fields and the street sheet.
- **Dark green ink / quiet ink:** ink carries reading text; muted carries secondary facts and supporting notes.
- **Record line:** line divides related facts and records without enclosing each in a card.
- Status and map variants retain their observed assignments; map geometry has distinct planned, ongoing, completed and idle colors.

**The Status Has Words Rule.** Color accompanies a named status or finding; it never carries the meaning alone.

## Typography

**Display Font:** Public Sans, with sans-serif fallback.
**Body Font:** Public Sans, with sans-serif fallback.

The locally bundled family uses regular, semibold and bold weights (400/600/700). Headings wrap long names. No separate display or mono family is introduced.

### Hierarchy
- **Headline:** responsive page heading, captured by headline; project headings have a narrower measure (28ch).
- **Section:** section heading; title serves smaller subsection headings.
- **Body:** ordinary prose; record-body serves permit and project detail.
- **Label:** semibold field and action labels; status is the compact chip treatment.
- **Note:** supporting disclosure and method text. Existing contextual map/header annotations are smaller, not a general reading-text standard.

**The Record First Rule.** Keep titles, agency, dates and evidence legible before adding visual emphasis.

## Layout

The spacing rhythm uses the frontmatter steps, with component-specific insets preserved in source. Pages scroll inside the fixed-height shell, keep safe-area insets and have a maximum width (1180px); the About reading surface is narrower (1040px). Detail prose uses a measure up to 70ch, introductory prose 65ch.

Street's first viewport presents search, registry geometry and the selected street work list. Below the desktop split breakpoint (900px), the final default map/sheet ratio is 44%/56%; the sheet overlaps the map by 12px and expands to 88%. Short portrait viewports at height 700px or below use 33%/67%. At desktop, a flexible map and fixed record panel (380px) sit side by side in a workspace up to 1600px. Review uses a pending list (300px) alongside detail; project detail pairs its main column with a responsibility column (300px), separated by 48px. Selected mobile permit detail comes before the list.

Compact landscape (600–899px wide and at most 600px high) uses a 55%/45% map/record split. Its 40px search/account exceptions are observed drift from the established 48px floor, not normative control tokens.

## Elevation & Depth

Ruled records are flat. Tonal surfaces distinguish restoration, notices and selections. Soft shadows belong to overlays: search results, map tooltips/flags and modal dialogs. The sidecar records their exact vocabulary. No hard offset shadow is introduced.

**The Ruled Record Rule.** Use lines and spacing for ordinary record grouping; reserve floating depth for overlays.

## Shapes

Controls use gentle corners; chips use tighter corners; special responsibility records use broader corners. The phone sheet has rounded top corners and becomes square in desktop and compact landscape splits. Ledger points and the demo indicator are circles. Borders are thin (1px), normally record line; controls and selected records retain their contextual border colors. Rounded controls do not require every record to become a rounded card.

## Components

### Buttons
Plain, readable actions. Primary, secondary and warning variants use the frontmatter assignments and an established minimum height (48px), not a fixed height that clips wrapped text. Secondary and warning actions retain 1px borders. Hover changes fill; keyboard focus uses a forest outline (3px) with offset (3px). Disabled actions reduce opacity to .5 and show a not-allowed cursor. Icon controls have a 48px square target and SVG icons.

### Chips
Compact factual labels, not action buttons. Planned, ongoing, completed and cancelled states use their paired surface/ink colors, semibold type and tight corners. Warning chips preserve amber semantics.

### Cards / Containers
Most content is a ruled row or section, not a card. Work rows use a bottom divider and a subtle tonal hover. Permit selection uses a pale green surface and control corners. Restoration and public emergency records are the special tonal containers, with 20px padding and record corners.

### Inputs / Fields
Explicit labels sit above fields with an 8px gap. Surface fill, record-line border, control corners and 12px padding define inputs, selects and textareas. Focus follows the shared forest outline; textarea grows vertically with minimum height 100px. Checkbox inputs are 20px inside labelled segment rows with a 48px target. Errors explain recovery in a rust-toned message; disabled review dates preserve their value.

### Navigation
The paper bottom navigation keeps SVG icons and words. Active destinations gain a pale green fill and bold green ink. Phone targets are at least 52px tall; desktop navigation becomes a horizontal icon/label row. Safe-bottom padding remains part of the shell.

### Map and street sheet
Selecting geometry fits the map without animated panning and shares selection with the sheet. The expandable heading exposes its state; the scroller is independent. Only sheet height transitions (220ms, cubic-bezier(.16,1,.3,1)); reduced motion removes transitions. Source credit stays visible above the overlapping sheet. Basemap failure retains bundled street geometry and an explanatory note.

### Findings, forecast and decision records
Findings retain rule name, location, explanation and related-work links. Warning headings use rust; informational findings use muted ink. Finish forecast and earliest-safe-start sections extend the ruled record with headings, ordinary prose and small method notes. Insufficient history is a textual result. Tables retain captions, tabular numerals and horizontal overflow. Review presents permit facts, rerun findings, validated suggestion and decision actions in that order; emergency justification becomes part of the public record.

## Do's and Don'ts

### Do:
- Do keep awgur lowercase and use plain factual labels.
- Do retain agency, dates and responsibility in ruled records.
- Do pair status color with text and an SVG icon where used.
- Do provide recovery text for empty, loading, missing and error states.
- Do use the established 48px control floor, visible focus and safe-area insets.
- Do remove transitions when reduced motion is requested.

### Don't:
- Don't add marketing heroes, decorative imagery, gradients or nested cards.
- Don't replace the atlas and ledger language with a new aesthetic.
- Don't express a warning or forecast uncertainty through color alone.
- Don't inherit compact landscape control exceptions as a new control standard.
