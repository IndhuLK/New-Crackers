import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  ShieldCheck,
  Wallet,
  Truck,
} from "lucide-react";

import images from "../../assets/images2.jpg";

const WhoWeAre = () => {
  const navigate = useNavigate();

  const goToProducts = () => {
    navigate("/products");
    window.scrollTo(0, 0);
  };

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      desc: "PESO certified products",
    },
    {
      icon: ShieldCheck,
      title: "Safe & Tested",
      desc: "Rigorous safety checks",
    },
    {
      icon: Wallet,
      title: "Best Prices",
      desc: "Affordable for everyone",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "On-time guaranteed",
    },
  ];

  return (
    <section
      className="relative py-10 px-6 w-full font-family
      bg-white shadow-xl border border-red-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              
              <img
                src={images}
                alt="Fireworks Celebration"
                className="w-full h-[500px] object-cover
                transform group-hover:scale-110
                transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-blue-950/20" />

              <div
                className="absolute bottom-8 left-8 px-4 py-2
                bg-red-600 cursor-pointer text-white
                font-bold rounded-full hover:scale-105
                transition-transform duration-300
                shadow-xl hover:shadow-2xl hover:bg-red-700"
              >
                5+ Years of Excellence
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            
            {/* Badge */}
            <div
              className="inline-block px-4 py-2 bg-blue-50
              border border-blue-100 rounded-full"
            >
              <span className="text-blue-900 text-sm font-semibold tracking-wider">
                WHO WE ARE
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-2xl md:text-4xl font-extrabold
              mt-3 text-blue-950 drop-shadow-xs"
            >
              Bringing Joy to Every Celebration
            </h2>

            {/* Description */}
            <p className="text-md md:text-base text-gray-700 leading-relaxed">
              We are a{" "}
              <span className="text-red-600 font-semibold">
                trusted fireworks distributor
              </span>{" "}
              committed to delivering high-quality & safe crackers at affordable
              prices. Our team ensures festival joy reaches every home with{" "}
              <span className="text-blue-900 font-semibold">
                responsibility and trust
              </span>
              .
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200
                  rounded-2xl p-4 hover:border-red-600
                  transition-all duration-300 group
                  shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Icon */}
                    <div
                      className="p-3 bg-red-50 rounded-xl
                      text-red-600 group-hover:bg-red-600
                      group-hover:text-white transition-all"
                    >
                      <item.icon size={28} strokeWidth={2} />
                    </div>

                    {/* Text */}
                    <div>
                      <h4
                        className="font-bold text-blue-950 mb-1
                        group-hover:text-red-600 transition-colors"
                      >
                        {item.title}
                      </h4>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={goToProducts}
                className="px-6 py-3 bg-red-600
                text-white font-bold rounded-full
                hover:scale-105 transition-transform
                duration-300 shadow-lg hover:shadow-xl
                hover:bg-red-700 cursor-pointer"
              >
                Explore Our Products →
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
