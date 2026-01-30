"use client";

import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HeroImage from './components/HeroImage';
import SimpleExperience from './components/SimpleExperience';
import UnderstandTaxes from './components/UnderstandTaxes';
import TrustedBy from './components/TrustedBy';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { FadeInSection } from './components/FadeInSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <HeroSection />
      
      <FadeInSection>
        <HeroImage />
      </FadeInSection>
      
      <FadeInSection delay={0.2}>
        <SimpleExperience />
      </FadeInSection>
      
      <FadeInSection delay={0.3}>
        <UnderstandTaxes />
      </FadeInSection>
      
      <FadeInSection delay={0.2}>
        <TrustedBy />
      </FadeInSection>
      
      <FadeInSection delay={0.3}>
        <FAQ />
      </FadeInSection>
      
      <FadeInSection delay={0.2}>
        <Testimonials />
      </FadeInSection>
      
      <Footer />
    </div>
  );
};

export default LandingPage;