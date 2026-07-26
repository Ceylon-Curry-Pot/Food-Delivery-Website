'use client';

import { Crown, Gift, Star, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLoyaltyStore, TIER_CONFIG } from '@/components/loyalty/useLoyaltyStore';
import LoyaltyMemberCard from '@/components/loyalty/LoyaltyMemberCard';
import Link from 'next/link';

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Crown,
    title: 'Create Your Account',
    desc: 'Sign up for free in under a minute. All you need is your name, email and phone number.',
  },
  {
    step: '02',
    icon: Zap,
    title: 'Order & Earn Points',
    desc: 'Earn 1 point for every Rs. 10 you spend. Double points on weekends. Triple on your birthday.',
  },
  {
    step: '03',
    icon: Gift,
    title: 'Unlock Rewards',
    desc: 'Reach higher tiers to unlock bigger discounts, free delivery and exclusive member perks.',
  },
];

const EARN_GUIDE = [
  { label: 'Standard purchase',   value: '1 pt per Rs. 10', highlight: false },
  { label: 'Weekend orders',      value: '2× points',        highlight: true  },
  { label: 'Birthday month',      value: '3× points',        highlight: true  },
];

const TIERS = (['Clove', 'Cinnamon', 'Saffron', 'Cardamom'] as const);

export default function LoyaltyPage() {
  const { member, openModal } = useLoyaltyStore();

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 text-center text-white">
            <div className="inline-flex items-center gap-3 mb-6">
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
              Every meal you enjoy earns you points toward exclusive discounts, free delivery, and experiences reserved only for our most valued members.
            </p>
            {!member ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openModal('signup')}
                  className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-full font-bold hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  Join for Free
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
                  Welcome back, {member.name.split(' ')[0]}! You have {member.points.toLocaleString()} points.
                </span>
              </div>
            )}
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-12 bg-gray-50 rounded-t-[40px]" />
        </div>
      </section>

      {/* ── Member Dashboard (only if logged in) ── */}
      {member && (
        <section className="py-12 -mt-4">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Membership
            </h2>
            <LoyaltyMemberCard member={member} showProgress />

            <div className="mt-6 grid grid-cols-3 gap-4">
              {TIER_CONFIG[member.tier].perks.slice(0, 4).map((perk) => (
                <div key={perk} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-700 leading-snug">{perk}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
              How It Works
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900">
              Simple. Rewarding. Delicious.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-6 right-6 text-5xl font-bold text-gray-100 font-heading group-hover:text-red-100 transition-colors">
                  {step}
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tiers ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
              Membership Tiers
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              The Higher You Go, The Sweeter It Gets
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Named after Sri Lanka&apos;s most prized spices — each tier unlocks a richer world of benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {TIERS.map((tierKey, i) => {
              const t         = TIER_CONFIG[tierKey];
              const isCurrent = member?.tier === tierKey;
              return (
                <div
                  key={tierKey}
                  className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                    ${isCurrent ? 'border-red-400 shadow-lg' : 'border-gray-100 shadow-sm bg-white'}
                    ${i === 3 ? 'md:scale-[1.02]' : ''}
                  `}
                >
                  {/* Card header */}
                  <div
                    className="p-6 text-white"
                    style={{ background: `linear-gradient(135deg, ${t.cardFrom}, ${t.cardTo})` }}
                  >
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <h3 className="font-heading text-2xl font-bold">{t.label}</h3>
                    <p className="text-white/80 text-sm mt-1">
                      {t.pointsMax === Infinity
                        ? `${t.pointsMin.toLocaleString()}+ points`
                        : `${t.pointsMin.toLocaleString()} – ${t.pointsMax.toLocaleString()} points`}
                    </p>
                    <div className="mt-4 inline-block bg-white/25 px-3 py-1 rounded-full">
                      <span className="text-white font-bold text-sm">{t.discount}% off every order</span>
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="p-6 bg-white">
                    {isCurrent && (
                      <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs font-semibold text-red-700">Your Current Tier</span>
                      </div>
                    )}
                    <ul className="space-y-2.5">
                      {t.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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

      {/* ── Earning Guide ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
              Earning Points
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              How You Earn
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {EARN_GUIDE.map(({ label, value, highlight }) => (
              <div
                key={label}
                className={`rounded-2xl p-6 text-center border transition-all
                  ${highlight
                    ? 'bg-red-600 border-red-600 text-white shadow-lg'
                    : 'bg-gray-50 border-gray-100 text-gray-900'
                  }`}
              >
                <Star className={`w-6 h-6 mx-auto mb-3 ${highlight ? 'text-white/80' : 'text-red-400'}`} />
                <p className={`text-2xl font-bold font-heading ${highlight ? 'text-white' : 'text-red-600'}`}>
                  {value}
                </p>
                <p className={`text-sm mt-1 ${highlight ? 'text-white/80' : 'text-gray-500'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            1 point = Rs. 10 spent. Points are awarded after order delivery.
          </p>
        </div>
      </section>

      {/* ── CTA (only if not logged in) ── */}
      {!member && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-10 md:p-14 text-white shadow-2xl">
              <Crown className="w-10 h-10 mx-auto mb-4 opacity-90" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
                Ready to Start Earning?
              </h2>
              <p className="text-white/85 mb-8 max-w-md mx-auto">
                Join thousands of members already enjoying exclusive discounts with every meal.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openModal('signup')}
                  className="bg-white text-red-600 px-8 py-3.5 rounded-full font-bold hover:bg-red-50 transition-all shadow-lg hover:-translate-y-0.5"
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
        </section>
      )}

    </main>
  );
}