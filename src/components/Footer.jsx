import React from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, MessageCircle, ArrowRight, Heart, Send, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#", color: "hover:bg-blue-600 hover:text-white text-blue-600 bg-blue-50" },
    { icon: <Instagram size={18} />, href: "#", color: "hover:bg-pink-600 hover:text-white text-pink-600 bg-pink-50" },
    { icon: <Twitter size={18} />, href: "#", color: "hover:bg-sky-500 hover:text-white text-sky-500 bg-sky-50" },
    { icon: <MessageCircle size={18} />, href: "#", color: "hover:bg-green-500 hover:text-white text-green-500 bg-green-50" },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Admin Login", path: "/admin-login" },
  ];

  const supportLinks = [
    { name: "FAQs", path: "#" },
    { name: "Shipping Policy", path: "#" },
    { name: "Returns & Refunds", path: "#" },
    { name: "Terms & Conditions", path: "#" },
    { name: "Privacy Policy", path: "#" },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 font-sans pt-16 pb-8 relative overflow-hidden">

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
                Dheeran Crackers
              </h2>
            </Link>
            <p className="text-slate-500 leading-relaxed text-sm font-medium pr-4">
              Premium fireworks for your special celebrations. We deliver joy, safety, and spectacular moments directly to your doorstep.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 inline-block">
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium text-sm group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-orange-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 inline-block">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.path} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-600 transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 inline-block">
              Contact Us
            </h3>

            <div className="space-y-4 mb-8">
              <a href="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Visit Us</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">
                    123 Firework Street, Sivakasi,<br />Tamil Nadu - 626123
                  </p>
                </div>
              </a>

              <a href="tel:+919876543210" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Call Us</h4>
                  <span className="text-slate-400 font-bold text-sm group-hover:text-blue-600 transition-colors">+91 98765 43210</span>
                </div>
              </a>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Subscribe to offers</h4>
              <form className="flex gap-2 relative">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-xs font-bold outline-none focus:border-slate-400 transition-all placeholder:text-slate-400 text-slate-700"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-slate-900 text-white p-1.5 rounded-md hover:bg-black transition-colors">
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
            © {currentYear} Dheeran Crackers. Made with <Heart size={12} className="text-rose-500 fill-rose-500" /> in India.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
