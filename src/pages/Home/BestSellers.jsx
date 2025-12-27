import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingCart, ArrowRight, Star, Sparkles } from "lucide-react";

import { useProducts } from "../../admin/ProductContext";

export default function BestSellers() {
  const { products, loading } = useProducts();
  const { cart, addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const isInCart = (id) => cart.some((item) => item.id === id);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="animate-spin-slow w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium tracking-wide">Curating best sellers...</p>
      </div>
    );
  }

  // ⭐ Pick latest 6 products as Best Sellers
  const bestSellers = [...products].reverse().slice(0, 6);

  const goToProducts = () => {
    navigate("/products");
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-28 bg-[#fafafa] relative overflow-hidden font-body">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="container-custom mx-auto px-6 relative z-10">

        {/* Header - Minimalist & Centered */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-8 bg-black/20"></span>
            <span className="text-xs font-bold tracking-[0.25em] text-black/60 uppercase">Customer Favorites</span>
            <span className="h-px w-8 bg-black/20"></span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6 font-heading tracking-tight">
            Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Sellers</span>
          </h2>
          <p className="text-slate-500 text-lg font-light leading-relaxed">
            Discover the crackers that light up celebrations everywhere.
            Selected for their brilliance, performance, and crowd appeal.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Custom Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden md:flex absolute top-1/2 -left-12 z-20 w-12 h-12 rounded-full bg-white border border-slate-100 items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all duration-300 shadow-sm hover:shadow-lg -translate-y-1/2 group"
          >
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute top-1/2 -right-12 z-20 w-12 h-12 rounded-full bg-white border border-slate-100 items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all duration-300 shadow-sm hover:shadow-lg -translate-y-1/2 group"
          >
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Pagination, Autoplay, Navigation]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={40}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 40 },
              1280: { slidesPerView: 4, spaceBetween: 40 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-20 !px-4 category-swiper"
          >
            {bestSellers.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <div
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group bg-white rounded-3xl p-4 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-transparent hover:border-black/5 h-full flex flex-col"
                >

                  {/* Image Area */}
                  <div className="relative h-[280px] rounded-2xl overflow-hidden bg-slate-50 mb-6">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                      {product.discount && (
                        <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                      <Heart
                        size={18}
                        className={`transition-colors duration-300 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-black hover:text-red-500"}`}
                      />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                    />

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ ...product, qty: 1 });
                        }}
                        disabled={isInCart(product.id)}
                        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg transition-all ${isInCart(product.id)
                            ? "bg-green-600 text-white"
                            : "bg-white text-black hover:bg-black hover:text-white"
                          }`}
                      >
                        {isInCart(product.id) ? (
                          <>Added to Cart</>
                        ) : (
                          <>
                            <ShoppingCart size={16} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 px-2">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{product.category}</p>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-orange-400 text-orange-400" />
                        <span className="text-xs font-medium text-slate-500">4.8</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-black mb-1 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">{product.name}</h3>

                    <div className="mt-auto pt-4 flex items-baseline gap-3 border-t border-slate-100">
                      <span className="text-xl font-bold text-black font-heading">₹{product.price}</span>
                      {product.mrp && (
                        <span className="text-sm text-slate-400 line-through">₹{product.mrp}</span>
                      )}
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={goToProducts}
            className="inline-flex items-center gap-2 border-b border-black pb-1 text-black font-semibold hover:text-orange-600 hover:border-orange-600 transition-all duration-300 text-lg group"
          >
            Explore All Products
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
