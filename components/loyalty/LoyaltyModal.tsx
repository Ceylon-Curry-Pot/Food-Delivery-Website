'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Eye, EyeOff, Mail, Lock, User, Phone,
  Crown, CheckCircle2, ArrowRight, Loader2, Cake, LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useLoyaltyStore, TIER_CONFIG } from './useLoyaltyStore';
import LoyaltyMemberCard from './LoyaltyMemberCard';
import { loyaltySignIn, loyaltySignUp } from '@/lib/loyaltyApi';
import type { LoyaltyMember } from './useLoyaltyStore';

export default function LoyaltyModal() {
  const {
    isModalOpen, modalTab, closeModal,
    setMember, member, logout,
  } = useLoyaltyStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(modalTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMember, setNewMember] = useState<LoyaltyMember | null>(null);
  const [forgotNote, setForgotNote] = useState(false);

  // ── Key fix: use already-logged-in member as fallback ──
  // newMember = just signed in this session (show "Welcome!" message)
  // member    = already logged in from a previous session
  const displayMember = newMember ?? member;
  const isNewLogin = !!newMember;

  // Sign-in fields
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');

  // Sign-up fields
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suBirthday, setSuBirthday] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [suTerms, setSuTerms] = useState(false);

  const resetFormState = () => {
    setError(''); setForgotNote(false); setNewMember(null); setLoading(false);
    setSiEmail(''); setSiPassword('');
    setSuName(''); setSuEmail(''); setSuPhone(''); setSuBirthday('');
    setSuPassword(''); setSuConfirm(''); setSuTerms(false);
    setShowPassword(false); setShowConfirm(false);
  };

  const handleClose = () => {
    closeModal();
    // Delay reset so the exit animation plays cleanly
    setTimeout(resetFormState, 300);
  };

  const handleSignOut = () => {
    logout();
    setNewMember(null);
    setActiveTab('signin');
    setError('');
  };

  const switchTab = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setError('');
    setForgotNote(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siEmail || !siPassword) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const m = await loyaltySignIn({ email: siEmail, password: siPassword });
      setMember(m);
      setNewMember(m);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suName || !suEmail || !suPhone || !suBirthday || !suPassword || !suConfirm) {
      setError('Please fill in all required fields.'); return;
    }
    if (suPassword !== suConfirm) { setError('Passwords do not match.'); return; }
    if (suPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!suTerms) { setError('Please accept the Terms & Conditions.'); return; }
    setLoading(true); setError('');
    try {
      const m = await loyaltySignUp({
        name: suName, email: suEmail, phone: suPhone,
        birthday: suBirthday, password: suPassword,
      });
      setMember(m);
      setNewMember(m);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 ' +
    'outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all bg-gray-50';

  useEffect(() => {
    if (!member) {
      setNewMember(null);
      setError('');
      setForgotNote(false);
      setShowPassword(false);
      setShowConfirm(false);
    }
  }, [member]);

  useEffect(() => {
    if (isModalOpen) {
      setActiveTab(modalTab);
    }
  }, [isModalOpen, modalTab]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient header */}
              <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-6 pt-7 pb-10 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <div className="w-[52px] h-[52px] bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-white">Ceylon Rewards</h2>
                  <p className="text-white/80 text-sm mt-1">
                    {displayMember
                      ? `${TIER_CONFIG[displayMember.tier].icon} ${displayMember.tier} Member`
                      : 'Earn points. Unlock exclusive benefits.'}
                  </p>
                </div>
              </div>

              {/* Pull-up white panel */}
              <div className="relative -mt-5 bg-white rounded-t-3xl flex-1 overflow-y-auto">
                <div className="px-6 pb-6">
                  <AnimatePresence mode="wait">

                    {/* ── MEMBER DASHBOARD (already logged in OR just signed in) ── */}
                    {displayMember ? (
                      <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="pt-6 space-y-5"
                      >
                        {/* Header message */}
                        {isNewLogin ? (
                          /* Fresh sign-in: show welcome */
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-gray-900">
                              {activeTab === 'signup' ? 'Welcome to Ceylon Rewards!' : 'Welcome Back!'}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {activeTab === 'signup'
                                ? 'You earned 100 welcome points 🎉 You are now a Clove member!'
                                : `Good to see you, ${displayMember.name.split(' ')[0]}!`}
                            </p>
                          </div>
                        ) : (
                          /* Returning view: show profile header */
                          <div className="flex items-center gap-4 pt-2">
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md"
                              style={{
                                background: `linear-gradient(135deg, ${TIER_CONFIG[displayMember.tier].cardVia}, ${TIER_CONFIG[displayMember.tier].cardTo})`,
                              }}
                            >
                              {displayMember.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading font-bold text-gray-900 text-lg leading-tight truncate">
                                {displayMember.name}
                              </p>
                              <p className="text-sm text-gray-400 truncate">{displayMember.email}</p>
                              <span
                                className={`inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${TIER_CONFIG[displayMember.tier].badgeBg} ${TIER_CONFIG[displayMember.tier].badgeText}`}
                              >
                                {TIER_CONFIG[displayMember.tier].icon} {displayMember.tier} Member
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Member card */}
                        <LoyaltyMemberCard member={displayMember} showProgress />

                        {/* Action buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleClose}
                            className="flex-1 bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm hover:bg-red-700 transition-all"
                          >
                            {isNewLogin ? 'Start Ordering →' : 'Close'}
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all text-sm font-medium"
                            title="Sign out"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                          </button>
                        </div>

                        {/* Active perks summary */}
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Your Active Perks
                          </p>
                          <ul className="space-y-2">
                            {TIER_CONFIG[displayMember.tier].perks.map((perk) => (
                              <li key={perk} className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                {perk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ) : (

                      /* ── AUTH FORMS (not logged in) ── */
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                      >
                        {/* Tabs */}
                        <div className="flex bg-gray-100 rounded-2xl p-1 mt-5 mb-5">
                          {(['signin', 'signup'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => switchTab(tab)}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab
                                  ? 'bg-white text-gray-900 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                              {tab === 'signin' ? 'Sign In' : 'Join Now'}
                            </button>
                          ))}
                        </div>

                        {/* Error */}
                        {error && (
                          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                            {error}
                          </div>
                        )}

                        <AnimatePresence mode="wait">

                          {/* SIGN IN */}
                          {activeTab === 'signin' ? (
                            <motion.form
                              key="signin"
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 12 }}
                              transition={{ duration: 0.18 }}
                              onSubmit={handleSignIn}
                              className="space-y-4"
                            >
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="email"
                                  placeholder="Email address"
                                  value={siEmail}
                                  onChange={(e) => setSiEmail(e.target.value)}
                                  className={inputBase}
                                />
                              </div>

                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Password"
                                  value={siPassword}
                                  onChange={(e) => setSiPassword(e.target.value)}
                                  className={inputBase + ' pr-11'}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>

                              <div className="text-right">
                                <button
                                  type="button"
                                  onClick={() => setForgotNote(!forgotNote)}
                                  className="text-xs text-red-600 hover:underline"
                                >
                                  Forgot password?
                                </button>
                                {forgotNote && (
                                  <div className="mt-2 text-xs text-gray-500 text-left bg-gray-50 border border-gray-100 rounded-xl p-3">
                                    Contact us at{' '}
                                    <a href="mailto:ceyloncurrypot.lk@gmail.com" className="text-red-600 font-medium hover:underline">
                                      ceyloncurrypot.lk@gmail.com
                                    </a>{' '}
                                    or call{' '}
                                    <a href="tel:0778282112" className="text-red-600 font-medium hover:underline">
                                      077 828 2112
                                    </a>.
                                  </div>
                                )}
                              </div>

                              <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60"
                              >
                                {loading
                                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                                  : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                              </button>

                              <p className="text-center text-xs text-gray-400 pb-2">
                                Not a member?{' '}
                                <button type="button" onClick={() => switchTab('signup')} className="text-red-600 font-semibold hover:underline">
                                  Join Now — it&apos;s free
                                </button>
                              </p>
                            </motion.form>
                          ) : (

                            /* SIGN UP */
                            <motion.form
                              key="signup"
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -12 }}
                              transition={{ duration: 0.18 }}
                              onSubmit={handleSignUp}
                              className="space-y-3.5"
                            >
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Full name"
                                  value={suName}
                                  onChange={(e) => setSuName(e.target.value)}
                                  className={inputBase}
                                />
                              </div>

                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="email"
                                  placeholder="Email address"
                                  value={suEmail}
                                  onChange={(e) => setSuEmail(e.target.value)}
                                  className={inputBase}
                                />
                              </div>

                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="tel"
                                  placeholder="Phone (e.g. 077 828 2112)"
                                  value={suPhone}
                                  onChange={(e) => setSuPhone(e.target.value)}
                                  className={inputBase}
                                />
                              </div>

                              <div className="relative">
                                <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="date"
                                  value={suBirthday}
                                  onChange={(e) => setSuBirthday(e.target.value)}
                                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 13))
                                    .toISOString().split('T')[0]}
                                  className={inputBase + ' text-gray-700'}
                                />
                              </div>
                              <p className="text-xs text-gray-400 -mt-1 pl-1">
                                🎂 We&apos;ll send you a special birthday reward!
                              </p>

                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Password (min. 8 characters)"
                                  value={suPassword}
                                  onChange={(e) => setSuPassword(e.target.value)}
                                  className={inputBase + ' pr-11'}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>

                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type={showConfirm ? 'text' : 'password'}
                                  placeholder="Confirm password"
                                  value={suConfirm}
                                  onChange={(e) => setSuConfirm(e.target.value)}
                                  className={inputBase + ' pr-11'}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirm(!showConfirm)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>

                              <label className="flex items-start gap-3 cursor-pointer group">
                                <div
                                  onClick={() => setSuTerms(!suTerms)}
                                  className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer
                                ${suTerms ? 'bg-red-600 border-red-600' : 'border-gray-300 group-hover:border-red-300'}`}
                                >
                                  {suTerms && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-xs text-gray-500 leading-relaxed">
                                  I agree to the{' '}
                                  <Link href="/terms" target="_blank" className="text-red-600 font-medium hover:underline" onClick={handleClose}>
                                    Terms &amp; Conditions
                                  </Link>{' '}
                                  and{' '}
                                  <Link href="/privacy" target="_blank" className="text-red-600 font-medium hover:underline" onClick={handleClose}>
                                    Privacy Policy
                                  </Link>
                                </span>
                              </label>

                              <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60"
                              >
                                {loading
                                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                                  : <>Join Ceylon Rewards <ArrowRight className="w-4 h-4" /></>}
                              </button>

                              <p className="text-center text-xs text-gray-400 pb-2">
                                Already a member?{' '}
                                <button type="button" onClick={() => switchTab('signin')} className="text-red-600 font-semibold hover:underline">
                                  Sign In
                                </button>
                              </p>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}