"use client";
import React, { useState } from "react";
import { X, Minus, Plus, Trash2, Phone, MapPin, User, Truck, Building2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const shipping = subtotal > 0 ? (subtotal > 3000 ? 0 : 250) : 0;
  const total = subtotal + shipping;

  const isFormValid =
    customer.name.trim() &&
    customer.phone.trim().length >= 10 &&
    customer.city.trim() &&
    customer.pincode.trim() &&
    customer.address.trim();

  const handleCheckout = async () => {
    if (!isFormValid || cart.length === 0) return;

    try {
      const orderData = {
        customer,
        products: cart,
        subtotal,
        shipping,
        total,
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "orders"), orderData);

      let message = `*New Order Request*%0A%0A`;
      message += `*Customer Details:*%0A`;
      message += `Name: ${customer.name}%0A`;
      message += `Phone: ${customer.phone}%0A`;
      message += `Address: ${customer.address}, ${customer.city} - ${customer.pincode}%0A%0A`;
      message += `*Order Summary:*%0A`;

      cart.forEach((item) => {
        message += `${item.name} x ${item.qty} - ₹${item.price * (item.qty || 1)}%0A`;
      });

      message += `%0ASubtotal: ₹${subtotal}%0A`;
      message += `Shipping: ₹${shipping}%0A`;
      message += `*Grand Total: ₹${total}*%0A`;

      const whatsappUrl = `https://wa.me/919791906961?text=${message}`;

      clearCart();
      setIsCartOpen(false);
      window.open(whatsappUrl, "_blank");

    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-gray-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Your Cart
            <span className="bg-[#ea580c] text-white text-xs px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-[#ea580c] text-sm font-semibold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-[#ea580c] font-bold text-sm mt-0.5">₹{item.price}</p>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center bg-gray-100 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, (item.qty || 1) - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-[#ea580c] hover:bg-gray-200 rounded-l-md transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900">
                            {item.qty || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.qty || 1) + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-[#ea580c] hover:bg-gray-200 rounded-r-md transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Truck size={16} className="text-[#ea580c]" />
                  Delivery Details
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative col-span-2 md:col-span-1">
                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none text-sm text-gray-800 transition-all"
                    />
                  </div>
                  <div className="relative col-span-2 md:col-span-1">
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone No *"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none text-sm text-gray-800 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City *"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none text-sm text-gray-800 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none text-sm text-gray-800 transition-all"
                    />
                  </div>
                  <div className="relative col-span-2">
                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      placeholder="Full Delivery Address *"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      rows={2}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none text-sm text-gray-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-[#fff7ed] rounded-xl p-4 border border-[#ffedd5]">
                <h3 className="text-sm font-bold text-[#ea580c] mb-3">Bill Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#ffedd5] flex justify-between items-center">
                    <span className="font-bold text-gray-900">Grand Total</span>
                    <span className="text-xl font-bold text-[#ea580c]">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100">
            <button
              disabled={!isFormValid}
              onClick={handleCheckout}
              className={`w-full py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-sm ${isFormValid
                  ? "bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[#25D366]/20"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              Order via WhatsApp
            </button>
            <p className="text-center text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">
              Instant Confirmation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
