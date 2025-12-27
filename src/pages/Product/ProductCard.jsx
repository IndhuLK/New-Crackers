import { Star, ShoppingCart, Eye, Heart, Package } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const isAvailable = !product.outOfStock;
  const originalPrice = product.mrp || null;
  const sellingPrice = product.price || null;

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  const { addToCart, cart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isInCart = cart.some((item) => item.id === product.id);

  const inc = (e) => {
    e.stopPropagation();
    setQty((p) => p + 1);
  };

  const dec = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty((p) => p - 1);
  };

  const add = (e) => {
    e.stopPropagation();
    addToCart({ ...product, qty });
    setQty(1);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      {discountPercent > 0 && (
        <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
          -{discountPercent}%
        </span>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-4 right-4 z-20 p-2 rounded-full ${
          isInWishlist(product.id)
            ? "bg-red-50 text-red-600"
            : "bg-white text-slate-400 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        <Heart size={18} className={isInWishlist(product.id) ? "fill-current" : ""} />
      </button>

      <div
        className="relative h-56 overflow-hidden bg-slate-50 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="bg-white text-blue-900 w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-blue-900 hover:text-white"
          >
            <Eye size={20} />
          </button>
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-slate-800 text-white px-4 py-1 rounded-full text-xs font-bold">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span className="text-xs font-semibold text-slate-500">4.8 (120)</span>
        </div>

        <h3
          onClick={() => navigate(`/product/${product.id}`)}
          className="font-bold text-blue-950 text-lg mb-2 line-clamp-2 cursor-pointer hover:text-red-600"
        >
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400">Price</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600">₹{sellingPrice}</span>
                {originalPrice && (
                  <span className="text-sm text-slate-400 line-through">₹{originalPrice}</span>
                )}
              </div>
            </div>

            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                isAvailable ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
              }`}
            >
              <Package size={14} />
              <span className="text-[10px] font-bold">
                {isAvailable ? "IN STOCK" : "SOLD OUT"}
              </span>
            </div>
          </div>

          {isAvailable ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 rounded-lg h-10 border">
                <button onClick={dec} className="w-8 font-bold hover:bg-slate-300 text-slate-500">
                  −
                </button>
                <span className="w-8 text-center font-bold text-blue-900">{qty}</span>
                <button onClick={inc} className="w-8 font-bold hover:bg-slate-300 text-slate-500">
                  +
                </button>
              </div>

              <button
                onClick={add}
                disabled={isInCart}
                className={`flex-1 h-10 rounded-lg font-bold flex items-center justify-center gap-2 ${
                  isInCart ? "bg-green-600 text-white" : "bg-blue-900 text-white hover:bg-red-600"
                }`}
              >
                <ShoppingCart size={18} />
                {isInCart ? "Added" : "Add"}
              </button>
            </div>
          ) : (
            <button disabled className="w-full h-10 bg-slate-100 text-slate-400 rounded-lg font-bold">
              Notify Me
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
