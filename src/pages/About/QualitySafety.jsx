import React from "react";
import { CheckCircle, FlaskRound, Package, ShieldCheck } from "lucide-react";

const QualitySafety = () => {
  const safetyFeatures = [
    {
      icon: <CheckCircle />,
      title: "PESO Approved",
      desc: "All products are officially certified and comply with Indian safety standards",
      color: "text-green-600",
    },
    {
      icon: <FlaskRound />,
      title: "Lab Tested",
      desc: "Rigorous testing for controlled ignition, minimal smoke, and optimal performance",
      color: "text-blue-600",
    },
    {
      icon: <Package />,
      title: "Premium Packaging",
      desc: "Moisture-resistant packaging to maintain freshness and prevent damage",
      color: "text-purple-600",
    },
    {
      icon: <ShieldCheck />,
      title: "Quality Assurance",
      desc: "Strict quality control at every stage from manufacturing to delivery",
      color: "text-red-600",
    },
  ];

  return (
    <section className="relative py-10 px-6 bg-white text-[#1A1A3D] 
    font-family overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-50 border
           border-blue-100 rounded-full mb-4">
            <span className="text-blue-900 text-sm font-semibold tracking-wider">
              QUALITY & SAFETY
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold mb-3">
            Your <span className="text-red-600">Safety</span> is Our
            <br />
            <span className="text-blue-950 drop-shadow-xs"> Top Priority</span>

          </h2>

          <p className="text-md text-gray-700 max-w-xl mx-auto leading-relaxed">
            We follow the highest safety standards to ensure every celebration <br />
            is filled with joy, not worry.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 px-10">
          {safetyFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl p-8 shadow-lg 
              hover:shadow-2xl transition-all duration-500 border border-gray-100
               hover:border-red-600 overflow-hidden"
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className={`text-5xl mb-4 transform group-hover:scale-110 
                group-hover:rotate-6 transition-transform duration-500 ${feature.color}`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-3 text-blue-950 
                group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50
               rounded-bl-full opacity-0 
               group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="relative bg-blue-50 rounded-3xl p-12 text-center overflow-hidden shadow-xl border border-blue-100">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-bold text-blue-950 mb-4 drop-shadow-xs" >
              Safety First,{" "}
              <span className="text-red-600 drop-shadow-xs">Joy Always</span>
            </h3>
            <p className="text-md text-gray-700 max-w-xl mx-auto">
              Every product undergoes rigorous testing and quality checks before
              reaching your hands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySafety;
