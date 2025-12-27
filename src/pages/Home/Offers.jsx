import React, { useState, useEffect } from 'react';
import { Timer, Tag, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({
        days: 5,
        hours: 12,
        minutes: 45,
        seconds: 30
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                        else {
                            hours = 23;
                            if (days > 0) days--;
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const offers = [
        {
            id: 1,
            title: 'Diwali Super Sale',
            desc: 'Up to 50% OFF on all combos',
            code: 'DIWALI50',
            bg: 'from-orange-500 to-red-600',
            icon: <Zap size={24} className="text-white" />
        },
        {
            id: 2,
            title: 'Flash Sale',
            desc: 'Limited stock available',
            code: 'FLASH30',
            bg: 'from-blue-500 to-indigo-600',
            icon: <Timer size={24} className="text-white" />
        },
        {
            id: 3,
            title: 'Bulk Discount',
            desc: 'Get 40% OFF on ₹5000+',
            code: 'BULK40',
            bg: 'from-green-500 to-emerald-600',
            icon: <Tag size={24} className="text-white" />
        }
    ];

    return (
        <section className="py-20 bg-white relative overflow-hidden font-body">

            <div className="container-custom mx-auto px-6 relative z-10">

                {/* Header & Timer */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-10">
                    <div className="text-center lg:text-left">
                        <span className="inline-block px-4 py-1 mb-4 border border-blue-900/10 rounded-full text-red-600 text-xs font-bold tracking-widest uppercase bg-red-50">
                            Limited Time Only
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-blue-950 mb-4">
                            Festival <span className="text-red-600">Offers</span>
                        </h2>
                        <p className="text-slate-600 text-lg">Grab the best deals before they expire!</p>
                    </div>

                    <div className="flex gap-4 sm:gap-6">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="flex flex-col items-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-lg border border-slate-200 rounded-2xl flex items-center justify-center mb-2">
                                    <span className="text-2xl sm:text-3xl font-bold text-blue-900 font-heading">
                                        {String(value).padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{unit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:border-blue-200 overflow-hidden"
                        >

                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {/* Using cloneElement to pass className if icon allows, or wrap it */}
                                <div className="text-blue-900">
                                    {React.cloneElement(offer.icon, { className: 'text-blue-900' })}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-blue-950 mb-2">{offer.title}</h3>
                            <p className="text-slate-500 mb-6">{offer.desc}</p>

                            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 flex items-center justify-between mb-6 group-hover:border-blue-300 transition-colors">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Use Code</span>
                                <span className="text-lg font-mono font-bold text-red-600 tracking-widest">{offer.code}</span>
                            </div>

                            <button
                                onClick={() => navigate('/products')}
                                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-lg"
                            >
                                Shop Now <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Offers;
