import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Pencil,
  Search,
  Plus,
  Filter,
  Package,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { doc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useProducts } from "./ProductContext";

const ProductsList = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      const list = snap.docs.map((d) => d.data().name);
      setCategories(list);
    });
    return () => unsub();
  }, []);

  const handleEdit = (product) => {
    navigate("/admin/add-product", {
      state: { editingProduct: product }
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const byCategory = selectedCategory ? p.category === selectedCategory : true;
    const bySearch = searchText
      ? p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.productCode?.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return byCategory && bySearch;
  });

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-32 animate-in fade-in duration-700 relative overflow-hidden">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-4 pt-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg flex items-center gap-2">
            <Package size={20} className="text-purple-500" />
            Manage your inventory and stock levels.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Stats Pill */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Items</span>
              <span className="text-xl font-black text-slate-900 leading-none">{products.length}</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Categories</span>
              <span className="text-xl font-black text-slate-900 leading-none">{categories.length}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-product")}
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Glass Command Bar */}
      <div className="sticky top-[85px] z-30 px-4 mb-8">
        <div className="bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white/60 flex flex-col lg:flex-row gap-2 transition-all">

          <div className="relative flex-[2] group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-focus-within:text-purple-600 group-focus-within:scale-110 transition-all">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products by name, code..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-14 bg-slate-50/50 border-2 border-transparent pl-16 rounded-[1.5rem] outline-none text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-purple-100 focus:shadow-lg transition-all"
            />
          </div>

          <div className="flex flex-1 gap-2">
            <div className="relative w-full group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                <Filter size={18} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-14 bg-slate-50/50 border-2 border-transparent pl-12 pr-10 rounded-[1.5rem] outline-none text-slate-700 font-bold cursor-pointer focus:bg-white focus:border-purple-100 focus:shadow-lg transition-all appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={24} className="text-purple-300" />
            </div>
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">Loading Inventory...</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && (
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white/40 backdrop-blur-md rounded-[2rem] p-4 border border-white/60 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-slate-50 mb-4 group-hover:shadow-inner isolate">
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black pk-2 py-1 rounded-lg uppercase tracking-wider shadow-sm border border-white/50 px-2">
                    {product.productCode}
                  </span>
                </div>

                {product.outOfStock && (
                  <div className="absolute top-3 right-3 z-10 bg-red-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide backdrop-blur-sm shadow-red-500/20 shadow-lg border border-red-400/50">
                    Out of Stock
                  </div>
                )}

                {/* Floating Actions (Appear on Hover) */}
                <div className="absolute bottom-3 right-3 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-3 bg-white text-slate-900 rounded-xl hover:bg-purple-500 hover:text-white transition-colors shadow-lg"
                    title="Edit Product"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-2 pb-2 flex flex-col flex-1">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag size={12} className="text-purple-500" />
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{product.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-purple-900 transition-colors line-clamp-2" title={product.name}>
                    {product.name}
                  </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100/50 flex items-end justify-between">
                  <div>
                    {Number(product.mrp) > Number(product.price) && (
                      <p className="text-xs font-bold text-slate-400 line-through decoration-red-400/50">₹{Number(product.mrp).toLocaleString()}</p>
                    )}
                    <p className="text-2xl font-black text-slate-900 tracking-tight">₹{Number(product.price).toLocaleString()}</p>
                  </div>

                  {/* Decorative Icon */}
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-purple-50 group-hover:text-purple-500 transition-colors">
                    <ShoppingBag size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="mx-4 flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 text-center animate-in zoom-in-95">
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-100 to-white rounded-full flex items-center justify-center shadow-xl shadow-purple-100 mb-6">
            <Sparkles size={40} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">No Products Found</h2>
          <p className="text-slate-500 font-medium max-w-xs mx-auto mb-8">
            We couldn't find any products matching your search or filters.
          </p>
          <button
            onClick={() => { setSearchText(""); setSelectedCategory(""); }}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductsList;