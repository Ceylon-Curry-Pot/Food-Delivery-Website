'use client';

import { Crown, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLoyaltyStore, TIER_CONFIG } from './useLoyaltyStore';

export default function LoyaltyNavButton() {
  const { member, openModal, logout } = useLoyaltyStore();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // ── Not logged in ──
  if (!member) {
    return (
      <button
        onClick={() => openModal('signup')}
        className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-red-200 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
      >
        <Crown className="w-3.5 h-3.5" />
        Rewards
      </button>
    );
  }

  // ── Logged in ──
  const tier = TIER_CONFIG[member.tier];

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setDropOpen(!dropOpen)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group"
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${tier.cardVia}, ${tier.cardTo})` }}
        >
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-gray-800 leading-none">
            {member.name.split(' ')[0]}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {member.points.toLocaleString()} pts
          </p>
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {dropOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* Tier badge */}
          <div
            className="px-4 py-3 text-white"
            style={{ background: `linear-gradient(135deg, ${tier.cardFrom}, ${tier.cardTo})` }}
          >
            <p className="text-xs text-white/70">Current Tier</p>
            <p className="font-bold text-sm mt-0.5">{tier.icon} {member.tier} Member</p>
          </div>

          <div className="p-2">
            <div className="px-3 py-2 rounded-xl bg-gray-50 mb-2">
              <p className="text-xs text-gray-400">Total Points</p>
              <p className="font-bold text-gray-900 text-lg">{member.points.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{member.memberNumber}</p>
            </div>

            <button
              onClick={() => { openModal('signin'); setDropOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Loyalty Dashboard
            </button>

            <button
              onClick={() => { logout(); setDropOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}