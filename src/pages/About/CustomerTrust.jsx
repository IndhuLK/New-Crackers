import React, { useState, useEffect, useRef } from "react";
import {
  UserGroupIcon,
  TrophyIcon,
  StarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

const CustomerTrust = () => {
  const stats = [
    {
      number: "10000",
      suffix: "+",
      label: "Happy Customers",
      icon: <UserGroupIcon className="w-8 h-8" />,
    },
    {
      number: "5",
      suffix: "+",
      label: "Years Experience",
      icon: <TrophyIcon className="w-8 h-8" />,
    },
    {
      number: "4.9",
      suffix: " ★",
      label: "Average Rating",
      icon: <StarIcon className="w-8 h-8" />,
    },
    {
      number: "100",
      suffix: "%",
      label: "Safety Certified",
      icon: <ShieldCheckIcon className="w-8 h-8" />,
    },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          stats.forEach((stat, index) => {
            const target = parseFloat(stat.number);
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounters((prev) => {
                const newCounters = [...prev];
                newCounters[index] = current;
                return newCounters;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 bg-white text-blue-950
     overflow-hidden font-family"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-50 border
           border-blue-100 rounded-full mb-4">
            <span className="text-blue-900 text-sm font-semibold tracking-wider">
              TRUSTED BY THOUSANDS
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 drop-shadow-xs">
            Numbers That{" "}
            <span className="text-red-600 drop-shadow-xs">
              Speak
            </span>
          </h2>

          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Building trust through quality, safety, and customer satisfaction
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
         gap-6 md:gap-8 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl
               transition-all duration-500 border border-gray-100 hover:border-red-600
                overflow-hidden"
            >

              <div className="relative z-10">
                <div className="flex gap-5">
                  {/* Icon */}
                  <div
                    className="text-5xl mb-4 transform group-hover:scale-125 
                transition-transform duration-500 text-red-600 group-hover:text-red-700"
                  >
                    {item.icon}
                  </div>

                  {/* Number */}
                  <h4
                    className="text-2xl md:text-3xl font-extrabold mb-2
                 text-blue-950 transition-colors"
                  >
                    {index === 2
                      ? counters[index].toFixed(1)
                      : Math.floor(counters[index]).toLocaleString()}
                    <span className="text-red-600">
                      {item.suffix}
                    </span>
                  </h4></div>

                {/* Label */}
                <p
                  className="font-semibold text-gray-600 ml-10
                group-hover:text-gray-800 transition-colors"
                >
                  {item.label}
                </p>
              </div>

              {/* Corner Decoration */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-50
               rounded-tl-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTrust;
