"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const HeroSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Content */}
      <div className="relative text-center mx-auto" style={{ maxWidth: '803px', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 mb-6"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>Nigeria's #1 Tax Management Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-900 dark:text-white mb-6"
          style={{ 
            fontSize: '48px', 
            fontWeight: 700, 
            lineHeight: '57px',
            letterSpacing: '0%'
          }}
        >
          We help Nigerians calculate{' '}
          <span className="text-emerald-600 dark:text-emerald-500">taxes</span> easily
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-8 mx-auto"
          style={{ 
            fontSize: '16px', 
            fontWeight: 500, 
            lineHeight: '24px',
            letterSpacing: '0%',
            maxWidth: '803px'
          }}
        >
          Calculate Personal Income Tax, Company Income Tax, VAT, and Withholding Tax. 
          Access expert tax guides, connect with certified professionals, and get AI-powered assistance.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/signup')}
          className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[15px] font-medium transition-colors"
        >
          Create an account
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;


