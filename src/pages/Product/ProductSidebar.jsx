import React, { useState } from "react";
import { Search, Check, Filter } from "lucide-react";

export default function ProductSidebar({
    categories,
    selectedCategories,
    onCategoryChange,
    products,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStockOnly,
    setInStockOnly,
    outOfStockOnly,
    setOutOfStockOnly
}) {
    const [catSearch, setCatSearch] = useState("");

    const getCategoryCount = (catName) => {
        return products.filter((p) => (p.category || "Others") === catName).length;
    };

    const filteredCategories = categories.filter((cat) =>
        cat.toLowerCase().includes(catSearch.toLowerCase())
    );

    return (
        <div className="w-full space-y-8 animate-in slide-in-from-left duration-700 p-6 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28">

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase tracking-widest text-xs font-bold">
                <Filter size={14} />
                <span>Filters</span>
            </div>

            {/* CATEGORIES WIDGET */}
            <div>
                <h3 className="text-lg font-black font-sans text-slate-800 mb-4 tracking-tight">Categories</h3>

                {/* Category Search */}
                <div className="relative mb-4 group">
                    <input
                        type="text"
                        placeholder="Find category..."
                        value={catSearch}
                        onChange={(e) => setCatSearch(e.target.value)}
                        className="w-full h-11 bg-slate-50/50 border border-slate-200/60 rounded-xl pl-10 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all duration-300"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                </div>

                {/* Category List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredCategories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center justify-between group cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all duration-200 ${selectedCategories.includes(cat)
                                    ? "bg-blue-600 border-blue-600 shadow-sm shadow-blue-200 scale-100"
                                    : "bg-white border-slate-300 group-hover:border-blue-300 scale-95 opacity-70 group-hover:opacity-100"
                                    }`}>
                                    {selectedCategories.includes(cat) && <Check size={12} className="text-white stroke-[4]" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => onCategoryChange(cat)}
                                />
                                <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? "text-slate-900 font-bold" : "text-slate-600 font-medium group-hover:text-blue-600"}`}>
                                    {cat}
                                </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${selectedCategories.includes(cat)
                                ? "bg-blue-50 text-blue-600"
                                : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                }`}>
                                {getCategoryCount(cat)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />

            {/* AVAILABILITY WIDGET */}
            <div>
                <h3 className="text-lg font-black font-sans text-slate-800 mb-4 tracking-tight">Availability</h3>
                <div className="space-y-2">
                    <label className="flex items-center justify-between group cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all duration-200 ${inStockOnly
                                ? "bg-blue-600 border-blue-600 shadow-sm shadow-blue-200"
                                : "bg-white border-slate-300 group-hover:border-blue-300"
                                }`}>
                                {inStockOnly && <Check size={12} className="text-white stroke-[4]" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                            />
                            <span className={`text-sm transition-colors ${inStockOnly ? "text-slate-900 font-bold" : "text-slate-600 font-medium group-hover:text-blue-600"}`}>
                                In Stock
                            </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 group-hover:bg-slate-200 transition-colors">
                            {products.filter(p => p.stock > 0).length}
                        </span>
                    </label>

                    <label className="flex items-center justify-between group cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all duration-200 ${outOfStockOnly
                                ? "bg-blue-600 border-blue-600 shadow-sm shadow-blue-200"
                                : "bg-white border-slate-300 group-hover:border-blue-300"
                                }`}>
                                {outOfStockOnly && <Check size={12} className="text-white stroke-[4]" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={outOfStockOnly}
                                onChange={(e) => setOutOfStockOnly(e.target.checked)}
                            />
                            <span className={`text-sm transition-colors ${outOfStockOnly ? "text-slate-900 font-bold" : "text-slate-600 font-medium group-hover:text-blue-600"}`}>
                                Out of Stock
                            </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 group-hover:bg-slate-200 transition-colors">
                            {products.filter(p => !p.stock || p.stock <= 0).length}
                        </span>
                    </label>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />

            {/* PRICE WIDGET */}
            <div>
                <h3 className="text-lg font-black font-sans text-slate-800 mb-4 tracking-tight">Price Range</h3>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-lg pl-6 pr-2 text-center text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <span className="text-slate-300 font-bold">-</span>
                    <div className="relative flex-1 group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-lg pl-6 pr-2 text-center text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
