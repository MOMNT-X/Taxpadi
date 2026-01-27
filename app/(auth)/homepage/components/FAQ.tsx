"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

const FAQ: React.FC = () => {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is Taxgpt secure?",
      answer: "Yes. We never sell or share your tax information with third parties. Your calculations and personal data remain completely private and are only accessible to you. We use industry-standard encryption and security measures to protect your information at all times."
    },
    {
      question: "Do I need accounting knowledge to use Taxgpt?",
      answer: "No accounting knowledge required. Taxgpt is designed to be user-friendly and accessible to everyone, regardless of their financial background. Our AI-powered assistant guides you through the process with simple, clear explanations in plain language."
    },
    {
      question: "Can I use Taxgpt for my business?",
      answer: "Yes, Taxgpt supports both personal and business tax calculations. Whether you're a freelancer, small business owner, or managing a larger enterprise, our platform can handle various business tax scenarios including Company Income Tax, VAT, and Withholding Tax calculations."
    },
    {
      question: "Can Taxgpt file my taxes for me?",
      answer: "Taxgpt provides accurate calculations and guidance to help you understand your tax obligations, but does not file taxes on your behalf. However, we can connect you with certified tax professionals who can assist with filing if needed."
    },
    {
      question: "Is there a limit to how many calculations I can do?",
      answer: "No limits on calculations. You can perform as many tax calculations as you need, whenever you need them. Our platform is designed to support your ongoing tax planning and management needs throughout the year."
    },
    {
      question: "Can I get tax advice for past years?",
      answer: "Yes, Taxgpt can help with tax calculations for previous tax years. This is particularly useful for tax planning, understanding historical obligations, or preparing amended returns. Our system maintains historical tax law data to ensure accurate calculations."
    },
    {
      question: "Can I use Taxgpt on my phone?",
      answer: "Yes, Taxgpt is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers. You can access your tax information and perform calculations anywhere, anytime."
    }
  ];

  return (
    <section id="faq" className="bg-gray-50 dark:bg-neutral-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr,2fr] gap-16 lg:gap-24">
          {/* Left Side - Title and CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-white mb-8 leading-tight">
              Questions all resolved in one place
            </h2>
            <button 
              onClick={() => router.push('/signup')}
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[15px] font-medium transition-colors"
            >
              Create an account
            </button>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5 first:pt-0">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-normal text-gray-900 dark:text-white pr-8 text-[15px]">{faq.question}</span>
                  {expandedFaq === index ? (
                    <X className="w-5 h-5 text-gray-900 dark:text-white flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-900 dark:text-white flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="mt-3">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[14px]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;


