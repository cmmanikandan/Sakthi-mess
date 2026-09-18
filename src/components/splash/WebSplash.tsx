'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface WebSplashProps {
  isVisible: boolean;
}

export function WebSplash({ isVisible }: WebSplashProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center w-screen h-screen overflow-hidden select-none bg-white"
        >
          {/* Subtle warm ambient ring */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-rose-50/60 blur-3xl pointer-events-none" />

          {/* Centered Brand & Loader */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-card border border-stone-100"
            >
              <Image
                src="/logo-icon.png"
                alt="SAKTHI MESS"
                fill
                sizes="128px"
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Brand Typography: SAKTHI MESS */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
              className="mt-5 flex items-baseline tracking-tight leading-none font-black"
            >
              <span className="text-3xl sm:text-4xl text-[#1C1C1C]">
                SAKTHI
              </span>
              <span className="text-3xl sm:text-4xl text-[#E23744] ml-2">
                MESS
              </span>
            </motion.div>

            {/* Animated Loading Dots (. .. ...) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="mt-6 flex items-center justify-center gap-2 h-4"
              aria-label="Loading SAKTHI MESS"
            >
              <motion.span
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.85, 1.15, 0.85],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: 0,
                  ease: 'easeInOut',
                }}
                className="w-2.5 h-2.5 rounded-full bg-[#E23744]"
              />
              <motion.span
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.85, 1.15, 0.85],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: 0.2,
                  ease: 'easeInOut',
                }}
                className="w-2.5 h-2.5 rounded-full bg-[#E23744]"
              />
              <motion.span
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.85, 1.15, 0.85],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: 0.4,
                  ease: 'easeInOut',
                }}
                className="w-2.5 h-2.5 rounded-full bg-[#E23744]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
