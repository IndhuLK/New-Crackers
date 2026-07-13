import Link from 'next/link';
import { Facebook, Instagram, Twitter, MessageCircle, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Dheeran <span className="text-accent">Crackers</span>
              </h2>
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm pr-4">
              Premium fireworks for your special celebrations. We deliver joy, safety, and spectacular moments directly to your doorstep.
            </p>
            <div className="flex gap-2.5">
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-accent hover:text-white hover:border-accent transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-accent hover:text-white hover:border-accent transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-accent hover:text-white hover:border-accent transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-accent hover:text-white hover:border-accent transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-gray-500 hover:text-accent transition-colors text-sm">Home</Link></li>
              <li><Link href="/products" className="text-gray-500 hover:text-accent transition-colors text-sm">Shop All</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-accent transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-accent transition-colors text-sm">Contact</Link></li>
              <li><Link href="/admin-login" className="text-gray-500 hover:text-accent transition-colors text-sm">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">Support</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-gray-500 hover:text-accent transition-colors text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-500 hover:text-accent transition-colors text-sm">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-accent transition-colors text-sm">Returns & Refunds</a></li>
              <li><a href="#" className="text-gray-500 hover:text-accent transition-colors text-sm">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-500 hover:text-accent transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">Contact Us</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  123 Firework Street, Sivakasi,<br />Tamil Nadu - 626123
                </p>
              </div>
              <a href="tel:+919876543210" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <span className="text-gray-600 font-medium text-sm group-hover:text-accent transition-colors">
                  +91 98765 43210
                </span>
              </a>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Subscribe to offers</h4>
              <form className="flex gap-2">
                <input type="email" placeholder="Email address" className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-gray-400 text-gray-900" />
                <button className="bg-accent text-white px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors shrink-0">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 flex items-center gap-1">© 2026 Dheeran Crackers.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
