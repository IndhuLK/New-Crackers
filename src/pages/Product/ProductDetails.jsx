import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useCart } from "../../context/CartContext";
import { Heart, Share2, ShieldCheck, ShoppingCart, Truck, Star, ChevronRight, Minus, Plus, Zap } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState("");
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setProduct(data);
        setActiveImg(data.image);
        fetchRelated(data.category, data.id);
      }
    };
    fetchProduct();
    scrollTo(0, 0);
  }, [id]);

  const fetchRelated = async (category, currentId) => {
    const q = query(
      collection(db, "products"),
      where("category", "==", category)
    );
    const snap = await getDocs(q);
    const items = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.id !== currentId);

    setRelated(items.slice(0, 6));
  };

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const add = () => addToCart({ ...product, qty });

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium">Loading Product...</p>
      </div>
    </div>
  );

  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pt-24 pb-32 md:pb-20 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <span className="hover:text-blue-900 cursor-pointer transition-colors">Home</span>
          <ChevronRight size={14} className="mx-2 text-slate-400" />
          <span className="hover:text-blue-900 cursor-pointer transition-colors">Products</span>
          <ChevronRight size={14} className="mx-2 text-slate-400" />
          <span className="text-slate-900 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* LEFT COLUMN - IMAGES */}
          <div className="h-fit lg:sticky lg:top-28 space-y-6">
            <div className="relative group perspective-1000">
              <div className="aspect-[4/3] lg:aspect-square bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-white/50 relative z-10 transform transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 to-transparent opacity-50" />
                <img
                  src={activeImg}
                  className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-700 ease-out group-hover:scale-110"
                  alt={product.name}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-left duration-500 delay-100">
                      {discount}% OFF
                    </span>
                  )}
                  {product.tag && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-600/20 backdrop-blur-sm animate-in fade-in slide-in-from-left duration-500 delay-200">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-3">
                   {/*<button
                    onClick={() => setIsWishlist(!isWishlist)}
                    className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white hover:bg-white hover:scale-110 hover:shadow-md transition-all duration-300 group/btn"
                  >
                    <Heart
                      size={20}
                      className={`transition-all duration-300 ${isWishlist ? "fill-red-500 text-red-500 scale-110" : "text-slate-600 group-hover/btn:text-red-500"}`}
                    />
                  </button>*/}
                  <button className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white hover:bg-white hover:scale-110 hover:shadow-md transition-all duration-300 group/btn">
                    <Share2 size={20} className="text-slate-600 group-hover/btn:text-blue-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible">
              {[product.image, ...(product.images || [])].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`flex-shrink-0 w-20 lg:w-auto aspect-square rounded-xl bg-white border-2 overflow-hidden relative transition-all duration-300 ${activeImg === img
                      ? "border-red-500 shadow-md scale-105 ring-2 ring-red-100 ring-offset-2"
                      : "border-transparent hover:border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                >
                  <img src={img} className="w-full h-full object-cover p-1" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - DETAILS */}
          <div className="flex flex-col h-full">

            <div className="mb-6 animate-in slide-in-from-bottom duration-500">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                {product.productCode && (
                  <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                    Code: <strong>{product.productCode}</strong>
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                  <Star size={16} fill="currentColor" />
                  <span className="text-slate-800 font-bold">{product.rating || "4.8"}</span>
                  <span className="text-slate-400 ml-1">({product.reviewCount || 120} reviews)</span>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mb-8 animate-in slide-in-from-bottom duration-500 delay-100">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tighter">
                  ₹{product.price}
                </span>
                {product.mrp && (
                  <div className="flex flex-col leading-none pb-2">
                    <span className="text-slate-400 text-lg line-through font-medium">₹{product.mrp}</span>
                    <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                      SAVE ₹{product.mrp - product.price}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-px w-full bg-slate-100 my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Fast Delivery</p>
                    <p className="text-[10px] text-slate-500">2-4 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Quality Check</p>
                    <p className="text-[10px] text-slate-500">Certified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls (Hidden on Mobile) */}
            <div className="hidden md:flex flex-col sm:flex-row gap-4 mb-10 animate-in slide-in-from-bottom duration-500 delay-200">
              <div className="flex bg-white rounded-xl border border-slate-200 items-center p-1 w-fit shadow-sm">
                <button
                  onClick={dec}
                  className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-14 text-center font-bold text-xl text-slate-800">
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                onClick={add}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <ShoppingCart size={22} className="group-hover:animate-bounce-short" />
                Add to Cart
              </button>
            </div>


            {/* Info Tabs */}
            <div className="flex flex-col animate-in slide-in-from-bottom duration-500 delay-300">
              <div className="flex gap-8 border-b border-slate-200 mb-6 px-1">
                {["description", "highlights", "safety"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-4 text-sm font-bold uppercase tracking-wider relative transition-colors ${tab === t ? "text-red-600" : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    {t}
                    {tab === t && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full layout"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="text-slate-600 leading-relaxed min-h-[150px]">
                {tab === "description" && (
                  <p className="animate-in fade-in duration-300">
                    {product.description || "No detailed description available for this product."}
                  </p>
                )}
                {tab === "highlights" && (
                  <ul className="space-y-3 animate-in fade-in duration-300">
                    {product.highlights ? (
                      product.highlights.split(",").map((h, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center mt-0.5">
                            <Zap size={14} fill="currentColor" />
                          </span>
                          <span className="pt-0.5">{h.trim()}</span>
                        </li>
                      ))
                    ) : (
                      <li>No highlights available.</li>
                    )}
                  </ul>
                )}
                {tab === "safety" && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 animate-in fade-in duration-300">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-lg">
                      Safety Instructions
                    </h4>
                    <p className="text-amber-800/80 text-sm leading-relaxed">
                      {product.safety || "Always maintain a safe distance. Light fuses with care."}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-slate-200 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                You might also like
              </h2>
              <button className="text-red-600 font-bold hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm truncate mb-1 group-hover:text-red-600 transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-black">₹{p.price}</p>
                    {p.mrp && <p className="text-slate-400 text-xs line-through">₹{p.mrp}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 safe-area-bottom">
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col justify-center px-2">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">₹{product.price * qty}</span>
              {product.mrp && <span className="text-xs text-slate-400 line-through">₹{product.mrp * qty}</span>}
            </div>
          </div>

          {/* Mobile Qty */}
          <div className="flex items-center bg-slate-100 rounded-lg h-12 px-1">
            <button onClick={dec} className="w-8 h-full flex items-center justify-center text-slate-600 active:text-slate-900">
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-bold text-sm">{qty}</span>
            <button onClick={inc} className="w-8 h-full flex items-center justify-center text-slate-600 active:text-slate-900">
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={add}
            className="flex-1 bg-red-600 text-white font-bold rounded-xl h-12 shadow-lg shadow-red-600/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            ADD
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
