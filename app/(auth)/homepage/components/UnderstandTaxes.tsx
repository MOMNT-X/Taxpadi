"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import TaxCalculator from './TaxCalculator';

const UnderstandTaxes: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      number: "01",
      title: "Ask Your Question",
      description: "Choose from smart prompts or type your own question. Taxgpt understands Nigerian tax law and explains it clearly.",
      image: "/assets/understand-taxes.svg",
      mainDescription: "Get instant answers to your Nigerian tax questions through AI-powered chat. Ask about anything tax-related and get clear, accurate responses tailored to Nigerian tax law. Sign up free for beautifully simple tax clarity."
    },
    {
      id: 2,
      number: "02",
      title: "Upload Documents",
      description: "Upload your tax documents and let our AI analyze them. We'll extract key information and calculate your tax obligations accurately.",
      image: "/assets/upload-document.svg",
      mainDescription: "Simply upload your invoices, receipts, or financial documents. Our AI will process them instantly and provide accurate tax calculations based on Nigerian tax law."
    },
    {
      id: 3,
      number: "03",
      title: "Get Full Breakdowns",
      description: "Get complete breakdowns of your tax calculations with detailed explanations. Understand exactly where your money goes and why.",
      image: "/assets/get-full-breakdowns.svg",
      mainDescription: "Receive comprehensive tax breakdowns with line-by-line explanations. See exactly how your tax is calculated and get insights to optimize your tax strategy."
    }
  ];

  const currentStep = steps.find(step => step.id === activeStep) || steps[0];

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Side - Title, Steps, and Calculator */}
        <div>
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 dark:text-white mb-12 leading-tight">
            Understand your taxes in<br />seconds.
          </h2>

          <div className="space-y-6">
            {steps.map((step) => (
              <div 
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex gap-6 items-start cursor-pointer transition-opacity ${
                  activeStep === step.id ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                }`}
              >
                <div className="flex-shrink-0">
                  <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{step.number}.</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">{step.title}</h3>
                    {activeStep === step.id && (
                      <ArrowRight className="w-5 h-5 text-gray-900 dark:text-white" />
                    )}
                  </div>
                  {activeStep === step.id && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tax Calculator Component */}
          <TaxCalculator />
        </div>

        {/* Right Side - Description and Image */}
        <div className="space-y-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {currentStep.mainDescription}
          </p>

          {/* Image Container with transition */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-[32px] p-8 lg:p-12 flex items-center justify-center transition-all duration-300">
            <div className="w-full max-w-md">
              <Image 
                key={currentStep.id}
                src={currentStep.image}
                alt={currentStep.title}
                width={400}
                height={500}
                className="w-full h-auto transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnderstandTaxes;



