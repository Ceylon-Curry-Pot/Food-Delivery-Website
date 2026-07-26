'use client';

import { LoyaltyMember, TIER_CONFIG, getProgressPercent, getPointsToNext, getNextTier } from './useLoyaltyStore';

type Props = {
  member: LoyaltyMember;
  showProgress?: boolean;
};

export default function LoyaltyMemberCard({ member, showProgress = false }: Props) {
  const tier        = TIER_CONFIG[member.tier];
  const nextTier    = getNextTier(member.tier);
  const progress    = getProgressPercent(member.points, member.tier);
  const pointsLeft  = getPointsToNext(member.points, member.tier);
  const memberSince = new Date(member.memberSince).toLocaleDateString('en-LK', {
    month: 'short',
    year:  'numeric',
  });

  return (
    <div className="space-y-3">
      {/* ── Card ── */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 md:p-8 shadow-2xl select-none"
        style={{
          background: `linear-gradient(135deg, ${tier.cardFrom} 0%, ${tier.cardVia} 50%, ${tier.cardTo} 100%)`,
          minHeight: '200px',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -left-8  -bottom-8  w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-4 w-20 h-20 rounded-full bg-white/8" />

        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase">
                Ceylon Curry Pot
              </p>
              <p className="text-white text-sm font-semibold mt-0.5 tracking-wide">
                Loyalty Card
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-white text-xs font-bold tracking-wide">
                {tier.icon} {tier.label}
              </span>
            </div>
          </div>

          {/* Points */}
          <div className="mb-5">
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Total Points</p>
            <p className="text-white font-bold text-5xl md:text-6xl mt-1 leading-none tabular-nums">
              {member.points.toLocaleString()}
            </p>
            <p className="text-white/50 text-xs mt-1">points</p>
          </div>

          {/* Member info */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Member</p>
              <p className="text-white font-bold text-base tracking-wider mt-0.5">
                {member.name.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Since</p>
              <p className="text-white/90 text-sm font-medium mt-0.5">{memberSince}</p>
            </div>
          </div>

          {/* Card number */}
          <div className="mt-4 pt-3 border-t border-white/20">
            <p className="font-mono text-white/60 text-xs tracking-[0.3em]">
              {member.memberNumber}
            </p>
          </div>
        </div>
      </div>

      {/* ── Progress to next tier ── */}
      {showProgress && nextTier && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">{tier.icon} {member.tier}</span>
            <span className="text-gray-400 text-xs">
              {pointsLeft.toLocaleString()} pts to {TIER_CONFIG[nextTier].icon} {nextTier}
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${tier.cardVia}, ${tier.cardTo})`,
              }}
            />
          </div>
          <p className="text-xs text-gray-400 text-center">
            Earn 1 point for every Rs. 10 spent
          </p>
        </div>
      )}

      {showProgress && !nextTier && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold text-red-700">
            👑 You&apos;ve reached our highest tier!
          </p>
          <p className="text-xs text-red-500 mt-0.5">All benefits are unlocked for you</p>
        </div>
      )}
    </div>
  );
}