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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-md shadow-md border-b border-gray-100/30'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[70px]">
            {/* ── Logo ── */}
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md border border-red-100 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                <Image
                  src="/CCP-logo.png"
                  alt="Ceylon Curry Pot Logo"
                  fill
                  className="object-cover"
                  priority
                />
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
            <div className="hidden md:flex items-center gap-6">
              {links.map((link: NavLink) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative py-2 px-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-4">
              <CartButton onClick={() => setCartOpen(true)} />

              <Link
                href="/menu"
                className="hidden md:inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-red-600/10 cursor-pointer"
              >
                Order Online
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 top-[70px] bg-black/40 backdrop-blur-sm z-40 md:hidden"
              />

              {/* Sliding panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-[70px] right-0 bottom-0 w-72 bg-white/95 backdrop-blur-md border-l border-gray-100 z-50 md:hidden shadow-2xl p-6 flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                    Navigation
                  </p>
                  {links.map((link: NavLink) => {
                    const isActive =
                      pathname === link.href ||
                      pathname.startsWith(link.href + '/');
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-red-600/10 text-red-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
                  <Link
                    href="/menu"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-red-600/10 active:scale-95 transition-all text-sm cursor-pointer"
                  >
                    Order Online
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}