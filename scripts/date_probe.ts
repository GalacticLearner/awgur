import { addMonths,addDays,daysBetween,intervalGap } from '../src/engine/dates';
console.log(JSON.stringify([addMonths('2024-01-31',1),addMonths('2025-01-31',1),addMonths('2024-02-29',12),addDays('2026-10-10',-90),daysBetween('2024-02-28','2024-03-01'),intervalGap('2026-03-01','2026-03-07','2026-03-06','2026-03-10')]));
