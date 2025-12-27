import React, { useEffect, useState } from "react";
import { Star, ShoppingCart, Eye, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

export default function NewArrivalsPreview() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch latest 4 products
  useEffect(() => {
    const q = query(
      collection(db, "products"),
      orderBy("updatedAt", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(arr);
    });

    return unsubscribe;
  }, []);

  return (
    <section className="py-24 bg-white relative font-body">
      {/* Decor */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-50/50 rounded-full blur-[80px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px]"></div>

      <div className="container-custom mx-auto px-6 relative z-10">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-3 block">
            New Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-blue-950">
            Fresh <span className="text-red-600">Arrivals</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Be the first to experience our latest additions. Fresh stock,
            premium quality, and exciting new effects.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    NEW
                  </span>
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    className="bg-white text-blue-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-900 hover:text-white transition-all shadow-lg"
                    title="Quick View"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${item.id}`);
                    }}
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => addToCart({ ...item, qty: 1 })}
                    className="bg-white text-blue-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-xs font-bold text-slate-700">
                    {item.rating || 4.5}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-blue-950 mb-1 group-hover:text-red-600 transition-colors">
                  {item.name}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-red-600">
                        ₹{item.price}
                      </span>
                      {item.mrp && (
                        <span className="text-sm text-slate-400 line-through decoration-slate-300">
                          ₹{item.mrp}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/products")}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors group"
          >
            View All New Arrivals
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
