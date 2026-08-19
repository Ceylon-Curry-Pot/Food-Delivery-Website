// ── Loyalty points engine ──────────────────────────────────────────────────
// Pure, dependency-free rules shared by the server (award/tier logic) and the
// client (progress bars, "you'll earn N points" previews). Keep it free of DB
// and React imports so both sides can use the exact same maths.
//
// Earning rate:    1 point per Rs. 50 spent
// Birthday month:  3× multiplier
//
// Tier thresholds are intentionally demanding:
//   Clove     →  0 – 249      pts  (~8  orders to exit)
//   Cinnamon  →  250 – 999    pts  (~25 more orders to exit)
//   Saffron   →  1,000 – 3,499 pts (~50 more orders to exit)
//   Cardamom  →  3,500+            (elite — roughly 1+ year of loyal ordering)

export type LoyaltyTierValue = 'Clove' | 'Cinnamon' | 'Saffron' | 'Cardamom';

export const RUPEES_PER_POINT = 50;
export const BIRTHDAY_MONTH_MULTIPLIER = 3;

/** Highest threshold first — `getTierForPoints` returns the first match. */
export const TIER_THRESHOLDS = [
  { tier: 'Cardamom', min: 3500 },
  { tier: 'Saffron',  min: 1000 },
  { tier: 'Cinnamon', min: 250  },
  { tier: 'Clove',    min: 0    },
] as const satisfies ReadonlyArray<{ tier: LoyaltyTierValue; min: number }>;

export const TIER_ORDER: LoyaltyTierValue[] = ['Clove', 'Cinnamon', 'Saffron', 'Cardamom'];

/** The tier a member belongs to at a given points balance. */
export function getTierForPoints(points: number): LoyaltyTierValue {
  const safe = Number.isFinite(points) ? points : 0;
  return TIER_THRESHOLDS.find((t) => safe >= t.min)?.tier ?? 'Clove';
}

/**
 * Calendar month (1–12) in Sri Lanka, regardless of where the server runs.
 * Asia/Colombo is UTC+5:30 year-round (no DST), so this is stable.
 */
function monthInColombo(when: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Colombo',
      month: 'numeric',
    }).format(when)
  );
}

/**
 * `birthday` is stored as an ISO date string, e.g. "1995-08-15".
 * Read the month off the string rather than via `new Date()` so a UTC-negative
 * server can't shift an early-of-month birthday into the previous month.
 */
export function isBirthdayMonth(birthday: string | undefined | null, when: Date = new Date()): boolean {
  if (typeof birthday !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday.trim());
  if (!match) return false;

  const birthMonth = Number(match[2]);
  if (birthMonth < 1 || birthMonth > 12) return false;

  return birthMonth === monthInColombo(when);
}

export type PointsCalculation = {
  /** Points before any multiplier. */
  basePoints: number;
  /** 1 normally, 3 during the member's birthday month. */
  multiplier: number;
  /** Final points to credit. */
  points: number;
  birthdayBonus: boolean;
};

/**
 * Points earned for spending `amount` rupees.
 *
 * The base is floored first, then multiplied — so a birthday order always
 * earns exactly 3× what the same order would earn on a normal day.
 */
export function calculatePointsEarned({
  amount,
  birthday,
  when = new Date(),
}: {
  amount: number;
  birthday?: string | null;
  when?: Date;
}): PointsCalculation {
  const spend = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const basePoints = Math.floor(spend / RUPEES_PER_POINT);

  const birthdayBonus = isBirthdayMonth(birthday, when);
  const multiplier = birthdayBonus ? BIRTHDAY_MONTH_MULTIPLIER : 1;

  return {
    basePoints,
    multiplier,
    points: basePoints * multiplier,
    birthdayBonus,
  };
}
