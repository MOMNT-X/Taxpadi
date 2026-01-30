"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Tax used to be confusing for my business, especially with the new tax reforms. TaxGPT made everything clearer. I now know exactly what to pay and when - it feels like having a tax advisor on standby 24/7.",
      name: "Faith Okedele",
      title: "Founder edge studio",
      image: "/assets/faith-okedele.jpg"
    },
    {
      quote: "As an NYSC member, understanding my tax obligations was overwhelming. TaxGPT simplified everything and helped me calculate my monthly tax accurately. It's incredibly user-friendly!",
      name: "Chidi Okonkwo",
      title: "NYSC Corps Member",
      image: "/assets/Trusted-2.jpg"
    },
    {
      quote: "Managing taxes for our growing team was becoming a challenge. TaxGPT's business tax calculations and guidance have been invaluable. Highly recommend for any Nigerian business!",
      name: "Amara Nwosu",
      title: "Business Owner",
      image: "/assets/Trusted-3.png"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="bg-gray-50 dark:bg-neutral-900 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Testimonial Card */}
        <div className="bg-gray-100 dark:bg-neutral-800 rounded-3xl p-6 md:p-8 relative">
          {/* Quote */}
          <p className="font-medium text-md md:text-md text-gray-900 dark:text-white leading-relaxed mb-12 text-center">
            {testimonials[currentIndex].quote}
          </p>

          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-neutral-500">
              <Image
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-lg">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {testimonials[currentIndex].title}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3 mt-12 justify-center md:absolute md:bottom-16 md:right-16 md:mt-0">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-gray-900 dark:bg-white w-8' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
