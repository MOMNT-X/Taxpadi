"use client";

import React from 'react';
import Image from 'next/image';

const HeroImage: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="relative w-full mx-auto" style={{ maxWidth: '1300px' }}>
        <Image 
          src="/assets/hero-picture.svg" 
          alt="Nigerians using Taxgpt for tax calculations" 
          width={1300} 
          height={1024}
          className="w-full h-auto rounded-3xl"
          priority
        />
      </div>
    </section>
  );
};

export default HeroImage;

