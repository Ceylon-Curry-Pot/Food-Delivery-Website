'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const heroImages = [
  '/bg1.webp',
  '/bg2.webp',
  '/bg3.webp',
  '/bg4.webp',
];

export default function Hero() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  } as const;

  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((src, index) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === activeImageIndex ? 1 : 0,
              scale: index === activeImageIndex ? 1.03 : 1.08,
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <Image
              src={src}
              alt="Ceylon Curry Pot food photography"
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
            />
          </motion.div>
        ))}
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/60 to-black/85 z-10" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center text-white"
      >
        {/* Eyebrow Accent Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-red-600/10 text-red-500 border border-red-500/20 mb-6 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>Open Now • Est. 2023</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-md max-w-4xl"
        >
          The Soul of <span className="text-red-600">Ceylon</span>
          <br />
          <span>on Your Table</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Handcrafted recipes passed through generations — rich curries,
          fragrant rice and bold spice blends, delivered fresh to your door.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mb-16">
          <Link
            href="/menu"
            className="group inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-bold text-base transition-transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/20 duration-300 hover:shadow-xl"
          >
            Order Online
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-base hover:bg-white/25 transition-all"
          >
            Our Story
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {[
            { value: '4.9★', label: 'Rating' },
            { value: '2,400+', label: 'Customers' },
            { value: '35 min', label: 'Avg Delivery' },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className={`px-6 sm:px-8 py-4 text-center ${i < 2 ? 'border-r border-white/10' : ''
                }`}
            >
              <p className="font-heading text-2xl font-bold text-white">{value}</p>
              <p className="text-white/60 text-xs tracking-wide mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Decorative bottom curve */}
      <div className="absolute left-0 right-0 bottom-0 h-10 bg-white rounded-t-[40px] z-10" />
    </section>
  );
}