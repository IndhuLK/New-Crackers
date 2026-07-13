import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import Image from 'next/link';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-8 text-center bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block py-1 px-4 border border-gray-200 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6 bg-white">
            We&apos;re here to help
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Get in <span className="text-[#ea580c]">Touch</span>
          </h1>
          <p className="text-gray-500 text-[15px] md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>

          <div className="flex justify-center items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:border-[#ea580c] transition-all cursor-pointer">
              <Phone size={20} strokeWidth={1.5} />
            </div>
            <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:border-[#ea580c] transition-all cursor-pointer">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:border-[#ea580c] transition-all cursor-pointer">
              <MessageSquare size={20} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Reach Us */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-4 bg-[#fff1eb] text-[#ea580c] rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Contact Details
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Ways to <span className="text-[#ea580c]">Reach Us</span>
          </h2>
          <p className="text-gray-500 text-[15px]">
            Choose your preferred method of communication. We&apos;re always happy to help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-[#f8fafc] rounded-2xl p-8 text-center flex flex-col items-center justify-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#ea580c] mb-5 shadow-sm">
              <Mail size={20} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-[13px] text-gray-500">support@dheerancrackers.com</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f8fafc] rounded-2xl p-6 text-center flex flex-col items-center justify-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#ea580c] mb-4 shadow-sm shrink-0">
              <Phone size={20} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">Mr. T. Mahesh Kumar</h3>
            <div className="space-y-1">
              <p className="text-[13px] text-gray-500"><strong className="text-gray-700">Call:</strong> 90803 00546</p>
              <p className="text-[13px] text-gray-500"><strong className="text-gray-700">WhatsApp:</strong> 97919 06961</p>
              <p className="text-[13px] text-gray-500"><strong className="text-gray-700">GPay:</strong> 90803 00546</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f8fafc] rounded-2xl p-8 text-center flex flex-col items-center justify-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#ea580c] mb-5 shadow-sm">
              <MapPin size={20} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Location</h3>
            <p className="text-[13px] text-gray-500">Sivakasi, Tamil Nadu</p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#f8fafc] rounded-2xl p-8 text-center flex flex-col items-center justify-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#ea580c] mb-5 shadow-sm">
              <Clock size={20} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Business Hours</h3>
            <p className="text-[13px] text-gray-500">Mon-Sat: 9:00 AM - 8:00 PM</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto border-t border-gray-50">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-4 bg-[#fff1eb] text-[#ea580c] rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Send Message
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Let&apos;s Start a <span className="text-[#ea580c]">Conversation</span>
          </h2>
          <p className="text-gray-500 text-[15px]">
            Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col lg:flex-row max-w-5xl mx-auto">
          
          {/* Left Side - Google Map */}
          <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-auto">
            <iframe 
              src="https://maps.google.com/maps?q=9.5010142,77.829643&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* Overlay for map link */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
              <h3 className="text-xl font-bold text-white mb-2">Our Store Location</h3>
              <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                <MapPin size={16} className="text-[#ea580c]" />
                <a href="https://maps.app.goo.gl/Z8XBPxqyrZ69Gvsv7" target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2 transition-colors pointer-events-auto">
                  View on Google Maps
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 p-8 md:p-12 bg-white">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter phone number" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</label>
                <textarea 
                  rows={4} 
                  placeholder="Write your message..." 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all resize-none custom-scrollbar"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full py-3.5 bg-[#ea580c] text-white font-bold text-[15px] rounded-lg hover:bg-[#c2410c] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
