# Product
<!-- impeccable:product-schema 1 -->
## Platform
web
## Stack
React, TypeScript, Vite, HashRouter and Leaflet. Packaged as an Android app (APK) using Capacitor 8; same build hosted publicly.
## Users
Chennai residents using a phone outdoors with patchy connectivity. Secondary: municipal and utility officers reviewing road-cut permits. Judges may use a laptop or an Android phone.
## Product Purpose
Show planned, ongoing and recent public works on a street, record delays and restoration responsibility, and warn officers before approving a clashing permit.
## Positioning
Permit-time checks tied to a public departmental record. Demonstration only: no government integration, real authentication or proven real-world benefit.
## Operating Context
Resident searches or taps street, opens work detail. Officer selects permit, inspects R1/R2 findings, applies a validated R3 window or logs an emergency justification.
## Capabilities and Constraints
Client-only static JSON, localStorage edits; fixed demo date 2026-10-10. English. Android only; hosted link for other devices. Bundled geometry and data work offline. No service worker. Real OSM street geometry where available; synthetic works persistently labelled.
## Brand Commitments
awgur. Plain factual civic voice; no hype, emoji, slogans or fabricated facts.
## Evidence on Hand
docs/research_context.md and plan.md. Parameters with uncertain legal scope must be labelled configurable or illustrative. No claims of money saved or road life gained.
## Product Principles
Check before approval; make agency responsibility visible; show exceptions publicly; prefer a validated suggestion to speculative advice.

Clock Risk connects the completed-work delay ledger to a finite-sample upper finish bound and the permit moratorium clock. This is an application of established conformal methods, with synthetic data, an explicit exchangeability condition and no claim of being first. Insufficient history is an output, not a guessed date.
## Accessibility & Inclusion
High contrast, status conveyed by icon and text, 48px touch targets, reduced motion, Android system-bar insets. Mobile-first 390x844; desktop split layout at 900px.
