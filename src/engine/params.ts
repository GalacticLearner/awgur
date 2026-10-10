export const DEMO_TODAY = '2026-10-10';
// Configurable default. Scope of the documented Chennai moratorium is unverified.
export const MORATORIUM_MONTHS = 12;
// Demonstration assumptions, not government rules.
export const REPEAT_GAP_DAYS = 90;
export const BUNDLE_HORIZON_DAYS = 180;
export const DEFAULT_FLEX_DAYS = 30;
export const RESTORATION_DAYS = 30;
export const DEEMED_APPROVAL_DAYS = 30; // Illustrative placeholder, not legal advice.
export const RECENT_MONTHS = 12;
export const ENABLE_CLOCK_RISK = true;
export const SLIP_ALPHA = 0.10; // Demo assumption: 90% marginal coverage under exchangeability.
export const SLIP_MIN_N = Math.ceil(1 / SLIP_ALPHA) - 1;
export const CLOCK_RISK_NEAR_DAYS = 90; // Demo assumption for insufficient-history notices.
export const MILLISECONDS_PER_DAY = 86_400_000;
export const AVERAGE_DAYS_PER_MONTH = 30.4375; // Display estimate only; expiry uses calendar months.
export const DISTURBING_TYPES = ['cut','pipeline','cable','drain'] as const;
export const RESURFACING_TYPES = ['relay','resurface'] as const;
export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION = '© OpenStreetMap contributors';
export const HOSTED_URL = 'https://galacticlearner.github.io/awgur/';
export const RELEASE_URL = 'https://github.com/GalacticLearner/awgur/releases/latest';
