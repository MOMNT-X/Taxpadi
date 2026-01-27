"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const SimpleExperience: React.FC = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center font-medium mb-16">
        <h2 className="text-4xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
          A simple experience for a<br /><span className="text-4xl md:text-4xl font-medium">confusing tax system.</span>
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Taxgpt helps you understand, calculate, and manage your taxes easily 
          <br />without stress or guesswork.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Upload Document Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 rounded-[32px] p-8 lg:p-12 flex flex-col shadow-lg hover:shadow-2xl transition-shadow"
        >
          <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-sm flex-1 flex flex-col justify-between">
            {/* Invoice Preview */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-medium text-blue-400 mb-1">R.ESTATE™</p>
                  <p className="text-[10px] text-gray-500">7951 Ave</p>
                  <p className="text-[10px] text-gray-500">Magnolia Ln 92021</p>
                </div>
                <div className="text-right text-[10px] text-gray-600 space-y-0.5">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Invoice date</span>
                    <span className="font-medium">05/03/23</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Invoice #</span>
                    <span className="font-medium">C1-14843</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Due date</span>
                    <span className="font-medium">05/31/23</span>
                  </div>
                </div>
              </div>
              
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-2 text-[10px] text-gray-500 mb-2 pb-2 border-b border-gray-200">
                <div>Qty</div>
                <div>Description</div>
                <div className="text-right">Unit price</div>
                <div className="text-right">Amount</div>
              </div>
              
              {/* Invoice Total */}
              <div className="border-t border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium text-gray-700">Invoice total</p>
                  <p className="text-2xl font-bold text-gray-900">#90,000,000</p>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl mb-6">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 text-base">rent–invoice.pdf</span>
            </div>

            {/* Amount and Button */}
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <span className="text-2xl font-bold text-gray-900">#30M</span>
              </div>
              <button className="px-6 py-4 bg-pink-500 text-white rounded-2xl font-medium flex items-center gap-2 hover:shadow-lg transition-shadow text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Bank transfer
              </button>
            </div>
          </div>

          <p className="text-base text-gray-900 leading-relaxed text-center">
            Upload your tax document and let taxgpt<br />calculate your taxes instantly.
          </p>
        </motion.div>

        {/* Ask Taxgpt Card - iPhone Mockup */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[32px] p-8 lg:p-12 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-shadow"
        >
          {/* iPhone Image - Centered */}
          <div className="w-full max-w-sm mb-8 flex justify-center">
            <Image 
              src="/assets/iPhone 16 Pro Light.svg"
              alt="iPhone mockup showing Taxgpt chat interface"
              width={300}
              height={600}
              className="w-auto h-auto max-w-full"
            />
          </div>

          <p className="text-base text-gray-900 leading-relaxed text-center">
            Ask taxgpt anything from PAYE calculations<br />to tax deductions, get instant answers
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SimpleExperience;
