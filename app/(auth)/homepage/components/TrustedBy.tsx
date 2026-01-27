"use client";

import React from 'react';
import Image from 'next/image';

const TrustedBy: React.FC = () => {
  const testimonials = [
    {
      image: "/assets/Trusted-1.png",
      quote: "Tax compliance used to stress me out. Now I just ask Taxgpt and get straight answers without any wahala.",
      name: "Aisha M",
      title: "Content Creator"
    },
    {
      image: "/assets/Trusted-2.jpg",
      quote: "Wasn't sure if I needed to file taxes on my allowance. TaxGPT cleared it up in one conversation.",
      name: "Michael T",
      title: "NYSC Corps Member"
    },
    {
      image: "/assets/Trusted-3.png",
      quote: "Wasn't sure if I needed to file taxes on my allowance. TaxGPT cleared it up in one conversation.",
      name: "Michael T",
      title: "NYSC Corps Member"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-4xl md:text-5xl font-normal text-gray-900 dark:text-white text-center mb-16 leading-tight">
        Trusted by Nigerian<br />professionals and businesses
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            className="aspect-[4/4] relative rounded-3xl overflow-hidden group shadow-xl"
          >
            {/* Background Image */}
            <Image 
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
              {/* Quote */}
              <p className="text-base md:text-lg font-normal leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              
              {/* Attribution */}
              <p className="text-sm font-medium">
                — {testimonial.name}, {testimonial.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedBy;

