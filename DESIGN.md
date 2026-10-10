# Interface direction

## Visual world
A civic street atlas: warm paper (#f6f4eb), dark green ink (#193b36), forest actions (#17594e), amber schedule notes, rust red clash warnings. Public Sans is locally bundled. Lines and ruled lists convey records; limited rounded surfaces for controls. No marketing hero, decorative imagery, gradients or nested cards.

## Street
Operate mode. First viewport shows street search, live registry geometry, status legend and a selected hero street with a compact work list. Selecting a street fits geometry and reveals the sheet; expanding the sheet is the signature interaction. A clear named default street supports the under-ten-second judge path. At >=900px map and list are side by side.

## Project
Operate/read mode. Title and status, agency and purpose, planned/actual timeline, restoration responsibility, then dated ledger. Follow and officer-only delay entry remain available. Long titles wrap. Missing project has a recovery link.

## Officer
Operate mode. Pending list first, selected permit dates and agency second, findings and validated dig-once suggestion next, decision actions last. Applying a suggestion reruns checks. Emergency reason is required and becomes public. New-permit entry uses an inline form with explicit segment selection.

## About
Read mode. Separate real/synthetic disclosures, assumptions, validation results and false-positive lists, limits, reset demo and Android information.

## Tokens and states
Space: 4,8,12,16,24,32,48px. Text: 12,14,16,20,28,36px; weights 400/600/700. Minimum controls 48px. Focus: 3px forest outline. Borders #ccd5cb. Empty/loading/error states explain recovery. Subtle sheet transition only; reduced-motion removes it. First paint and splash use paper. Header is paper with dark system icons. Safe inset fallback uses Capacitor CSS variables.
