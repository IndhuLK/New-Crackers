import React, { useEffect, useState } from 'react';

import card from '../../assets/image1.jpg'

const AboutBanner = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full px-4 py-16 font-family 
       overflow-hidden">

      {/* ⭐ Background Image as <img /> */}
      <img
        src={card} // ← Change to your image path
        alt="Our Story Background"
        className="absolute inset-0 w-full h-full object-cover opacity-100"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }} // Optional parallax
      />

      {/* Light overlay for better text contrast if needed */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>

      {/* ⭐ Content */}
      <div className="relative max-w-5xl mx-auto text-center text-blue-950 z-10">

        {/* Badge */}
        <h2 className="inline-block px-7 py-2 rounded-full text-sm font-bold 
          shadow-md border border-red-200 bg-red-50 
          uppercase tracking-[0.25em] text-red-600">
           TRUSTED SINCE 2018
        </h2>

        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-extrabold mt-3 py-5 
          text-white drop-shadow-sm">
          Our Story
        </h1>

        {/* Subtitle */}
        <p className="text-md text-slate-200 max-w-xl mx-auto leading-relaxed font-medium">
          Illuminating celebrations with safety, joy, and trust for over half a
          decade — serving 10K+ happy customers with certified quality.
        </p>

        {/* Stats Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-950">

          <div className="backdrop-blur-xl bg-white/80 p-6 rounded-2xl shadow-lg
           border border-white/50 ">
            <h3 className="text-4xl font-bold text-red-600">10K+</h3>
            <p className="mt-2 font-semibold">Happy Customers</p>
          </div>

          <div className="backdrop-blur-xl bg-white/80 p-6 rounded-2xl shadow-lg border
           border-white/50">
            <h3 className="text-4xl font-bold text-blue-800">5+</h3>
            <p className="mt-2 font-semibold">Years Experience</p>
          </div>

          <div className="backdrop-blur-xl bg-white/80 p-6 rounded-2xl shadow-lg border 
          border-white/50">
            <h3 className="text-4xl font-bold text-red-600">100%</h3>
            <p className="mt-2 font-semibold">Safety Certified</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutBanner;
