import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LoyaltyTier = 'Cinnamon' | 'Saffron' | 'Cardamom' | 'Clove';

export type LoyaltyMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: LoyaltyTier;
  points: number;
  memberSince: string;   // ISO date string
  memberNumber: string;  // e.g. "CCP-4721"
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
      logout:     ()               => set({ member: null }),
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
export const TIER_CONFIG = {
  Clove: {
    icon:       '🌿',
    label:      'Clove',
    pointsMin:  0,
    pointsMax:  499,
    nextAt:     500,
    discount:   5,
    cardFrom:   '#2C3E32',   
    cardVia:    '#4D6B56',   
    cardTo:     '#8BAA7B',   
    badgeBg:    'bg-[#EEF6F0]',
    badgeText:  'text-[#2C3E32]',
    ringColor:  'ring-[#4D6B56]',
    perks: [
      '5% off every order',
      'Birthday bonus points',
      'Member-only newsletter',
    ],
  },
  Cinnamon: {
    icon:       '🫚',
    label:      'Cinnamon',
    pointsMin:  500,
    pointsMax:  999,
    nextAt:     1000,
    discount:   5,
    cardFrom:   '#92400E',   // amber-800
    cardVia:    '#B45309',   // amber-700
    cardTo:     '#D97706',   // amber-600
    badgeBg:    'bg-amber-100',
    badgeText:  'text-amber-800',
    ringColor:  'ring-amber-400',
    perks: [
      '5% off every order',
      'Birthday bonus points',
      'Member-only newsletter',
    ],
  },
  Saffron: {
    icon:       '🌾',
    label:      'Saffron',
    pointsMin:  1000,
    pointsMax:  4999,
    nextAt:     5000,
    discount:   10,
    cardFrom:   '#9A3412',   // orange-800
    cardVia:    '#C2410C',   // orange-700
    cardTo:     '#EA580C',   // orange-600
    badgeBg:    'bg-orange-100',
    badgeText:  'text-orange-800',
    ringColor:  'ring-orange-400',
    perks: [
      '10% off every order',
      'Free delivery once a week',
      'Double points on weekends',
      'Birthday bonus points',
      'Priority order queue',
    ],
  },
  Cardamom: {
    icon:       '💚',
    label:      'Cardamom',
    pointsMin:  5000,
    pointsMax:  Infinity,
    nextAt:     null,
    discount:   15,
    cardFrom:   '#7F1D1D',   // red-900
    cardVia:    '#991B1B',   // red-800
    cardTo:     '#DC2626',   // red-600
    badgeBg:    'bg-red-100',
    badgeText:  'text-red-800',
    ringColor:  'ring-red-400',
    perks: [
      '15% off every order',
      'Unlimited free delivery',
      'Triple points on weekends',
      'Birthday surprise meal',
      'Priority order queue',
      'Early access to new dishes',
      'WhatsApp concierge support',
    ],
  },
} as const;

// ── Helpers ────────────────────────────────────────────────────────────────
export function getTierForPoints(points: number): LoyaltyTier {
  if (points >= 5000) return 'Cardamom';
  if (points >= 1000) return 'Saffron';
  if (points >= 500) return 'Cinnamon';
  return 'Clove';
}

export function getProgressPercent(points: number, tier: LoyaltyTier): number {
  if (tier === 'Cardamom') return 100;
  const cfg = TIER_CONFIG[tier];
  const range = cfg.nextAt! - cfg.pointsMin;
  return Math.min(((points - cfg.pointsMin) / range) * 100, 100);
}

export function getPointsToNext(points: number, tier: LoyaltyTier): number {
  const cfg = TIER_CONFIG[tier];
  if (!cfg.nextAt) return 0;
  return Math.max(cfg.nextAt - points, 0);
}

export function getNextTier(tier: LoyaltyTier): LoyaltyTier | null {
    if (tier === 'Clove') return 'Cinnamon';
  if (tier === 'Cinnamon') return 'Saffron';
  if (tier === 'Saffron')  return 'Cardamom';
  return null;
}