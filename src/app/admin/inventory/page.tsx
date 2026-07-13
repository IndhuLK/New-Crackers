"use client";

import { useProducts } from '@/context/ProductContext';
import { PlusSquare, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

export default function AdminInventoryPage() {
  const { products, categories, loading, updateProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [addQuantities, setAddQuantities] = useState<Record<string, string>>({});

  const handleAddStock = async (product: any) => {
    const qty = parseInt(addQuantities[product.id] || "0");
    if (isNaN(qty) || qty === 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    
    try {
      const newStock = (product.stock || 0) + qty;
      await updateProduct(product.id, { stock: newStock });
      setAddQuantities(prev => ({ ...prev, [product.id]: "" }));
      toast.success(`Added ${qty} stock to ${product.name}`);
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const uniqueCategories = useMemo(() => {
    return categories.map(cat => cat.name);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.productCode?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  // Calculate Stats
  const stats = useMemo(() => {
    let totalStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalValue = 0;

    products.forEach(p => {
      const stock = p.stock || 0;
      totalStock += stock;
      if (stock === 0 || p.outOfStock) outOfStock++;
      else if (stock > 0 && stock < 20) lowStock++; // Assuming < 20 is low stock
      
      totalValue += stock * (p.price || 0);
    });

    return { totalStock, lowStock, outOfStock, totalValue };
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div>
        <h1 className="text-xl font-bold text-[#0f172a] tracking-tight leading-none mb-2">Inventory Management</h1>
        <p className="text-gray-400 text-[13px]">Manage stock levels and monitor product availability</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">TOTAL STOCK</p>
          <h3 className="text-[22px] font-bold text-[#1e293b]">{stats.totalStock.toLocaleString()}</h3>
        </div>
        
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">LOW STOCK ITEMS</p>
          <h3 className="text-[22px] font-bold text-[#f97316]">{stats.lowStock}</h3>
        </div>

        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">OUT OF STOCK</p>
          <h3 className="text-[22px] font-bold text-[#ef4444]">{stats.outOfStock}</h3>
        </div>

        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">TOTAL STOCK VALUE</p>
          <h3 className="text-[22px] font-bold text-[#0ea5e9]">₹{stats.totalValue.toLocaleString()}</h3>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">SEARCH PRODUCT</label>
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc] transition-colors placeholder:text-gray-400 bg-white"
          />
        </div>
        
        <div className="w-full md:w-64 shrink-0">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">FILTER BY CATEGORY</label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc] transition-colors bg-white text-gray-600"
          >
            <option value="All Categories">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-[#0066cc]" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-gray-100">PRODUCT NAME</th>
                  <th className="px-6 py-4 border-b border-gray-100">SKU</th>
                  <th className="px-6 py-4 border-b border-gray-100">CATEGORY</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-center">CURRENT STOCK</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-center">NEW STOCK</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {filteredProducts.map((product) => {
                  const sku = product.productCode || `SKU-${product.id.substring(0,6).toUpperCase()}`;
                  const stock = product.stock || 0;
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <span className="text-[#0f172a] text-[13px]">{product.name}</span>
                          <span className="text-gray-400 text-[11px] mt-0.5">{sku}</span>
                        </div>
                      </td>

                      <td className="px-6 py-3">
                        <span className="text-gray-400 font-mono text-[11px] uppercase tracking-wider">{sku}</span>
                      </td>

                      <td className="px-6 py-3">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-center">
                        <span className="bg-[#ecfdf5] text-[#10b981] px-3 py-1 rounded font-bold text-[12px]">
                          {stock}
                        </span>
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex justify-center">
                          <input 
                            type="number" 
                            placeholder="Add qty"
                            value={addQuantities[product.id] || ""}
                            onChange={(e) => setAddQuantities(prev => ({ ...prev, [product.id]: e.target.value }))}
                            className="w-24 px-3 py-1.5 border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc] text-center"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end">
                          <button 
                            onClick={() => handleAddStock(product)}
                            className="flex items-center justify-center gap-1.5 bg-[#0066cc] hover:bg-[#0052a3] text-white px-4 py-1.5 rounded font-medium text-[12px] transition-colors"
                          >
                            <PlusSquare size={14} /> Add
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
                {filteredProducts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-[13px]">
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
