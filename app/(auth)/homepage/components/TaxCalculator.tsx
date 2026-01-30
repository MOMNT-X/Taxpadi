"use client";

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [taxResult, setTaxResult] = useState<{
    grossIncome: number;
    taxableIncome: number;
    totalTax: number;
    netIncome: number;
  } | null>(null);

  const calculateTax = async () => {
    const grossIncome = parseFloat(income.replace(/,/g, ''));
    if (isNaN(grossIncome) || grossIncome <= 0) {
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Nigerian PAYE Tax Calculation (2024 rates)
    // Consolidated Relief Allowance: Higher of 1% of gross income or ₦200,000 + 20% of gross income
    const reliefAllowance = Math.max(
      0.01 * grossIncome,
      200000 + 0.2 * grossIncome
    );

    const taxableIncome = Math.max(0, grossIncome - reliefAllowance);

    // Progressive tax rates
    let tax = 0;
    if (taxableIncome <= 300000) {
      tax = taxableIncome * 0.07;
    } else if (taxableIncome <= 600000) {
      tax = 300000 * 0.07 + (taxableIncome - 300000) * 0.11;
    } else if (taxableIncome <= 1100000) {
      tax = 300000 * 0.07 + 300000 * 0.11 + (taxableIncome - 600000) * 0.15;
    } else if (taxableIncome <= 1600000) {
      tax = 300000 * 0.07 + 300000 * 0.11 + 500000 * 0.15 + (taxableIncome - 1100000) * 0.19;
    } else if (taxableIncome <= 3200000) {
      tax = 300000 * 0.07 + 300000 * 0.11 + 500000 * 0.15 + 500000 * 0.19 + (taxableIncome - 1600000) * 0.21;
    } else {
      tax = 300000 * 0.07 + 300000 * 0.11 + 500000 * 0.15 + 500000 * 0.19 + 1600000 * 0.21 + (taxableIncome - 3200000) * 0.24;
    }

    setTaxResult({
      grossIncome,
      taxableIncome,
      totalTax: tax,
      netIncome: grossIncome - tax
    });
    
    setIsCalculating(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setIncome(value);
    setTaxResult(null);
  };

  return (
    <div className="mt-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 md:p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Quick PAYE Calculator
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Calculate your monthly tax instantly based on Nigerian PAYE rates.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Gross Income (₦)
          </label>
          <input
            type="text"
            id="income"
            value={income ? parseInt(income).toLocaleString() : ''}
            onChange={handleInputChange}
            placeholder="e.g., 450,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            disabled={isCalculating}
          />
        </div>

        <button
          onClick={calculateTax}
          disabled={!income || isCalculating}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            'Calculate Tax'
          )}
        </button>

        {taxResult && !isCalculating && (
          <div className="mt-6 space-y-3 bg-white rounded-2xl p-5 animate-fadeIn">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Gross Income</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(taxResult.grossIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Taxable Income</span>
              <span className="text-base font-medium text-gray-700">
                {formatCurrency(taxResult.taxableIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Tax</span>
              <span className="text-base font-semibold text-red-600">
                {formatCurrency(taxResult.totalTax)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-gray-900">Net Income</span>
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(taxResult.netIncome)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxCalculator;

