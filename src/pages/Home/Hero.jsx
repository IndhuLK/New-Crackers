import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

/**
 * Hero Component - Classic Premium Design (No-Vibe)
 * Features: Static Elegance, Solid Typography, Clear CTA
 */

const HeroStyles = () => (
  <style>{`
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
    `}</style>
);

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  // Parallax logic (Desktop only)
  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Slides
  useEffect(() => {
    const q = query(collection(db, "Sliders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSlides(data);
    });
    return () => unsub();
  }, []);

  // Slide Interval
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return <LoadingScreen />;

  return (
    <div className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-[#030305] text-white">
      <HeroStyles />

      {/* --- BACKGROUND LAYERS --- */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Image: Fixed on Desktop, Scroll on Mobile */}
          <div
            className="absolute inset-0 bg-cover bg-[center_top] md:bg-fixed md:bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
            }}
          />
          {/* Standard Premium Overlay - Uniform and Dark */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>
      ))}

      {/* --- HERO CONTENT --- */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pt-20 container-custom mx-auto px-4">
        <div key={currentSlide} className="max-w-4xl w-full flex flex-col items-center text-center">

          {/* Classic Badge */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <span className="inline-block px-4 py-1.5 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
              The Royal Collection
            </span>
          </div>

          {/* Main Headline - Solid Luxury Typography */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight mb-6 text-white drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Light Up Every Celebration with <br className="hidden md:block" />
            <span className="text-amber-400">Premium Fireworks</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-200 font-medium mb-10 max-w-2xl leading-relaxed tracking-wide animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            Safe • Certified • High-Quality Crackers delivered directly to your doorstep.
          </p>

          {/* CTA Buttons - Standard Elegant Style */}
          <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={() => navigate("/products")}
              className="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-full font-bold text-lg text-white shadow-lg transition-colors duration-300"
            >
              Shop Now
            </button>

            <button
              onClick={() => navigate("/products")}
              className="px-10 py-4 rounded-full border-2 border-white/80 text-white font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
            >
              View Catalogue <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#030305]">
    <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
  </div>
);

export default Hero;
