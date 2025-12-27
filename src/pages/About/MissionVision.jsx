import React from "react";
import {
  HandThumbUpIcon, // for Trust
  ShieldCheckIcon, // for Safety
  SparklesIcon, // for Quality
  GlobeAltIcon, // for Sustainability
} from "@heroicons/react/24/solid";

const MissionVision = () => {
  return (
    <section
      className="relative py-10 px-6 bg-white text-black overflow-hidden
      font-family"
    >
      <div className="max-w-7xl mx-auto relative z-10 ">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-2 bg-blue-50 border
           border-blue-100 rounded-full mb-4"
          >
            <span
              className="text-blue-900 text-sm font-semibold 
            tracking-wider"
            >
              OUR PURPOSE
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-blue-950">
            <span
              className="text-red-600 drop-shadow-xs"
            >
              Mission & Vision
            </span>
          </h2>

          <p className="text-md text-gray-700 max-w-3xl mx-auto">
            Driven by purpose, guided by values, committed to excellence
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Mission Card */}
          <div className="group relative bg-white
          border border-gray-200 rounded-3xl p-10
           hover:border-red-600 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl">

            <div className="relative z-10">

              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-red-50 border
               border-red-100 rounded-full mb-4">
                <span className="text-red-600 text-xs font-bold tracking-wider">
                  MISSION
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-blue-950 group-hover:text-red-600
               transition-colors">
                What We Do
              </h3>

              <p className="text-md text-gray-700 leading-relaxed">
                To bring{" "}
                <span className="text-red-600 font-semibold">
                  safe celebrations
                </span>{" "}
                to every home with world-class fireworks, excellent service, and
                trusted quality. We strive to make every festival memorable
                while prioritizing
                <span className="text-blue-900 font-semibold">
                  {" "}
                  safety and sustainability
                </span>
                .
              </p>

              {/* Feature List */}
              <div className="mt-3 space-y-2">
                {[
                  "Premium Quality Products",
                  "Customer-First Service",
                  "Safety & Sustainability",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative bg-white
           border border-gray-200 rounded-3xl p-10
            hover:border-blue-900 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl">

            <div className="relative z-10">

              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-blue-50 border
               border-blue-100 rounded-full mb-4">
                <span className="text-blue-900 text-xs font-bold tracking-wider">
                  VISION
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl md:text-4xl font-bold mb-4 text-blue-950
              group-hover:text-blue-900 transition-colors ">
                Where We're Going
              </h3>

              <p className="text-md text-gray-700 leading-relaxed">
                To become{" "}
                <span className="text-blue-900 font-semibold">
                  India's most reliable
                </span>{" "}
                and innovative fireworks brand known for sustainability, safety,
                and value. We envision a future where every celebration is
                <span className="text-red-600 font-semibold">
                  {" "}
                  eco-friendly and joyful
                </span>
                .
              </p>

              {/* Feature List */}
              <div className="mt-3 space-y-2">
                {[
                  "Industry Leadership",
                  "Innovation & Technology",
                  "Eco-Friendly Solutions",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
