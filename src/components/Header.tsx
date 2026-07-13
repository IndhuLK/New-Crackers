"use client";
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cart, setIsCartOpen } = useCart();
  
  const cartCount = cart.reduce((total, item) => total + (item.qty || 1), 0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-[17px] font-bold text-gray-900 tracking-tight">
            Dheeran <span className="text-accent">Crackers</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className={`px-4 py-2 text-[14px] font-semibold rounded-md transition-colors ${pathname === '/' ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:text-accent hover:bg-gray-50'}`}>Home</Link>
          <Link href="/about" className={`px-4 py-2 text-[14px] font-semibold rounded-md transition-colors ${pathname.startsWith('/about') ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:text-accent hover:bg-gray-50'}`}>About</Link>
          <Link href="/products" className={`px-4 py-2 text-[14px] font-semibold rounded-md transition-colors ${pathname.startsWith('/products') ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:text-accent hover:bg-gray-50'}`}>Products</Link>
          <Link href="/contact" className={`px-4 py-2 text-[14px] font-semibold rounded-md transition-colors ${pathname.startsWith('/contact') ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:text-accent hover:bg-gray-50'}`}>Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/products')} className="w-9 h-9 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Search size={18} />
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative w-9 h-9 flex items-center justify-center rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 z-[999] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-[1000] shadow-xl transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-3 flex flex-col gap-1">
          <Link href="/" className={`px-4 py-3 rounded text-sm font-semibold transition-colors ${pathname === '/' ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" className={`px-4 py-3 rounded text-sm font-semibold transition-colors ${pathname.startsWith('/about') ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/products" className={`px-4 py-3 rounded text-sm font-semibold transition-colors ${pathname.startsWith('/products') ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link href="/contact" className={`px-4 py-3 rounded text-sm font-semibold transition-colors ${pathname.startsWith('/contact') ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
      </div>
    </header>
  );
}
