// src/components/AboutTestimonial.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import avatar from "../../assets/user.png";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Verified Customer",
    message:
      "Best quality crackers at the best prices! The team ensured safe delivery and the products were fresh. Our Diwali celebration was absolutely amazing. Highly recommended!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Regular Buyer",
    message:
      "Very professional service and super safe packing. I’ve been buying every year and they never disappoint. Prices are also very reasonable.",
    rating: 5,
  },
  {
    name: "Mohammed Ali",
    role: "First-time Customer",
    message:
      "Was a bit nervous ordering crackers online, but everything was smooth. On-time delivery, no damage, and great variety of items!",
    rating: 4.5,
  },
];

const AboutTestimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = testimonials.length;

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, [total]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const active = testimonials[currentIndex];

  return (
    <section className="py-5 px-4 font-family bg-white">
      <div className="max-w-5xl mx-auto relative">
        {/* Slider Arrows */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute -left-4 md:-left-10 top-1/2 
          -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-blue-900
           bg-blue-900 flex items-center justify-center
            hover:bg-red-600 transition"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute -right-4 md:-right-10 top-1/2 
          -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-blue-900
           bg-blue-900 flex items-center justify-center
            hover:bg-red-600  transition"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Testimonial Card */}
        <div
          className="relative 
           p-10 md:p-10 text-white
           overflow-hidden h-130 bg-blue-950 rounded-2xl"
        >
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-6 text-red-600">💬</div>

            <h3 className="text-2xl md:text-4xl font-bold mb-2 text-white">
              What Our Customers Say
            </h3>

            <div className="max-w-3xl mx-auto">
              <blockquote
                className="text-md md:text-lg italic text-gray-200 
              leading-relaxed mb-6"
              >
                “{active.message}”
              </blockquote>

              <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-600">
  <img
    src={avatar}
    alt="User Avatar"
    className="w-full h-full object-cover"
  />
</div>
                <div className="text-left">
                  <div className="font-bold text-lg text-white">
                    {active.name}
                  </div>
                  <div className="text-gray-300 text-sm">{active.role}</div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-1 mt-6 text-2xl">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${index === currentIndex
                        ? "w-6 bg-red-600"
                        : "bg-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Arrows */}
        <div className="flex md:hidden justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-blue-900 bg-blue-900 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-blue-900 bg-blue-900 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutTestimonial;
