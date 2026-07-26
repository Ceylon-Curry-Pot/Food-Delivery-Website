'use client';

import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { links, NavLink } from '@/utils/links';
import CartButton from './CartButton';
import CartModal from '../cart/CartModal';
import LoyaltyNavButton from '../loyalty/LoyaltyNavButton';
import { useLoyaltyStore } from '../loyalty/useLoyaltyStore';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const pathname   = usePathname();
  const openModal  = useLoyaltyStore((s) => s.openModal);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[70px]">

            {/* ── Logo ── */}
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md border border-red-100 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                <Image src="/CCP-logo.png" alt="Ceylon Curry Pot Logo" fill className="object-cover" priority />
              </div>
              <div className="hidden sm:block">
                <p className="font-heading text-lg font-bold text-red-600 leading-none">
                  Ceylon Curry Pot
                </p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-0.5">
                  Authentic Sri Lankan Cuisine
                </p>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1.5">
              {links.map((link: NavLink) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-red-600 rounded-full shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-2">
              <LoyaltyNavButton />
              <CartButton onClick={() => setCartOpen(true)} />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ── Mobile menu ── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-gray-100"
              >
                <div className="py-3 flex flex-col gap-1">
                  {links.map((link: NavLink) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  {/* Mobile rewards button */}
                  <button
                    onClick={() => { openModal('signup'); setMobileOpen(false); }}
                    className="mt-1 mx-0 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 flex items-center gap-2"
                  >
                    👑 Join Ceylon Rewards
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}