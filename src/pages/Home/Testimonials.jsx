import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star, Quote, CheckCircle2, User } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Priya",
    location: "Chennai",
    message: "Amazing quality crackers! Delivery was on time and packaging was excellent. Will order again.",
  },
  {
    name: "Rahul",
    location: "Coimbatore",
    message: "Kids-safe options helped us choose easily. Super fast delivery!",
  },
  {
    name: "Karthik",
    location: "Madurai",
    message: "Value-for-money combo packs. Highly recommended.",
  },
  {
    name: "Sneha",
    location: "Trichy",
    message: "Packaging was neat & safe. Very satisfied!",
  },
  {
    name: "Vijay",
    location: "Bengaluru",
    message: "Fresh items, no damage, quick delivery. Loved it!",
  },
  {
    name: "Anitha",
    location: "Salem",
    message: "Easy-to-use website. Payment smooth. Reordering soon.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#020617] font-body relative overflow-hidden">
      {/* Bg Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-custom mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-3 block">
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Customers Say</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Trusted by thousands of families for our quality, safety, and reliable service.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-16"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 h-full relative group hover:border-orange-500/30 transition-all duration-300">
                <Quote size={40} className="text-slate-700 absolute top-6 right-6 opacity-20 group-hover:opacity-100 group-hover:text-orange-500 transition-all duration-300" />

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>

                <p className="text-slate-300 text-lg mb-8 leading-relaxed italic z-10 relative">
                  "{t.message}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-orange-500 font-bold text-xl">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{t.location}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="text-[10px] text-green-500 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
