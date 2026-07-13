import Link from 'next/link';
import { Award, ShieldCheck, Wallet, Truck, CheckCircle2, FlaskConical, Package, Target, Eye } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#fcfdfd] min-h-screen">
      {/* 1. Hero Section: Our Story */}
      <section className="pt-24 pb-16 px-4 md:px-6 max-w-[1200px] mx-auto text-center">
        <div className="inline-flex items-center justify-center border border-gray-200 bg-white rounded-full px-4 py-1.5 mb-6 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            TRUSTED SINCE 2018
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Our <span className="text-[#ea580c]">Story</span>
        </h1>
        
        <p className="text-gray-500 text-[15px] md:text-[17px] max-w-2xl mx-auto leading-relaxed mb-14">
          Illuminating celebrations with safety, joy, and trust for over half a decade — serving 10K+ happy customers with certified quality.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <h2 className="text-4xl font-extrabold text-[#ea580c] mb-2">10K+</h2>
            <p className="text-gray-600 font-medium text-[15px]">Happy Customers</p>
          </div>
          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <h2 className="text-4xl font-extrabold text-[#ea580c] mb-2">5+</h2>
            <p className="text-gray-600 font-medium text-[15px]">Years Experience</p>
          </div>
          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <h2 className="text-4xl font-extrabold text-[#ea580c] mb-2">100%</h2>
            <p className="text-gray-600 font-medium text-[15px]">Safety Certified</p>
          </div>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-20 px-4 md:px-6 max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Image */}
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl">
            <img 
              src="/happy_diwali.jpg" 
              alt="Diwali celebration" 
              className="w-full h-full object-cover"
            />
            
            {/* Badge */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                5+
              </div>
              <span className="font-semibold text-gray-800 text-[15px] whitespace-nowrap">Years of Excellence</span>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <div className="inline-flex items-center justify-center bg-[#fff7ed] rounded-full px-3 py-1 mb-5">
              <span className="text-[10px] font-bold tracking-widest text-[#ea580c] uppercase">
                WHO WE ARE
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
              Bringing Joy to Every <br className="hidden md:block"/>
              <span className="text-[#ea580c]">Celebration</span>
            </h2>
            
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10">
              We are a <strong className="text-gray-700">trusted fireworks distributor</strong> committed to delivering high-quality & safe crackers at competitive prices. Our team ensures festival joy reaches every home with <strong className="text-gray-700">responsibility and trust</strong>.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {/* Feature 1 */}
              <div className="bg-gray-50/80 rounded-xl p-4 flex gap-4 border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#fff7ed] text-[#ea580c] flex items-center justify-center">
                  <Award size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-[14px] mb-0.5">Premium Quality</h4>
                  <p className="text-[11px] text-gray-500">PESO certified products</p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="bg-gray-50/80 rounded-xl p-4 flex gap-4 border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#fff7ed] text-[#ea580c] flex items-center justify-center">
                  <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-[14px] mb-0.5">Safe & Tested</h4>
                  <p className="text-[11px] text-gray-500">Rigorous safety checks</p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="bg-gray-50/80 rounded-xl p-4 flex gap-4 border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#fff7ed] text-[#ea580c] flex items-center justify-center">
                  <Wallet size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-[14px] mb-0.5">Best Prices</h4>
                  <p className="text-[11px] text-gray-500">Affordable for everyone</p>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="bg-gray-50/80 rounded-xl p-4 flex gap-4 border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#fff7ed] text-[#ea580c] flex items-center justify-center">
                  <Truck size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-[14px] mb-0.5">Fast Delivery</h4>
                  <p className="text-[11px] text-gray-500">On-time guaranteed</p>
                </div>
              </div>
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#d44d08] text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] hover:-translate-y-0.5">
              Explore Our Products <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Quality & Safety Section */}
      <section className="py-24 bg-white px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-[#fff7ed] rounded-full px-3 py-1 mb-5">
            <span className="text-[10px] font-bold tracking-widest text-[#ea580c] uppercase">
              QUALITY & SAFETY
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Your <span className="text-[#ea580c]">Safety</span> is Our Top Priority
          </h2>
          
          <p className="text-gray-500 text-[15px] max-w-xl mx-auto mb-16 leading-relaxed">
            We follow the highest safety standards to ensure every celebration is filled with joy, not worry.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-6">
                <CheckCircle2 size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">PESO Approved</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                All products are officially certified and comply with Indian safety standards.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-6">
                <FlaskConical size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lab Tested</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Rigorous testing for controlled ignition, minimal smoke, and optimal performance.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-6">
                <Package size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Premium Packaging</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Moisture-resistant packaging to maintain freshness and prevent damage.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-6">
                <ShieldCheck size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Strict quality control at every stage from manufacturing to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 4. Banner Section */}
      <section className="bg-[#fcfdfd] py-12 px-4 md:px-6">
        <div className="max-w-[1000px] mx-auto bg-white border border-gray-100 rounded-3xl p-10 md:p-14 text-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Safety First, <span className="text-[#ea580c]">Joy Always</span>
          </h2>
          <p className="text-gray-500 text-[15px] md:text-[17px]">
            Every product undergoes rigorous testing and quality checks before reaching your hands.
          </p>
        </div>
      </section>

      {/* 5. Mission & Vision Section */}
      <section className="py-20 px-4 md:px-6 max-w-[1200px] mx-auto text-center pb-32">
        <div className="inline-flex items-center justify-center bg-[#fff7ed] rounded-full px-3 py-1 mb-5">
          <span className="text-[10px] font-bold tracking-widest text-[#ea580c] uppercase">
            OUR PURPOSE
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Mission & <span className="text-[#ea580c]">Vision</span>
        </h2>
        
        <p className="text-gray-500 text-[15px] mb-16">
          Driven by purpose, guided by values, committed to excellence
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
          {/* Mission */}
          <div className="bg-gray-50/80 rounded-3xl p-8 md:p-10 border border-gray-100 hover:border-[#fed7aa] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center">
                <Target size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#ea580c] uppercase">MISSION</span>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">What We Do</h3>
            
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              To bring <strong className="text-gray-800">safe celebrations</strong> to every home with world-class fireworks, excellent service, and trusted quality. We strive to make every festival memorable while prioritizing <strong className="text-gray-800">sustainability and joy</strong>.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></div>
                Premium Quality Products
              </li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></div>
                Customer-First Service
              </li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></div>
                Safety & Sustainability
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-gray-50/80 rounded-3xl p-8 md:p-10 border border-gray-100 hover:border-[#fed7aa] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center">
                <Eye size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#ea580c] uppercase">VISION</span>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Where We&apos;re Going</h3>
            
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              To become <strong className="text-gray-800">India&apos;s most reliable</strong> and innovative fireworks brand known for sustainability, safety, and value. We envision a future where every celebration is <strong className="text-gray-800">eco-friendly and joyful</strong>.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></div>
                Industry Leadership
              </li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></div>
                Innovation & Technology
              </li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></div>
                Eco-Friendly Solutions
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
