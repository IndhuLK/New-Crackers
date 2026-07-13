"use client";

import { useProducts } from '@/context/ProductContext';
import { Loader2, Plus, Edit2, Trash2, Search, Eye, EyeOff, ArrowUp, ArrowDown, Filter, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function AdminProductsPage() {
  const { products, loading, deleteProduct, updateProductOrder, updateProduct, categories } = useProducts();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOption, setSortOption] = useState("Default Sort");

  const filteredProducts = useMemo(() => {
    let prods = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.productCode && p.productCode.toLowerCase().includes(search.toLowerCase()))
    );
    if (categoryFilter !== "All Categories") {
      prods = prods.filter(p => p.category === categoryFilter);
    }
    return prods;
  }, [products, search, categoryFilter]);

  const uniqueCategories = useMemo(() => {
    return new Set(products.map(p => p.category)).size;
  }, [products]);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (categoryFilter === "All Categories") {
      alert("Please select a specific category from the dropdown to reorder products.");
      return;
    }
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === filteredProducts.length - 1) return;

    const newProds = [...filteredProducts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newProds[index];
    newProds[index] = newProds[targetIndex];
    newProds[targetIndex] = temp;

    await updateProductOrder(newProds);
  };

  const handleSortChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
    
    if (categoryFilter === "All Categories" && sortValue !== "Default Sort") {
      alert("Please select a specific category first to sort products.");
      setSortOption("Default Sort");
      return;
    }
    
    if (sortValue === "Default Sort") return;
    
    let newProds = [...filteredProducts];
    if (sortValue === "Name (A-Z)") {
      newProds.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "Name (Z-A)") {
      newProds.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortValue === "Price (Low-High)") {
      newProds.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortValue === "Price (High-Low)") {
      newProds.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    await updateProductOrder(newProds);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">Products</h1>
          <p className="text-gray-400 text-[13px]">{products.length} items · {uniqueCategories} categories</p>
        </div>
        <Link href="/admin/add-product" className="px-4 py-2 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors flex items-center gap-2 shadow-sm shrink-0">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 bg-white">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc] transition-colors placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSortOption("Default Sort");
              }}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 bg-white outline-none focus:border-[#0066cc]"
            >
              <option value="All Categories">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 bg-white outline-none focus:border-[#0066cc]"
            >
              <option value="Default Sort">Default Sort</option>
              <option value="Name (A-Z)">Name (A-Z)</option>
              <option value="Name (Z-A)">Name (Z-A)</option>
              <option value="Price (Low-High)">Price (Low-High)</option>
              <option value="Price (High-Low)">Price (High-Low)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-[#0066cc]" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-3 sm:px-5 py-4 border-b border-gray-100">Product</th>
                  <th className="hidden md:table-cell px-5 py-4 border-b border-gray-100 text-center">Sort</th>
                  <th className="hidden md:table-cell px-5 py-4 border-b border-gray-100">SKU</th>
                  <th className="hidden md:table-cell px-5 py-4 border-b border-gray-100">Category</th>
                  <th className="hidden lg:table-cell px-5 py-4 border-b border-gray-100 text-right">MRP</th>
                  <th className="hidden sm:table-cell px-5 py-4 border-b border-gray-100 text-right">Price</th>
                  <th className="hidden lg:table-cell px-5 py-4 border-b border-gray-100">Status</th>
                  <th className="px-3 sm:px-5 py-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {filteredProducts.map((product) => {
                  const isOutOfStock = (product.stock !== undefined && product.stock !== null && product.stock <= 0) || product.outOfStock;
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      
                      <td className="px-3 sm:px-5 py-3 w-full max-w-0">
                        <div className="flex items-center gap-3 sm:gap-4 w-full">
                          <div className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                            <img src={product.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop"} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#0f172a] text-[13px] truncate" title={product.name}>{product.name}</span>
                            <span className="text-gray-400 text-[11px] sm:hidden truncate">{product.category}</span>
                            <span className="text-[#0f172a] font-bold text-[12px] sm:hidden">₹{product.price}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="hidden md:table-cell px-5 py-3 text-center">
                        <div className="flex flex-col items-center gap-1 text-gray-300">
                          <button 
                            onClick={() => handleMove(filteredProducts.indexOf(product), 'up')}
                            disabled={filteredProducts.indexOf(product) === 0 || categoryFilter === "All Categories"}
                            className="hover:text-[#0066cc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={categoryFilter === "All Categories" ? "Select a category to sort" : "Move Up"}
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button 
                            onClick={() => handleMove(filteredProducts.indexOf(product), 'down')}
                            disabled={filteredProducts.indexOf(product) === filteredProducts.length - 1 || categoryFilter === "All Categories"}
                            className="hover:text-[#0066cc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={categoryFilter === "All Categories" ? "Select a category to sort" : "Move Down"}
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </td>

                      <td className="hidden md:table-cell px-5 py-3">
                        <span className="text-gray-400 font-mono text-[12px]">{product.productCode || `SKU-${product.id.substring(0,6).toUpperCase()}`}</span>
                      </td>

                      <td className="hidden md:table-cell px-5 py-3">
                        <span className="text-gray-500 text-[13px]">{product.category}</span>
                      </td>

                      <td className="hidden lg:table-cell px-5 py-3 text-right">
                        <span className={`text-[13px] ${product.mrp && product.mrp > 0 ? "text-gray-400 line-through" : "text-gray-300"}`}>
                          ₹{product.mrp || 0}
                        </span>
                      </td>

                      <td className="hidden sm:table-cell px-5 py-3 text-right font-bold text-[#0f172a]">
                        ₹{product.price}
                      </td>

                      <td className="hidden lg:table-cell px-5 py-3">
                        {product.isHidden ? (
                          <span className="px-2 py-1 rounded text-[11px] font-medium border bg-gray-100 text-gray-600 border-gray-200">
                            Hidden
                          </span>
                        ) : (
                          <span className={`px-2 py-1 rounded text-[11px] font-medium border ${
                            isOutOfStock 
                              ? 'bg-red-50 text-red-700 border-red-100' 
                              : 'bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]'
                          }`}>
                            {isOutOfStock ? 'Out of Stock' : 'Active'}
                          </span>
                        )}
                      </td>

                      <td className="px-3 sm:px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-3 transition-opacity">
                          <button 
                            onClick={() => updateProduct(product.id, { isHidden: !product.isHidden })}
                            className={`${product.isHidden ? 'text-gray-400 hover:text-[#0066cc]' : 'text-[#0066cc] hover:text-gray-400'} transition-colors p-1`} 
                            title={product.isHidden ? "Show on storefront" : "Hide from storefront"}
                          >
                            {product.isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <Link href={`/admin/edit-product/${product.id}`} className="text-gray-400 hover:text-gray-700 transition-colors p-1" title="Edit">
                            <Edit2 size={15} />
                          </Link>
                          <button 
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
                {filteredProducts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-500 text-[13px]">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
