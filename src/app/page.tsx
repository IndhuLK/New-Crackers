"use client";
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, ShoppingCart, Loader2 } from 'lucide-react';
import { useProducts, Product } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Slider {
  id: string;
  title: string;
  subTitle: string;
  desc: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  img: string;
  sortOrder: number;
}

interface Occasion {
  id: string;
  title: string;
  subtitle: string;
  img: string;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  message: string;
  rating?: number;
}

export default function Home() {
  const { products, loading } = useProducts();
  const { addToCart, cart } = useCart();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  useEffect(() => {
    const qSliders = query(collection(db, 'Sliders'));
    const unsubSliders = onSnapshot(qSliders, (snapshot) => {
      const fetchedSliders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Slider[];
      setSliders(fetchedSliders);
    });

    const qCategories = query(collection(db, 'categories'));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const fetchedCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      // Sort categories if sortOrder exists
      fetchedCategories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setCategories(fetchedCategories);
    });

    const qOccasions = query(collection(db, 'occasions'));
    const unsubOccasions = onSnapshot(qOccasions, (snapshot) => {
      setOccasions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Occasion[]);
    });

    const qTestimonials = query(collection(db, 'testimonials'));
    const unsubTestimonials = onSnapshot(qTestimonials, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[]);
    });

    return () => {
      unsubSliders();
      unsubCategories();
      unsubOccasions();
      unsubTestimonials();
    };
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const interval = setInterval(() => {
      setActiveCategoryIndex(prev => (prev + 1) % categories.length);
    }, 4000); // 4 seconds per scroll
    return () => clearInterval(interval);
  }, [categories.length]);

  useEffect(() => {
    if (categoriesScrollRef.current && categoriesScrollRef.current.children[activeCategoryIndex]) {
      const container = categoriesScrollRef.current;
      const child = container.children[activeCategoryIndex] as HTMLElement;
      // Scroll to keep the active item visible (preferably near center)
      const scrollLeft = child.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (child.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
    }
  }, [activeCategoryIndex]);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  const handleAddToCart = (product: Product) => {
    if (product.outOfStock || (product.stock !== undefined && product.stock !== null && product.stock <= 0)) {
      toast.error("This product is out of stock");
      return;
    }
    addToCart(product);
    toast.success("Added to cart");
  };

  // Get featured/best selling products (just taking the first 8 for now)
  const publicProducts = products.filter(p => !p.isHidden);
  const featuredProducts = publicProducts.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-[600px] flex items-center">
        {sliders.length > 0 ? (
          sliders.map((slider, index) => (
            <div 
              key={slider.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: `url('${slider.imageUrl}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
              
              <div className="relative max-w-[1400px] w-full mx-auto px-6 md:px-12 py-20 flex flex-col items-start h-full justify-center">
                {slider.subTitle && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[13px] font-medium mb-6">
                    <Sparkles size={14} className="text-gray-300" />
                    <span className="text-gray-200">{slider.subTitle}</span>
                  </span>
                )}
                <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight mb-5 max-w-3xl leading-[1.1]">
                  {slider.title || 'Light Up Every Celebration'}
                </h1>
                <p className="text-lg md:text-[19px] text-gray-300 mb-8 max-w-xl leading-relaxed font-light">
                  {slider.desc || 'Discover handpicked, certified crackers that bring joy, color, and safety to every occasion.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href="/products" className="px-7 py-3.5 bg-accent text-white rounded-md font-semibold text-[15px] hover:bg-accent/90 transition-all flex items-center justify-center gap-2">
                    Shop Now <ArrowRight size={18} />
                  </Link>
                  <Link href="/catalogue" className="px-7 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-md font-semibold text-[15px] hover:bg-white/20 transition-all flex items-center justify-center">
                    View Catalogue
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 z-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
            
            <div className="relative max-w-[1400px] w-full mx-auto px-6 md:px-12 py-20 flex flex-col items-start h-full justify-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[13px] font-medium mb-6">
                <Sparkles size={14} className="text-gray-300" />
                <span className="text-gray-200">Premium Collection 2025</span>
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight mb-5 max-w-3xl leading-[1.1]">
                Light Up Every<br/>Celebration
              </h1>
              <p className="text-lg md:text-[19px] text-gray-300 mb-8 max-w-xl leading-relaxed font-light">
                Discover handpicked, certified crackers that bring joy, color, and safety to every occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/products" className="px-7 py-3.5 bg-accent text-white rounded-md font-semibold text-[15px] hover:bg-accent/90 transition-all flex items-center justify-center gap-2">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link href="/catalogue" className="px-7 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-md font-semibold text-[15px] hover:bg-white/20 transition-all flex items-center justify-center">
                  View Catalogue
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Carousel Dots */}
        {sliders.length > 1 ? (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {sliders.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-8 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        ) : (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            <div className="w-8 h-1.5 rounded-full bg-white"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
          </div>
        )}
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6 md:gap-0">
            <div className="flex items-center gap-3 md:flex-1">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">100% Safe</h3>
                <p className="text-[12px] text-gray-500">Licensed & Certified Fireworks</p>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            <div className="flex items-center gap-3 md:flex-1 md:justify-center">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">Fast Delivery</h3>
                <p className="text-[12px] text-gray-500">Pan-India Shipping Available</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            <div className="flex items-center gap-3 md:flex-1 md:justify-center">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">24/7 Support</h3>
                <p className="text-[12px] text-gray-500">Dedicated Customer Care</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            <div className="flex items-center gap-3 md:flex-1 md:justify-end">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">Secure Payment</h3>
                <p className="text-[12px] text-gray-500">100% Secure Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="mb-10 text-left">
              <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-1 font-heading tracking-tight">Shop by Category</h2>
              <p className="text-sm md:text-[15px] text-gray-500 font-light">Browse our curated collections of premium crackers</p>
            </div>
          </div>
          
          <div className="w-full relative">
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
            
            <div 
              ref={categoriesScrollRef}
              className="flex overflow-x-auto gap-6 md:gap-10 pb-8 pt-2 hide-scrollbar scroll-smooth px-6 md:px-12 xl:px-[calc((100vw-1400px)/2+48px)]"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category, index) => {
                  const itemCount = publicProducts.filter(p => p.category === category.name).length;
                  return (
                    <Link 
                      key={category.id} 
                      href={`/products?category=${encodeURIComponent(category.slug || category.name)}`}
                      className="flex flex-col items-center shrink-0 w-36 md:w-44 group transition-opacity"
                    >
                      <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1 border relative ${activeCategoryIndex === index ? 'border-accent ring-4 ring-accent/10' : 'border-gray-100 bg-gray-50'}`}>
                        <img 
                          src={category.img || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop"} 
                          alt={category.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <h3 className="text-sm md:text-[15px] font-bold text-gray-900 text-center uppercase tracking-wide leading-tight mb-1 group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-[12px] text-gray-400 font-medium">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </Link>
                  );
                })}
              </div>

            {/* Dots Pagination */}
            {categories.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap px-6">
                {categories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeCategoryIndex === idx ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to category ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-[28px] font-bold text-gray-900 mb-2 font-heading tracking-tight">Best sellers</h2>
              <p className="text-gray-600">Explore our most popular firework categories</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-1 text-accent font-semibold hover:text-accent/80 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                  </div>
                  <div className="p-5">
                    <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-2/3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const inCart = cart.some(item => item.id === product.id);
                const isOutOfStock = (product.stock !== undefined && product.stock !== null && product.stock <= 0) || product.outOfStock;
                
                return (
                  <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                    <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`} className="block">
                      <div className="h-56 relative overflow-hidden bg-gray-100">
                        <img 
                          src={product.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop"} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
                          {product.category}
                        </div>
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="bg-gray-900 text-white px-3 py-1 text-sm font-semibold rounded shadow">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                        {product.mrp && product.price && (
                           <div className="absolute top-3 right-3 bg-accent text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                             {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                           </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
                      </Link>
                      <div className="flex justify-between items-center mt-auto pt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-accent">₹{product.price}</span>
                          {product.mrp && product.mrp > product.price && (
                             <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock || inCart}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            inCart 
                              ? "bg-green-500 text-white" 
                              : isOutOfStock 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-gray-100 text-gray-700 hover:bg-accent hover:text-white"
                          }`}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors shadow-sm">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Fresh Arrivals Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-[#f97316]" />
                <span className="text-xs font-semibold text-[#f97316] uppercase tracking-wider">
                  Just Landed
                </span>
              </div>
              <h2 className="text-[28px] font-bold text-gray-900 font-heading tracking-tight">Fresh Arrivals</h2>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[#f97316] hover:text-[#ea580c] transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {publicProducts.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
              >
                <Link href={`/products/${encodeURIComponent(item.slug || item.id)}`}>
                  <div className="relative h-48 md:h-56 overflow-hidden bg-white p-4">
                    <span className="absolute top-3 left-3 z-10 bg-[#ea580c] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      NEW
                    </span>
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop"}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4 md:p-5 flex flex-col flex-1 border-t border-gray-50">
                  <div className="flex items-center gap-1 mb-2">
                    <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-[11px] font-medium text-gray-500">4.5</span>
                  </div>
                  <Link href={`/products/${encodeURIComponent(item.slug || item.id)}`}>
                    <h3 className="text-[15px] font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-gray-900">
                        ₹{item.price}
                      </span>
                      {item.mrp && item.mrp > item.price && (
                        <span className="text-[13px] text-gray-400 line-through">
                          ₹{item.mrp}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({ ...item, qty: 1 });
                        toast.success("Added to cart");
                      }}
                      className="w-9 h-9 rounded-md bg-[#fff7ed] text-[#ea580c] flex items-center justify-center hover:bg-[#ea580c] hover:text-white transition-colors"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Occasion Section */}
      {occasions.length > 0 && (
        <section className="py-16 bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-[28px] font-bold text-gray-900 mb-2 font-heading tracking-tight">Shop by Occasion</h2>
              <p className="text-[15px] text-gray-500 font-light max-w-lg mx-auto">
                Handpicked cracker sets for birthdays, weddings, festivals, and grand celebrations.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {occasions.map((col) => (
                <Link
                  key={col.id}
                  href="/products"
                  className="group relative h-52 md:h-64 rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={col.img}
                    alt={col.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                      <Sparkles size={14} className="text-white" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">
                        {col.subtitle}
                      </span>
                    </div>
                    <h3 className="text-base font-bold leading-tight">
                      {col.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="text-[28px] font-bold text-gray-900 mb-2 font-heading tracking-tight">What Our Customers Say</h2>
              <p className="text-[15px] text-gray-500 font-light max-w-lg mx-auto">
                Trusted by thousands of families across India for quality and reliable service.
              </p>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-[320px] md:min-w-[400px] shrink-0 snap-center">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 h-full relative">
                    <div className="absolute top-6 right-8 text-gray-200">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21L16.41 14.536C14.73 14.301 13.5 12.872 13.5 11.134C13.5 9.208 15.062 7.646 16.988 7.646C18.914 7.646 20.476 9.208 20.476 11.134C20.476 13.921 18.217 18.736 15.698 21H14.017ZM3.517 21L5.91 14.536C4.23 14.301 3 12.872 3 11.134C3 9.208 4.562 7.646 6.488 7.646C8.414 7.646 9.976 9.208 9.976 11.134C9.976 13.921 7.717 18.736 5.198 21H3.517Z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-[15px] mb-8 leading-relaxed font-medium">
                      &quot;{t.message}&quot;
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-[#fff7ed] text-[#ea580c] flex items-center justify-center text-sm font-bold border border-[#fed7aa]">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 font-medium">{t.location}</span>
                          <span className="text-[11px] text-green-600 flex items-center gap-1 font-bold">
                            <ShieldCheck size={12} /> Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-[#fff7ed] text-center border-t border-[#ffedd5]">
         <div className="max-w-2xl mx-auto px-4 md:px-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#ea580c] shadow-sm mb-6 border border-[#ffedd5]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900 font-heading tracking-tight">Stay Updated</h2>
            <p className="text-gray-500 mb-10 font-medium">Subscribe to receive exclusive offers, new arrivals, and festive deals.</p>
            <form className="flex w-full gap-3" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed successfully!"); }}>
               <input type="email" placeholder="Enter your email" required className="px-5 py-4 rounded-xl flex-1 text-gray-900 outline-none border border-gray-200 focus:border-[#ea580c] focus:ring-4 focus:ring-[#ea580c]/10 bg-white transition-all shadow-sm" />
               <button type="submit" className="bg-[#ea580c] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#c2410c] transition-colors shadow-sm shadow-[#ea580c]/20 flex items-center gap-2">
                 Subscribe <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
               </button>
            </form>
            <p className="text-xs text-gray-400 mt-4 font-medium">No spam, ever. Unsubscribe anytime.</p>
         </div>
      </section>
    </div>
  );
}
