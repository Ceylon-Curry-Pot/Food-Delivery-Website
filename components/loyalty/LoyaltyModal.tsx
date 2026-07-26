'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Eye, EyeOff, Mail, Lock, User, Phone,
  Crown, CheckCircle2, ArrowRight, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useLoyaltyStore } from './useLoyaltyStore';
import LoyaltyMemberCard from './LoyaltyMemberCard';
import { loyaltySignIn, loyaltySignUp } from '@/lib/loyaltyApi';
import type { LoyaltyMember } from './useLoyaltyStore';

export default function LoyaltyModal() {
  const { isModalOpen, modalTab, closeModal, setMember } = useLoyaltyStore();

  const [activeTab,       setActiveTab]       = useState<'signin' | 'signup'>(modalTab);
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [newMember,       setNewMember]       = useState<LoyaltyMember | null>(null);
  const [forgotNote,      setForgotNote]      = useState(false);

  // Sign-in form
  const [siEmail,    setSiEmail]    = useState('');
  const [siPassword, setSiPassword] = useState('');

  // Sign-up form
  const [suName,     setSuName]     = useState('');
  const [suEmail,    setSuEmail]    = useState('');
  const [suPhone,    setSuPhone]    = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm,  setSuConfirm]  = useState('');
  const [suTerms,    setSuTerms]    = useState(false);

  const resetState = () => {
    setError('');
    setForgotNote(false);
    setNewMember(null);
    setLoading(false);
    setSiEmail(''); setSiPassword('');
    setSuName(''); setSuEmail(''); setSuPhone('');
    setSuPassword(''); setSuConfirm(''); setSuTerms(false);
    setShowPassword(false); setShowConfirm(false);
  };

  const handleClose = () => {
    closeModal();
    setTimeout(resetState, 300);
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
      const member = await loyaltySignIn({ email: siEmail, password: siPassword });
      setMember(member);
      setNewMember(member);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suName || !suEmail || !suPhone || !suPassword || !suConfirm) {
      setError('Please fill in all fields.'); return;
    }
    if (suPassword !== suConfirm) {
      setError('Passwords do not match.'); return;
    }
    if (suPassword.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }
    if (!suTerms) {
      setError('Please accept the Terms & Conditions.'); return;
    }
    setLoading(true); setError('');
    try {
      const member = await loyaltySignUp({ name: suName, email: suEmail, phone: suPhone, password: suPassword });
      setMember(member);
      setNewMember(member);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 ' +
    'outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all bg-gray-50';

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 12  }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Header gradient ── */}
              <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-6 pt-8 pb-10">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    Ceylon Rewards
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    Earn points. Unlock exclusive benefits.
                  </p>
                </div>
              </div>

              {/* Pull-up card effect */}
              <div className="relative -mt-5 bg-white rounded-t-3xl px-6 pb-6">
                <AnimatePresence mode="wait">
                  {/* ── SUCCESS STATE ── */}
                  {newMember ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{   opacity: 0, y: -16 }}
                      className="pt-6 space-y-5"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-gray-900">
                          {activeTab === 'signup' ? 'Welcome to Ceylon Rewards!' : 'Welcome Back!'}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {activeTab === 'signup'
                            ? `You earned 100 welcome points 🎉`
                            : `Good to see you, ${newMember.name.split(' ')[0]}!`}
                        </p>
                      </div>
                      <LoyaltyMemberCard member={newMember} showProgress />
                      <button
                        onClick={handleClose}
                        className="w-full bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm hover:bg-red-700 transition-all"
                      >
                        Start Ordering →
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{   opacity: 0, y: -16 }}
                    >
                      {/* Tabs */}
                      <div className="flex bg-gray-100 rounded-2xl p-1 mt-5 mb-6">
                        <button
                          onClick={() => switchTab('signin')}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === 'signin'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => switchTab('signup')}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === 'signup'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Join Now
                        </button>
                      </div>

                      {/* Error */}
                      {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      {/* ── SIGN IN FORM ── */}
                      <AnimatePresence mode="wait">
                        {activeTab === 'signin' ? (
                          <motion.form
                            key="signin"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0   }}
                            exit={{   opacity: 0, x:  12  }}
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
                                className={inputClass}
                              />
                            </div>

                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={siPassword}
                                onChange={(e) => setSiPassword(e.target.value)}
                                className={inputClass + ' pr-11'}
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
                                <p className="mt-1 text-xs text-gray-500 text-left bg-gray-50 rounded-lg p-2">
                                  Contact us at{' '}
                                  <a href="mailto:ceyloncurrypot.lk@gmail.com" className="text-red-600 hover:underline">
                                    ceyloncurrypot.lk@gmail.com
                                  </a>{' '}
                                  or call{' '}
                                  <a href="tel:0778282112" className="text-red-600 hover:underline">
                                    077 828 2112
                                  </a>
                                  {' '}to reset your password.
                                </p>
                              )}
                            </div>

                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60"
                            >
                              {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                                : <>Sign In <ArrowRight className="w-4 h-4" /></>
                              }
                            </button>

                            <p className="text-center text-xs text-gray-400">
                              Not a member?{' '}
                              <button
                                type="button"
                                onClick={() => switchTab('signup')}
                                className="text-red-600 font-semibold hover:underline"
                              >
                                Join Now — it&apos;s free
                              </button>
                            </p>
                          </motion.form>
                        ) : (
                          /* ── SIGN UP FORM ── */
                          <motion.form
                            key="signup"
                            initial={{ opacity: 0, x: 12  }}
                            animate={{ opacity: 1, x: 0   }}
                            exit={{   opacity: 0, x: -12  }}
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
                                className={inputClass}
                              />
                            </div>

                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                placeholder="Email address"
                                value={suEmail}
                                onChange={(e) => setSuEmail(e.target.value)}
                                className={inputClass}
                              />
                            </div>

                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="tel"
                                placeholder="Phone (e.g. 077 828 2112)"
                                value={suPhone}
                                onChange={(e) => setSuPhone(e.target.value)}
                                className={inputClass}
                              />
                            </div>

                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password (min. 8 characters)"
                                value={suPassword}
                                onChange={(e) => setSuPassword(e.target.value)}
                                className={inputClass + ' pr-11'}
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
                                className={inputClass + ' pr-11'}
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
                                : <>Join Ceylon Rewards <ArrowRight className="w-4 h-4" /></>
                              }
                            </button>

                            <p className="text-center text-xs text-gray-400">
                              Already a member?{' '}
                              <button
                                type="button"
                                onClick={() => switchTab('signin')}
                                className="text-red-600 font-semibold hover:underline"
                              >
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}