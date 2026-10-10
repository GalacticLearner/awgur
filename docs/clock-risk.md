# Clock Risk implementation

Clock Risk uses completion slips from the app’s completed records to estimate an upper finish date, then checks the configurable moratorium against that date. It connects the public delay ledger to the permit decision. It applies established conformal order statistics; it is not a new mathematical method or a claim of first use.

## Computation

Slip is actual completion minus the published planned end, in whole UTC days. Reference classes fall back from agency and type, to agency, to type, to all completed records. The first class with enough records is chosen using counts, before any overdue filter. With miscoverage alpha, the rank is ceil((n+1)(1-alpha)), with a numerical epsilon to avoid floating point overshoot. If the rank exceeds n, there is no finite bound and no forecast is displayed.

The default alpha is 0.10, requiring at least nine records. For an ongoing work already L days overdue, only calibration slips greater than L remain eligible. Early-finish bounds never move the proposed upper finish before the planned end. The forecasting computation does not overwrite work.end or actualEnd. Existing approved R3 rescheduling remains a separate operation that updates a planned work’s schedule before completion.

The coverage guarantee is marginal and requires exchangeable calibration and future slips in the selected reference class. It does not establish a probability for one street or season. Integer ties support the lower coverage bound, without an upper-coverage claim. Method reference: [Angelopoulos and Bates](https://arxiv.org/abs/2107.07511).

## R6 and suggested start

R6 checks only disturbing permits on the same segment as a planned or ongoing relay/resurfacing. Ongoing planned-date clashes stay owned by R1. Other R6 warnings distinguish a planned-date clash from one introduced by the finish bound. Nearby unassessed cases are informational.

The suggested start takes the latest relevant expiry, preserves permit duration and reruns R1, R2 and R6. It is withheld if any warning remains. Emergency permits retain warnings and require a public override reason through the existing emergency decision path.

## Data and results

The added calibration ledger contains 100 completed synthetic works. A separate seeded random stream preserves the 128 incumbent works and six original permits for flag-off operation. Ledger segments avoid all constructed scenario segments and their neighbours. One formerly clear permit becomes the Clock Risk demonstration; the combined R1/R2/R3 hero stays unchanged.

All 196 eligible completed app records participate in calibration, including incumbent background works. Thus six added BSNL records do not force insufficiency: broader fallback can be sufficient. The overdue BSNL demonstration has too few completion records beyond its elapsed lateness and reports that fact.

The generated leave-one-out results are in [validation.md](validation.md). Current seed: 179/196 finish-bound coverage (91.3%); among 63 completed relays/resurfacings, planned-date false-safe starts are 56/63 and slip-bound false-safe starts are 3/63. Mean additional wait is 11.9 days and median is 12. These synthetic mechanism checks do not measure Chennai benefits. The seed was not changed to improve the results.

## Acceptance

- Unit tests exercise rank boundaries, ties, negative slips, reference fallback, overdue filtering, emergency and calendar cases, and rejected suggestions.
- Seeded simulations use 20,000 trials for each distribution/size/conditioning case, including many ties, with both timezone outputs compared.
- Frozen pre-feature snapshots verify exact seed restoration and unchanged R1/R2/R3 metrics.
- A separate browser build with ENABLE_CLOCK_RISK false checks the original data, hidden forecast/backtest and absence of R6 findings.
- Installed Android and responsive browser flows verify forecast, insufficient-history output and apply/recheck behavior.

## Limits

All delay distributions are synthetic assumptions. Completed-only calibration excludes abandoned and still-running works. Monsoon, contractors and programmes can shift delays; padded planned dates can distort slips. Local roles and decisions have no authentication or shared server. Real-data calibration, temporal holdouts and seasonal reference classes remain research directions.
