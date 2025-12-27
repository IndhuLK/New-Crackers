import React from "react";
import { ShieldCheck, Truck, Clock, CreditCard } from "lucide-react";

const TrustBadges = () => {
  const features = [
    {
      icon: <ShieldCheck size={40} className="text-orange-500" />,
      title: "100% Safe",
      desc: "Licensed & Certified Fireworks",
    },
    {
      icon: <Truck size={40} className="text-blue-500" />,
      title: "Fast Delivery",
      desc: "Pan-India Shipping Available",
    },
    {
      icon: <Clock size={40} className="text-green-500" />,
      title: "24/7 Support",
      desc: "Dedicated Customer Care",
    },
    {
      icon: <CreditCard size={40} className="text-purple-500" />,
      title: "Secure Payment",
      desc: "100% Secure Transactions",
    },
  ];

  return (
    <div className="py-14 bg-[#020617]">
    <section className="  relative z-20 container-custom mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl 
            flex sm:flex-row flex-col items-center sm:items-start text-center sm:text-left
            gap-4 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1 
            shadow-lg hover:shadow-orange-500/10 group"
          >
            <div className="p-3 bg-slate-900 rounded-full group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default TrustBadges;
