import React from "react";
import { Send, Sparkles } from "lucide-react";

const Newsletter = () => {
    return (
        <section className="py-20 relative overflow-hidden font-heading">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 skew-y-3 transform origin-bottom-left scale-110"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

            <div className="container-custom mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="lg:w-1/2 text-white">
                    <div className="flex items-center gap-2 mb-4 text-orange-200">
                        <Sparkles size={20} className="animate-pulse" />
                        <span className="font-semibold tracking-wider uppercase">Stay Updated</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Get Exclusive Offers & <br /> Festive Updates
                    </h2>
                    <p className="text-orange-100 text-lg max-w-md">
                        Subscribe to our newsletter and be the first to know about new arrivals, flash sales, and safety tips for your celebrations.
                    </p>
                </div>

                <div className="lg:w-1/2 w-full max-w-lg">
                    <form className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row gap-2 shadow-2xl">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full bg-transparent text-white placeholder-orange-100/70 px-6 py-4 outline-none text-lg"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2 group shadow-lg"
                        >
                            <span>Subscribe</span>
                            <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                    <p className="text-orange-200 text-sm mt-4 text-center sm:text-left">
                        *We respect your privacy. No spam, ever.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
