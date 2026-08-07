import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { loyaltySignOut } from '@/lib/loyaltyApi';

export type LoyaltyTier = 'Clove' | 'Cinnamon' | 'Saffron' | 'Cardamom';

export type LoyaltyMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  tier: LoyaltyTier;
  points: number;
  memberSince: string;
  memberNumber: string;
};

type LoyaltyStore = {
  member: LoyaltyMember | null;
  isModalOpen: boolean;
  modalTab: 'signin' | 'signup';
  openModal: (tab?: 'signin' | 'signup') => void;
  closeModal: () => void;
  setMember: (member: LoyaltyMember) => void;
  logout: () => void;
};

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set) => ({
      member:      null,
      isModalOpen: false,
      modalTab:    'signin',
      openModal:  (tab = 'signin') => set({ isModalOpen: true, modalTab: tab }),
      closeModal: ()               => set({ isModalOpen: false }),
      setMember:  (member)         => set({ member, isModalOpen: false }),
      logout:     ()               => {
        // Clear server session (fire-and-forget; UI updates immediately)
        loyaltySignOut().catch(() => {});
        set({ member: null });
      },
    }),
    {
      name: 'ccp-loyalty-v1',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
      partialize: (state) => ({ member: state.member }),
    }
  )
);

// ── Tier configuration ─────────────────────────────────────────────────────
// Earning rate: 1 point per Rs. 50 spent
// Weekend: 2× multiplier | Birthday month: 3× multiplier
//
// Tier thresholds are intentionally demanding:
//   Clove     →  0 – 249   pts  (~8  weekday orders to exit)
//   Cinnamon  →  250 – 999 pts  (~25 more orders to exit)
//   Saffron   →  1,000 – 3,499  (~50 more orders to exit)
//   Cardamom  →  3,500+         (elite — roughly 1+ year of loyal ordering)

export const TIER_CONFIG = {
  Clove: {
    icon:          '🌿',
    label:         'Clove',
    pointsMin:     0,
    pointsMax:     249,
    nextAt:        250,
    discountLabel: 'Welcome Tier',
    cardFrom:      '#1C3829',
    cardVia:       '#2D5A3D',
    cardTo:        '#4A7C59',
    badgeBg:       'bg-emerald-950',
    badgeText:     'text-emerald-300',
    ringColor:     'ring-emerald-600',
    perks: [
      'Birthday bonus points',
      'Member-only newsletter',
      'Early event notifications',
    ],
    tablePerks: {
      birthdayBonus:   true,
      discountOn5k:    false,
      higherDiscount:  false,
      freeDelivery:    false,
      sundayOff:       false,
      priorityQueue:   false,
      whatsappSupport: false,
    },
  },
  Cinnamon: {
    icon:          '🫚',
    label:         'Cinnamon',
    pointsMin:     250,
    pointsMax:     999,
    nextAt:        1000,
    discountLabel: '5% off Rs. 5,000+ orders',
    cardFrom:      '#92400E',
    cardVia:       '#B45309',
    cardTo:        '#D97706',
    badgeBg:       'bg-amber-100',
    badgeText:     'text-amber-800',
    ringColor:     'ring-amber-400',
    perks: [
      '5% off on orders above Rs. 5,000',
      'Birthday bonus points',
      'Member-only newsletter',
    ],
    tablePerks: {
      birthdayBonus:   true,
      discountOn5k:    true,
      higherDiscount:  false,
      freeDelivery:    false,
      sundayOff:       false,
      priorityQueue:   false,
      whatsappSupport: false,
    },
  },
  Saffron: {
    icon:          '🌾',
    label:         'Saffron',
    pointsMin:     1000,
    pointsMax:     3499,
    nextAt:        3500,
    discountLabel: '10% off Rs. 5,000+ orders',
    cardFrom:      '#9A3412',
    cardVia:       '#C2410C',
    cardTo:        '#EA580C',
    badgeBg:       'bg-orange-100',
    badgeText:     'text-orange-800',
    ringColor:     'ring-orange-400',
    perks: [
      '10% off on orders above Rs. 5,000',
      'Free delivery once a week',
      'Birthday bonus points',
      'Priority order queue',
    ],
    tablePerks: {
      birthdayBonus:   true,
      discountOn5k:    true,
      higherDiscount:  true,
      freeDelivery:    true,
      sundayOff:       false,
      priorityQueue:   true,
      whatsappSupport: false,
    },
  },
  Cardamom: {
    icon:          '💚',
    label:         'Cardamom',
    pointsMin:     3500,
    pointsMax:     Infinity,
    nextAt:        null,
    discountLabel: '10% off + Sunday 20% off',
    cardFrom:      '#7F1D1D',
    cardVia:       '#991B1B',
    cardTo:        '#DC2626',
    badgeBg:       'bg-red-100',
    badgeText:     'text-red-800',
    ringColor:     'ring-red-400',
    perks: [
      '10% off on orders above Rs. 5,000',
      'Free delivery once a week',
      'Sunday meals 20% off',
      'Birthday bonus points',
      'Priority order queue',
      'Early access to new dishes',
      'WhatsApp concierge support',
    ],
    tablePerks: {
      birthdayBonus:   true,
      discountOn5k:    true,
      higherDiscount:  true,
      freeDelivery:    true,
      sundayOff:       true,
      priorityQueue:   true,
      whatsappSupport: true,
    },
  },
} as const;

// ── Helpers ────────────────────────────────────────────────────────────────
export function getTierForPoints(points: number): LoyaltyTier {
  if (points >= 3500) return 'Cardamom';
  if (points >= 1000) return 'Saffron';
  if (points >= 250)  return 'Cinnamon';
  return 'Clove';
}

export function getProgressPercent(points: number, tier: LoyaltyTier): number {
  if (tier === 'Cardamom') return 100;
  const cfg   = TIER_CONFIG[tier];
  const range = cfg.nextAt! - cfg.pointsMin;
  return Math.min(((points - cfg.pointsMin) / range) * 100, 100);
}

export function getPointsToNext(points: number, tier: LoyaltyTier): number {
  const cfg = TIER_CONFIG[tier];
  if (!cfg.nextAt) return 0;
  return Math.max(cfg.nextAt - points, 0);
}

export function getNextTier(tier: LoyaltyTier): LoyaltyTier | null {
  if (tier === 'Clove')    return 'Cinnamon';
  if (tier === 'Cinnamon') return 'Saffron';
  if (tier === 'Saffron')  return 'Cardamom';
  return null;
}

export const TIER_ORDER: LoyaltyTier[] = ['Clove', 'Cinnamon', 'Saffron', 'Cardamom'];