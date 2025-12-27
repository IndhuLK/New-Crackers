import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Trash2,
  Building2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../admin/OrderContext";

/* ================= INPUT FIELD COMPONENT ================= */
const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-100 bg-white
        focus:ring-4 focus:ring-red-50 focus:border-red-400 focus:outline-none text-sm text-slate-800 transition-all shadow-sm"
      />
    </div>
  </div>
);

const CartPopup = () => {
  const { cart, removeItem, updateItemQty, setOpenCart, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
  });

  const handleCustomerChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  /* ================= PRICE CALCULATION ================= */
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );
  const shipping = cart.length ? 40 : 0;
  const total = subtotal + shipping;

  /* ================= WHATSAPP MESSAGE LOGIC ================= */
  const whatsappNumber = "919500694734";

  const whatsappMessage = `
🧨 *DHEERAN CRACKERS ORDER* 🧨

👤 *Name:* ${customerDetails.name}
📞 *Phone:* ${customerDetails.phone}
📧 *Email:* ${customerDetails.email || "N/A"}
📍 *Address:* ${customerDetails.address}
🌆 *City:* ${customerDetails.city}
📮 *Pincode:* ${customerDetails.pincode}

🛒 *Products:*
${cart
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} × ${item.qty} = ₹${(
            item.price * item.qty
          ).toFixed(2)}`
      )
      .join("\n")}

💰 *Subtotal:* ₹${subtotal.toFixed(2)}
🚚 *Shipping:* ₹${shipping.toFixed(2)}
⭐ *Total Amount: ₹${total.toFixed(2)}*
`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const isFormValid =
    cart.length > 0 &&
    customerDetails.name &&
    customerDetails.phone &&
    customerDetails.address &&
    customerDetails.city;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 font-sans">
      <div className="bg-[#f8fafc] w-full max-w-6xl h-[95vh] md:h-[88vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Order</p>
              <span className="font-black text-lg">
                {cart.length} Items • ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenCart(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

          {/* LEFT SECTION: CART ITEMS */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              Your Cart Items
            </h2>

            {cart.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag size={40} />
                </div>
                <p className="text-slate-500 font-bold mb-4 tracking-tight">Your cart feels a bit light!</p>
                <button
                  onClick={() => setOpenCart(false)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />

                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-base leading-tight">
                        {item.name}
                      </p>
                      <p className="text-sm text-red-600 font-black mt-1">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center bg-white rounded-xl border border-slate-100 p-1 shadow-sm">
                          <button
                            disabled={item.qty === 1}
                            onClick={() => updateItemQty(item.id, item.qty - 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
                          >
                            −
                          </button>
                          <span className="font-black w-8 text-center text-slate-800">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateItemQty(item.id, item.qty + 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SECTION: CUSTOMER DETAILS */}
          <div className="w-full md:w-[400px] bg-[#f8fafc] p-6 md:p-8 overflow-y-auto border-l border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-6">Checkout Info</h2>

            <div className="space-y-4 mb-8">
              <InputField icon={User} label="Full Name *" name="name" placeholder="Enter your name" value={customerDetails.name} onChange={handleCustomerChange} />
              <InputField icon={Phone} label="Phone Number *" name="phone" placeholder="Enter phone number" value={customerDetails.phone} onChange={handleCustomerChange} />
              <InputField icon={Mail} label="Email Address" name="email" placeholder="Optional" value={customerDetails.email} onChange={handleCustomerChange} />

              <div className="grid grid-cols-2 gap-3">
                <InputField icon={Building2} label="City / Town *" name="city" placeholder="City" value={customerDetails.city} onChange={handleCustomerChange} />
                <InputField icon={MapPin} label="Pincode" name="pincode" placeholder="6xxxxx" value={customerDetails.pincode} onChange={handleCustomerChange} />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Delivery Address *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    name="address"
                    placeholder="Door No, Street Name, Area..."
                    value={customerDetails.address}
                    onChange={handleCustomerChange}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-red-50 focus:border-red-400 outline-none text-sm text-slate-800 shadow-sm"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY CARD */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 mb-8">
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <Truck size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Bill Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-800 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Shipping Fee</span>
                  <span className="text-slate-800 font-bold">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-2">
                  <span className="text-slate-900 font-black">Grand Total</span>
                  <span className="text-2xl font-black text-red-600 tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* PLACE ORDER BUTTON */}
            <button
              disabled={!isFormValid}
              onClick={async () => {
                await addOrder({
                  customer: customerDetails,
                  products: cart,
                  subtotal,
                  shipping,
                  total,
                  createdAt: new Date(),
                });

                window.open(whatsappUrl, "_blank");
                clearCart();
                setOpenCart(false);
              }}
              className={`w-full py-4 rounded-[1.5rem] font-black text-lg transition-all shadow-xl
                ${isFormValid
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
            >
              Order via WhatsApp
            </button>

            <p className="text-[10px] font-bold text-slate-400 text-center mt-5 uppercase tracking-widest">
              Instant Confirmation on WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;