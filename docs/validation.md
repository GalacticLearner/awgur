# Validation

Independently constructed synthetic cases; each case runs against its explicitly named fixture works, not random background records. This tests implementation correctness, not real Chennai clash rates.

76 cases. Ground truth generated and committed before the rule code. No labels are derived from predictions.

| Rule / baseline | TP | FP | FN | Precision | Recall |
|---|---:|---:|---:|---:|---:|
| R1 | 16 | 0 | 0 | 100.0% | 100.0% |
| R2 | 12 | 0 | 0 | 100.0% | 100.0% |
| R3 | 12 | 0 | 0 | 100.0% | 100.0% |
| B0 | 1 | 14 | 27 | 6.7% | 3.6% |
| B1 | 1 | 18 | 27 | 5.3% | 3.6% |

R3 valid suggestions: 12/12 (100.0%).

## Every false positive and false negative

- B0 FN: r1_positive-01 — 1 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-02 — 2 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-03 — 3 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-04 — 4 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-05 — 5 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-06 — 6 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-07 — 7 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-08 — 8 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-09 — 9 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-10 — 10 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-11 — 11 months after actual resurfacing completion on the same segment
- B0 FN: r1_positive-12 — 1 months after actual resurfacing completion on the same segment
- B0 FN: r1_emergency-01 — Emergency requests still receive moratorium warnings
- B0 FN: r1_emergency-02 — Emergency requests still receive moratorium warnings
- B0 FN: r1_emergency-03 — Emergency requests still receive moratorium warnings
- B0 FN: r1_emergency-04 — Emergency requests still receive moratorium warnings
- B0 FN: r2_positive-02 — 8-day gap on an adjacent segment, different agency
- B0 FN: r2_positive-03 — 16-day gap on the same segment, different agency
- B0 FN: r2_positive-04 — 24-day gap on an adjacent segment, different agency
- B0 FN: r2_positive-05 — 32-day gap on the same segment, different agency
- B0 FN: r2_positive-06 — 40-day gap on an adjacent segment, different agency
- B0 FN: r2_positive-07 — 48-day gap on the same segment, different agency
- B0 FN: r2_positive-08 — 56-day gap on an adjacent segment, different agency
- B0 FN: r2_positive-09 — 64-day gap on the same segment, different agency
- B0 FN: r2_positive-10 — 72-day gap on an adjacent segment, different agency
- B0 FN: r2_positive-11 — 80-day gap on the same segment, different agency
- B0 FN: r2_positive-12 — 90-day gap on an adjacent segment, different agency
- B0 FP: r2_negative-01 — Same-agency phases of the same named project
- B0 FP: r2_negative-03 — Same street label but non-adjacent segments
- B0 FP: r2_negative-05 — Same-agency phases of the same named project
- B0 FP: r2_negative-07 — Same street label but non-adjacent segments
- B0 FP: r2_negative-09 — Same-agency phases of the same named project
- B0 FP: r2_negative-11 — Same street label but non-adjacent segments
- B0 FP: r2_negative-13 — Same-agency phases of the same named project
- B0 FP: r2_negative-15 — Same street label but non-adjacent segments
- B0 FP: r3_positive-01 — Feasible windows overlap with room for both durations
- B0 FP: r3_positive-02 — Feasible windows overlap with room for both durations
- B0 FP: r3_positive-03 — Feasible windows overlap with room for both durations
- B0 FP: r3_positive-04 — Feasible windows overlap with room for both durations
- B0 FP: r3_positive-05 — Feasible windows overlap with room for both durations
- B0 FP: r3_positive-06 — Feasible windows overlap with room for both durations
- B1 FN: r1_positive-01 — 1 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-02 — 2 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-03 — 3 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-04 — 4 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-05 — 5 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-06 — 6 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-07 — 7 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-08 — 8 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-09 — 9 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-10 — 10 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-11 — 11 months after actual resurfacing completion on the same segment
- B1 FN: r1_positive-12 — 1 months after actual resurfacing completion on the same segment
- B1 FN: r1_emergency-01 — Emergency requests still receive moratorium warnings
- B1 FN: r1_emergency-02 — Emergency requests still receive moratorium warnings
- B1 FN: r1_emergency-03 — Emergency requests still receive moratorium warnings
- B1 FN: r1_emergency-04 — Emergency requests still receive moratorium warnings
- B1 FN: r2_positive-02 — 8-day gap on an adjacent segment, different agency
- B1 FN: r2_positive-03 — 16-day gap on the same segment, different agency
- B1 FN: r2_positive-04 — 24-day gap on an adjacent segment, different agency
- B1 FN: r2_positive-05 — 32-day gap on the same segment, different agency
- B1 FN: r2_positive-06 — 40-day gap on an adjacent segment, different agency
- B1 FN: r2_positive-07 — 48-day gap on the same segment, different agency
- B1 FN: r2_positive-08 — 56-day gap on an adjacent segment, different agency
- B1 FN: r2_positive-09 — 64-day gap on the same segment, different agency
- B1 FN: r2_positive-10 — 72-day gap on an adjacent segment, different agency
- B1 FN: r2_positive-11 — 80-day gap on the same segment, different agency
- B1 FN: r2_positive-12 — 90-day gap on an adjacent segment, different agency
- B1 FP: r2_negative-01 — Same-agency phases of the same named project
- B1 FP: r2_negative-03 — Same street label but non-adjacent segments
- B1 FP: r2_negative-04 — Overlapping dates on a different street
- B1 FP: r2_negative-05 — Same-agency phases of the same named project
- B1 FP: r2_negative-07 — Same street label but non-adjacent segments
- B1 FP: r2_negative-08 — Overlapping dates on a different street
- B1 FP: r2_negative-09 — Same-agency phases of the same named project
- B1 FP: r2_negative-11 — Same street label but non-adjacent segments
- B1 FP: r2_negative-12 — Overlapping dates on a different street
- B1 FP: r2_negative-13 — Same-agency phases of the same named project
- B1 FP: r2_negative-15 — Same street label but non-adjacent segments
- B1 FP: r2_negative-16 — Overlapping dates on a different street
- B1 FP: r3_positive-01 — Feasible windows overlap with room for both durations
- B1 FP: r3_positive-02 — Feasible windows overlap with room for both durations
- B1 FP: r3_positive-03 — Feasible windows overlap with room for both durations
- B1 FP: r3_positive-04 — Feasible windows overlap with room for both durations
- B1 FP: r3_positive-05 — Feasible windows overlap with room for both durations
- B1 FP: r3_positive-06 — Feasible windows overlap with room for both durations

## Limits

These isolated fixtures are intentionally synthetic, balanced and constructed; perfect performance is not evidence of usefulness on real permits. Adjacent segments share exact OSM endpoints. Opposite carriageways are distinct segment ids. No coordinate snapping or parsing is implemented, so their robustness/accuracy tests are omitted. B0 is exact street-name plus overlapping dates; B1 ignores space and checks date overlap only. Both baselines use effective actual completion dates.

## Clock Risk

Synthetic seeded ledger, including existing completed demo records. Generated delay distributions are assumptions. Leave-one-out replay checks the mechanism; it does not estimate Chennai delays, real permit error rates or a per-work probability.

Leave-one-out upper-bound coverage: 179/196 (91.3%). Insufficient history: 0.

| Agency | Covered/evaluated | Coverage | Insufficient |
|---|---:|---:|---:|
| GCC | 40/44 | 90.9% | 0 |
| BSNL | 21/23 | 91.3% | 0 |
| PrivateTelecom | 35/38 | 92.1% | 0 |
| Tangedco | 43/47 | 91.5% | 0 |
| CMWSSB | 40/44 | 90.9% | 0 |

Hindsight relay/resurface comparison (63 records): planned-date false-safe 56/63 (88.9%); slip-bound false-safe 3/63 (4.8%). Mean extra wait 11.9 days; median 12 days.

Excluded from coverage: none. Excluded from hindsight: none.

The finite-sample lower coverage guarantee requires exchangeable scores in the chosen reference class. It is marginal, not a guarantee for this street or season. Tied integer slips can over-cover. Completed records exclude abandoned and still-running works; seasonal shifts and padded baseline schedules can invalidate the practical assumption.
