'use client';

import {
  Crown, Gift, Zap, CheckCircle2, ChevronRight,
  Star, X as XIcon, ArrowRight,
} from 'lucide-react';
import {
  useLoyaltyStore, TIER_CONFIG, TIER_ORDER,
  getProgressPercent, getPointsToNext, getNextTier,
} from '@/components/loyalty/useLoyaltyStore';
import LoyaltyMemberCard from '@/components/loyalty/LoyaltyMemberCard';

// ── Data ──────────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { step: '01', icon: Crown, title: 'Create Your Account', desc: 'Sign up in under a minute. We need your name, email, phone and birthday for your rewards.' },
  { step: '02', icon: Zap,   title: 'Order & Earn Points', desc: 'Earn 1 point for every Rs. 50 you spend, and triple points all through your birthday month.' },
  { step: '03', icon: Gift,  title: 'Unlock Rewards',      desc: 'Reach higher tiers to unlock bigger discounts, free delivery and exclusive Sunday specials.' },
];

const EARN_GUIDE = [
  { emoji: '🛒', label: 'Standard purchase',  value: '1 pt / Rs. 50', highlight: false },
  { emoji: '🎂', label: 'Birthday month',      value: '3× points',      highlight: true  },
];

// Benefits comparison table rows
const BENEFITS_TABLE = [
  { label: 'Birthday bonus points',            keys: ['birthdayBonus']    as const },
  { label: '5% off on Rs. 5,000+ orders',      keys: ['discountOn5k']     as const },
  { label: '10% off on Rs. 5,000+ orders',     keys: ['higherDiscount']   as const },
  { label: 'Free delivery once a week',         keys: ['freeDelivery']     as const },
  { label: 'Sunday meals 20% off',             keys: ['sundayOff']        as const },
  { label: 'Priority order queue',             keys: ['priorityQueue']    as const },
  { label: 'WhatsApp concierge support',       keys: ['whatsappSupport']  as const },
];

type TablePerkKey = keyof typeof TIER_CONFIG.Clove.tablePerks;

export default function LoyaltyPage() {
  const { member, openModal } = useLoyaltyStore();

  const currentTierIndex = member ? TIER_ORDER.indexOf(member.tier) : -1;
  const nextTier         = member ? getNextTier(member.tier) : null;
  const progress         = member ? getProgressPercent(member.points, member.tier) : 0;
  const pointsLeft       = member ? getPointsToNext(member.points, member.tier) : 0;

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 text-center text-white">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-10 h-0.5 bg-white/70" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">Loyalty Programme</span>
              <span className="w-10 h-0.5 bg-white/70" />
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
              Ceylon Rewards
            </h1>
            <p className="text-white/90 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-8">
              Every meal earns you points towards exclusive discounts, free delivery,
              and Sunday specials reserved for our most valued members.
            </p>

            {!member ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openModal('signup')}
                  className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-full font-bold hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  Join for Free — Get 100 pts
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal('signin')}
                  className="inline-flex items-center justify-center gap-2 bg-white/15 text-white border border-white/30 px-8 py-3.5 rounded-full font-semibold hover:bg-white/25 transition-all"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-3 rounded-full border border-white/30">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">
                  Welcome back, {member.name.split(' ')[0]}! — {member.points.toLocaleString()} points
                </span>
              </div>
            )}

            {/* Stats strip */}
            <div className="flex justify-center mt-10 gap-0">
              {[
                { value: '1,200+', label: 'Members'      },
                { value: '450K+',  label: 'Points Earned' },
                { value: '4 Tiers', label: 'of Rewards'  },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`px-6 md:px-10 py-3 text-center ${i < 2 ? 'border-r border-white/20' : ''}`}
                >
                  <p className="font-heading text-xl font-bold text-white">{value}</p>
                  <p className="text-white/60 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-12 bg-gray-50 rounded-t-[40px]" />
        </div>
      </section>

      {/* ── MEMBER DASHBOARD (logged in) ── */}
      {member && (
        <section className="py-12 -mt-2">
          <div className="max-w-2xl mx-auto px-4 space-y-5">
            <h2 className="font-heading text-2xl font-bold text-gray-900 text-center">
              Your Membership
            </h2>

            <LoyaltyMemberCard member={member} showProgress />

            {/* Progress detail */}
            {nextTier && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span className="font-semibold text-gray-700">
                    {TIER_CONFIG[member.tier].icon} {member.tier}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {TIER_CONFIG[nextTier].icon} {nextTier}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${TIER_CONFIG[member.tier].cardVia}, ${TIER_CONFIG[member.tier].cardTo})`,
                    }}
                  />
                </div>
                <p className="text-center text-xs text-gray-400">
                  {pointsLeft.toLocaleString()} more points to reach {TIER_CONFIG[nextTier].icon} {nextTier}
                </p>
              </div>
            )}

            {/* Active perks */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Your Active Perks
              </p>
              <div className="grid grid-cols-1 gap-2">
                {TIER_CONFIG[member.tier].perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TIER JOURNEY ── */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
              Your Journey
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Four Tiers of Rewards
            </h2>
            <p className="text-gray-400 text-sm mt-2">Named after Sri Lanka&apos;s finest spices</p>
          </div>

          {/* Horizontal journey tracker */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gray-200 hidden sm:block" />
            {/* Filled portion if logged in */}
            {member && (
              <div
                className="absolute top-[28px] left-[10%] h-0.5 bg-red-500 hidden sm:block transition-all duration-700"
                style={{ width: `${(currentTierIndex / (TIER_ORDER.length - 1)) * 80}%` }}
              />
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2">
              {TIER_ORDER.map((tierKey, i) => {
                const t         = TIER_CONFIG[tierKey];
                const isPast    = member ? i < currentTierIndex   : false;
                const isCurrent = member ? i === currentTierIndex : false;
                const isFuture  = member ? i > currentTierIndex   : true;

                return (
                  <div key={tierKey} className="flex flex-col items-center text-center relative z-10">
                    {/* Circle */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-xl border-4 transition-all duration-500 shadow-sm
                        ${isCurrent ? 'scale-110 shadow-lg' : ''}
                        ${isFuture && member ? 'opacity-50 border-gray-200 bg-white' : 'border-white'}
                      `}
                      style={!isFuture || !member
                        ? { background: `linear-gradient(135deg, ${t.cardVia}, ${t.cardTo})` }
                        : undefined
                      }
                    >
                      <span>{t.icon}</span>
                    </div>
                    <p className={`mt-2 font-heading font-bold text-sm ${isFuture && member ? 'text-gray-400' : 'text-gray-900'}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.pointsMax === Infinity
                        ? `${t.pointsMin.toLocaleString()}+ pts`
                        : `${t.pointsMin.toLocaleString()}–${t.pointsMax.toLocaleString()} pts`}
                    </p>
                    {isCurrent && (
                      <span className="mt-1.5 text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        YOUR TIER
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIER CARDS ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {TIER_ORDER.map((tierKey, i) => {
              const t         = TIER_CONFIG[tierKey];
              const isCurrent = member?.tier === tierKey;
              const isTop     = i === TIER_ORDER.length - 1;

              return (
                <div
                  key={tierKey}
                  className={`relative rounded-3xl overflow-hidden border-2 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl
                    ${isCurrent ? 'border-red-400 shadow-md' : 'border-gray-100'}
                    ${isTop ? 'xl:scale-[1.03]' : ''}
                  `}
                >
                  {isTop && (
                    <div className="absolute top-3 right-3 z-10 bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/40">
                      ELITE
                    </div>
                  )}

                  {/* Gradient header */}
                  <div
                    className="p-5 text-white"
                    style={{ background: `linear-gradient(135deg, ${t.cardFrom}, ${t.cardTo})` }}
                  >
                    <div className="text-2xl mb-1.5">{t.icon}</div>
                    <h3 className="font-heading text-xl font-bold">{t.label}</h3>
                    <p className="text-white/75 text-xs mt-0.5">
                      {t.pointsMax === Infinity
                        ? `${t.pointsMin.toLocaleString()}+ points`
                        : `${t.pointsMin.toLocaleString()} – ${t.pointsMax.toLocaleString()} pts`}
                    </p>
                    <div className="mt-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block">
                      <span className="text-white font-bold text-xs">{t.discountLabel}</span>
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="p-5">
                    {isCurrent && (
                      <div className="mb-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span className="text-xs font-semibold text-red-700">Your Current Tier</span>
                      </div>
                    )}
                    <ul className="space-y-2">
                      {t.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS COMPARISON TABLE ── */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
              Compare Tiers
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Benefits at a Glance
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100 min-w-[180px]">
                    Benefit
                  </th>
                  {TIER_ORDER.map((tierKey) => {
                    const t = TIER_CONFIG[tierKey];
                    const isCurrent = member?.tier === tierKey;
                    return (
                      <th
                        key={tierKey}
                        className={`px-4 py-4 text-center text-xs font-bold uppercase tracking-wider border-b border-gray-100 ${
                          isCurrent ? 'bg-red-50' : 'bg-gray-50'
                        }`}
                        style={{ color: t.cardVia }}
                      >
                        {t.icon} {t.label}
                        {isCurrent && (
                          <span className="block text-[9px] font-bold text-red-500 normal-case tracking-normal mt-0.5">
                            (you)
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {BENEFITS_TABLE.map(({ label, keys }, rowIdx) => {
                  const perkKey = keys[0] as TablePerkKey;
                  return (
                    <tr key={label} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-5 py-3.5 text-gray-700 font-medium">{label}</td>
                      {TIER_ORDER.map((tierKey) => {
                        const has       = TIER_CONFIG[tierKey].tablePerks[perkKey];
                        const isCurrent = member?.tier === tierKey;
                        return (
                          <td
                            key={tierKey}
                            className={`px-4 py-3.5 text-center ${isCurrent ? 'bg-red-50/50' : ''}`}
                          >
                            {has
                              ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                              : <XIcon className="w-4 h-4 text-gray-200 mx-auto" />
                            }
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
              How It Works
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Simple. Rewarding. Delicious.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="absolute top-4 right-5 text-6xl font-bold text-gray-100 font-heading group-hover:text-red-50 transition-colors select-none">
                  {step}
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POINTS EARNING GUIDE ── */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
              Earning Points
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">How You Earn</h2>
            <p className="text-gray-400 text-sm mt-2">Points are awarded after successful order delivery</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {EARN_GUIDE.map(({ emoji, label, value, highlight }) => (
              <div
                key={label}
                className={`rounded-2xl p-6 text-center border transition-all
                  ${highlight
                    ? 'bg-red-600 border-red-600 text-white shadow-lg'
                    : 'bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-200 hover:shadow-sm'
                  }`}
              >
                <div className="text-2xl mb-3">{emoji}</div>
                <p className={`text-2xl font-bold font-heading ${highlight ? 'text-white' : 'text-red-600'}`}>
                  {value}
                </p>
                <p className={`text-sm mt-1 ${highlight ? 'text-white/80' : 'text-gray-500'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Example calculation */}
          {/* Example calculation */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
              Example
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-2.5 text-center">
                <p className="text-gray-400 text-xs">Order value</p>
                <p className="font-bold text-gray-900">Rs. 2,500</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-2.5 text-center">
                <p className="text-gray-400 text-xs">Any day</p>
                <p className="font-bold text-red-600">50 pts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-2.5 text-center">
                <p className="text-gray-400 text-xs">Birthday month</p>
                <p className="font-bold text-red-600">150 pts 🔥</p>
              </div>
            </div>
            <div className="mt-5 grid sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="font-bold text-gray-700">Clove → Cinnamon</p>
                <p className="text-gray-400 mt-0.5">~8 orders</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="font-bold text-gray-700">Cinnamon → Saffron</p>
                <p className="text-gray-400 mt-0.5">~25 more orders</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="font-bold text-gray-700">Saffron → Cardamom</p>
                <p className="text-gray-400 mt-0.5">~50 more orders</p>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Birthday-month orders earn 3× — the fastest way to climb tiers.
              Cardamom is reserved for our most dedicated members.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA (if not logged in) ── */}
      {!member && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative">
                <Crown className="w-10 h-10 mx-auto mb-4 opacity-90" />
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
                  Ready to Start Earning?
                </h2>
                <p className="text-white/85 mb-8 max-w-md mx-auto text-sm">
                  Sign up in 60 seconds and earn 100 welcome points immediately.
                  Your first birthday reward is waiting.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => openModal('signup')}
                    className="bg-white text-red-600 px-8 py-3.5 rounded-full font-bold hover:bg-red-50 transition-all shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Join Free — Get 100 Welcome Points
                  </button>
                  <button
                    onClick={() => openModal('signin')}
                    className="bg-white/15 text-white border border-white/30 px-8 py-3.5 rounded-full font-semibold hover:bg-white/25 transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}