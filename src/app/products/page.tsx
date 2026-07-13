"use client";
import { Search, Heart, ShoppingCart, Loader2, Minus, Plus, LayoutGrid, List, Filter, X } from 'lucide-react';
import { useProducts, Product } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Extracted ProductCard component to manage its own quantity state
function ProductCard({ product, viewMode }: { product: Product, viewMode: "grid" | "list" }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const outOfStock = (product.stock !== undefined && product.stock !== null && product.stock <= 0) || product.outOfStock;
  
  let discountPercentage = 0;
  if (product.mrp && product.mrp > product.price && product.price > 0) {
    discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  }

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart({ ...product, qty });
    setQty(1); // Reset after adding
  };

  if (viewMode === "list") {
    return (
      <div 
        className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row items-center p-3 gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full sm:w-28 h-32 sm:h-28 shrink-0 bg-white border border-gray-50 rounded flex items-center justify-center">
          {discountPercentage > 0 && (
            <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider z-10">
              {discountPercentage}% OFF
            </div>
          )}
          <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`} className="w-full h-full flex items-center justify-center p-2">
            <img 
              src={product.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop"} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <span className="bg-gray-900 text-white px-2 py-0.5 text-[10px] font-semibold rounded shadow">
                SOLD OUT
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
            <span className="text-[10px] font-bold text-gray-600 flex items-center"><span className="text-[#fbbf24] mr-0.5">★</span> 4.8</span>
          </div>
          <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`}>
            <h3 className="text-[14px] font-bold text-gray-900 mb-1 hover:text-[#ea580c] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2 mt-1">
            {product.price > 0 ? (
              <>
                <span className="text-[15px] font-bold text-gray-900">₹{product.price}</span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-[12px] text-gray-400 line-through">₹{product.mrp}</span>
                )}
              </>
            ) : (
              <span className="text-[12px] font-medium text-gray-500">Price Unavailable</span>
            )}
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center gap-2 w-full sm:w-32 shrink-0">
          <div className="flex items-center border border-gray-200 rounded h-8 w-full">
            <button 
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l transition-colors"
              disabled={outOfStock}
            >
              <Minus size={12} />
            </button>
            <span className="flex-1 text-center text-[12px] font-semibold text-gray-900">
              {qty}
            </span>
            <button 
              onClick={() => setQty(qty + 1)}
              className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r transition-colors"
              disabled={outOfStock}
            >
              <Plus size={12} />
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`w-full h-8 rounded flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all ${
              outOfStock 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-[#ea580c]"
            }`}
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Section */}
      <div className="relative h-40 p-4 flex items-center justify-center bg-white border-b border-gray-50 shrink-0">
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider z-10">
            {discountPercentage}% OFF
          </div>
        )}
        <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors z-10 p-1">
          <Heart size={16} fill={isHovered ? "none" : "none"} />
        </button>

        <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop"} 
            alt={product.name} 
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <span className="bg-gray-900 text-white px-2 py-0.5 text-[11px] font-semibold rounded shadow">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Bottom Content Section */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider line-clamp-1 pr-1">{product.category}</span>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-600 shrink-0">
              <span className="text-[#fbbf24]">★</span> 4.8
            </div>
          </div>

          <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`}>
            <h3 className="text-[13px] font-bold text-gray-900 mb-1.5 hover:text-[#ea580c] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5 mb-3">
            {product.price > 0 ? (
              <>
                <span className="text-[14px] font-bold text-gray-900">₹{product.price}</span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-[11px] text-gray-400 line-through">₹{product.mrp}</span>
                )}
              </>
            ) : (
              <span className="text-[12px] font-medium text-gray-500">Price Unavailable</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center border border-gray-200 rounded h-8">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l transition-colors"
                disabled={outOfStock}
              >
                <Minus size={12} />
              </button>
              <span className="flex-1 text-center text-[12px] font-semibold text-gray-900">
                {qty}
              </span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r transition-colors"
                disabled={outOfStock}
              >
                <Plus size={12} />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`w-full h-8 rounded flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all ${
                outOfStock 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-900 text-white hover:bg-[#ea580c]"
              }`}
            >
              <ShoppingCart size={12} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const { products, categories, loading } = useProducts();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("Default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Find matching category (case-insensitive)
      const matchedCategory = categories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase());
      if (matchedCategory && !selectedCategories.includes(matchedCategory.name)) {
        setSelectedCategories([matchedCategory.name]);
      }
    }
  }, [searchParams, categories]);

  const categoriesWithCounts = useMemo(() => {
    const publicProducts = products.filter(p => !p.isHidden);
    return categories.map(cat => {
      const count = publicProducts.filter(p => p.category === cat.name).length;
      return { name: cat.name, count };
    });
  }, [categories, products]);

  const filteredCategories = categoriesWithCounts.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = useMemo(() => {
    const publicProducts = products.filter(p => !p.isHidden);
    let result = [...publicProducts];

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (inStockOnly) {
      result = result.filter(p => p.stock === undefined || p.stock === null || p.stock > 0);
    }
    if (outOfStockOnly) {
      result = result.filter(p => p.stock !== undefined && p.stock !== null && p.stock <= 0);
    }

    if (minPrice) {
      result = result.filter(p => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= parseInt(maxPrice));
    }

    if (sortOrder === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "Alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategories, inStockOnly, outOfStockOnly, minPrice, maxPrice, sortOrder]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    
    // Sort the groups based on the global categories sort order
    return categories
      .filter(cat => groups[cat.name] && groups[cat.name].length > 0)
      .map(cat => ({
        category: cat.name,
        products: groups[cat.name]
      }));
  }, [filteredProducts, categories]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#ea580c]" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Top Banner */}
      <div className="bg-white border-b border-gray-100 pt-16 pb-6 mb-6">
        <div className="w-full px-4 md:px-8 xl:px-12 max-w-[2000px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Our Collection</h1>
          <p className="text-gray-500 text-[13px] md:text-[14px]">Explore our curated range of high-quality crackers and fireworks.</p>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 xl:px-12 max-w-[2000px] mx-auto pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black/50 z-[100] lg:hidden" onClick={() => setIsMobileFilterOpen(false)} />
          )}
          <aside className={`
            fixed inset-y-0 left-0 z-[101] w-[280px] bg-white overflow-y-auto transform transition-transform duration-300 ease-in-out p-6 shadow-2xl
            ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:w-[240px] xl:w-[260px] lg:p-0 lg:bg-transparent lg:shadow-none lg:z-auto lg:shrink-0 lg:self-start lg:sticky lg:top-24
          `}>
            
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-[#0f172a] uppercase tracking-wide mb-2">Category</h3>
              <hr className="border-gray-100 mb-3" />
              
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded text-[13px] text-gray-600 outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-3">
                {filteredCategories.map(cat => (
                  <label key={cat.name} className="flex items-start justify-between group cursor-pointer gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="relative flex items-center mt-0.5 shrink-0">
                        <input 
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() => toggleCategory(cat.name)}
                          className="peer appearance-none w-3.5 h-3.5 bg-white border border-gray-400 rounded-[2px] checked:bg-white checked:border-gray-400 transition-colors cursor-pointer"
                        />
                        <svg className="absolute w-2.5 h-2.5 text-gray-700 left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={`text-[13px] leading-snug break-words transition-colors ${selectedCategories.includes(cat.name) ? "text-[#0f172a]" : "text-slate-600 group-hover:text-slate-900"}`}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[12px] text-gray-400 shrink-0 mt-0.5">({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-[#0f172a] uppercase tracking-wide mb-2">Availability</h3>
              <hr className="border-gray-100 mb-3" />
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center shrink-0">
                    <input 
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="peer appearance-none w-3.5 h-3.5 bg-white border border-gray-400 rounded-[2px] checked:bg-white checked:border-gray-400 transition-colors cursor-pointer"
                    />
                    <svg className="absolute w-2.5 h-2.5 text-gray-700 left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-slate-600 group-hover:text-slate-900">In Stock</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center shrink-0">
                    <input 
                      type="checkbox"
                      checked={outOfStockOnly}
                      onChange={(e) => setOutOfStockOnly(e.target.checked)}
                      className="peer appearance-none w-3.5 h-3.5 bg-white border border-gray-400 rounded-[2px] checked:bg-white checked:border-gray-400 transition-colors cursor-pointer"
                    />
                    <svg className="absolute w-2.5 h-2.5 text-gray-700 left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-slate-600 group-hover:text-slate-900">Out of Stock</span>
                </label>
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-[#0f172a] uppercase tracking-wide mb-2">Price</h3>
              <hr className="border-gray-100 mb-3" />
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1.5 text-gray-400 text-[13px]">₹</span>
                  <input 
                    type="number" 
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 bg-white border border-gray-300 rounded text-[13px] text-gray-600 outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <span className="text-gray-300">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1.5 text-gray-400 text-[13px]">₹</span>
                  <input 
                    type="number" 
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 bg-white border border-gray-300 rounded text-[13px] text-gray-600 outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 shadow-sm">
              <p className="text-[14px] text-gray-900">
                <strong className="font-bold">{filteredProducts.length}</strong> <span className="text-gray-500">products found</span>
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-1.5 text-[13px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  <Filter size={16} /> Filters
                </button>
                <div className="flex items-center gap-1 border-l lg:border-l-0 border-r border-gray-200 pl-3 lg:pl-0 pr-3">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded ${viewMode === "grid" ? "text-gray-900 bg-gray-100" : "text-gray-400 hover:text-gray-900"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded ${viewMode === "list" ? "text-gray-900 bg-gray-100" : "text-gray-400 hover:text-gray-900"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-500">Sort:</span>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="text-[13px] font-medium text-gray-900 border border-gray-200 rounded px-2 py-1 outline-none bg-transparent cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    <option value="Default">Default</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Alphabetical">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Groups */}
            {groupedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-[14px]">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setCategorySearch("");
                    setInStockOnly(false);
                    setOutOfStockOnly(false);
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="mt-6 text-[#ea580c] font-bold text-[14px] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {groupedProducts.map(group => (
                  <div key={group.category} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                      <h2 className="text-[17px] font-extrabold text-gray-900 uppercase tracking-tight">{group.category}</h2>
                      <span className="text-[10px] font-bold px-2 py-1 bg-gray-50 border border-gray-100 rounded text-gray-500 uppercase tracking-wider">
                        {group.products.length} ITEMS
                      </span>
                    </div>
                    <div className={`p-4 bg-[#fcfdfd] ${
                      viewMode === "grid" 
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4" 
                        : "flex flex-col gap-3"
                    }`}>
                      {group.products.map(product => (
                        <ProductCard key={product.id} product={product} viewMode={viewMode} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#ea580c] w-8 h-8" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
