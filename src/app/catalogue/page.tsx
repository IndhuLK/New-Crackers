"use client";

import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';

export default function CataloguePage() {
  const { categories, products, loading } = useProducts();

  const publicProducts = products.filter(p => !p.isHidden);

  const categoriesWithCounts = categories.map(cat => {
    const categoryProducts = publicProducts.filter(p => p.category === cat.name);
    const count = categoryProducts.length;
    const displayImage = cat.img || cat.image || categoryProducts.find(p => p.image)?.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop";
    return { ...cat, count, displayImage };
  });

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Our <span className="text-[#ea580c]">Catalogue</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Explore our wide variety of premium, certified crackers sorted by category for your convenience.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-[#ea580c] w-12 h-12" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoriesWithCounts.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
                >
                  <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden p-6 relative">
                    <img 
                      src={category.displayImage} 
                      alt={category.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                  </div>
                  
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#ea580c] transition-colors">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{category.count} Products</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
