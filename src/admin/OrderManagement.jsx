import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import {
  X,
  Search,
  Trash2,
  Eye,
  Calendar,
  RefreshCcw,
  Download,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Banknote,
  Filter,
  ArrowUpRight
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let constraints = [];
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        constraints.push(where("orderDate", ">=", Timestamp.fromDate(s)));
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        constraints.push(where("orderDate", "<=", Timestamp.fromDate(e)));
      }
      constraints.push(orderBy("orderDate", "desc"));
      const q = query(collection(db, "orders"), ...constraints);
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [startDate, endDate]);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { paymentStatus: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
    setStatusUpdating(null);
  };

  const rankMap = {};
  orders.forEach((o, i) => (rankMap[o.id] = i + 1));

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q) ||
      o.customer?.city?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending": return {
        bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20",
        icon: Clock, label: "Pending"
      };
      case "Paid": return {
        bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20",
        icon: CheckCircle2, label: "Paid"
      };
      case "Online Payment": return {
        bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20",
        icon: Banknote, label: "Online"
      };
      case "Cash Payment": return {
        bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20",
        icon: Banknote, label: "Cash"
      };
      default: return {
        bg: "bg-slate-500/10", text: "text-slate-500", border: "border-slate-500/20",
        icon: Clock, label: status
      };
    }
  };

  const handleDownloadPDF = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(220, 38, 38);
      doc.text("DHEERAN CRACKERS", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Invoice: ORD-${rankMap[order.id]}`, 14, 30);
      const dateStr = order.orderDate?.toDate ? format(order.orderDate.toDate(), "dd-MM-yyyy") : "N/A";
      doc.text(`Date: ${dateStr}`, 14, 35);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Bill To:", 14, 50);
      doc.setFontSize(10);
      doc.text(`${order.customer?.name || "N/A"}`, 14, 58);
      doc.text(`${order.customer?.phone || ""}`, 14, 64);
      doc.text(`${order.customer?.address || ""}, ${order.customer?.city || ""}`, 14, 70);

      const tableColumn = ["Product", "Price", "Qty", "Total"];
      const tableRows = (order.products || []).map(p => [
        p.name,
        `Rs. ${p.price}`,
        p.qty,
        `Rs. ${p.price * p.qty}`
      ]);

      autoTable(doc, {
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        headStyles: { fillColor: [220, 38, 38] },
        theme: 'grid'
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`Grand Total: Rs. ${order.total?.toLocaleString()}`, 14, finalY);

      doc.save(`Invoice_${rankMap[order.id]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Error generating PDF");
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-32 animate-in fade-in duration-700 relative overflow-hidden">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-4 pt-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Track and manage your customer orders.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="group flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl text-slate-700 font-bold hover:bg-white hover:shadow-lg hover:shadow-purple-500/10 transition-all"
        >
          <RefreshCcw size={18} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Glass Command Bar */}
      <div className="sticky top-[85px] z-30 px-4 mb-8">
        <div className="bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white/60 flex flex-col lg:flex-row gap-2 transition-all">

          {/* Search */}
          <div className="relative flex-[2] group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-focus-within:text-purple-600 group-focus-within:scale-110 transition-all">
              <Search size={18} />
            </div>
            <input
              placeholder="Search by Order ID, Name, City..."
              className="w-full h-14 bg-slate-50/50 border-2 border-transparent pl-16 rounded-[1.5rem] outline-none text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-purple-100 focus:shadow-lg transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div className="flex flex-1 gap-2">
            <div className="flex items-center bg-slate-50/50 rounded-[1.5rem] px-4 flex-1 border-2 border-transparent focus-within:bg-white focus-within:border-purple-100 focus-within:shadow-lg transition-all relative group">
              <Calendar size={18} className="text-slate-400 mr-2 shrink-0 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="date"
                className="bg-transparent h-14 w-full outline-none text-sm font-bold text-slate-600"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-slate-50/50 rounded-[1.5rem] px-4 flex-1 border-2 border-transparent focus-within:bg-white focus-within:border-purple-100 focus-within:shadow-lg transition-all relative group">
              <Calendar size={18} className="text-slate-400 mr-2 shrink-0 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="date"
                className="bg-transparent h-14 w-full outline-none text-sm font-bold text-slate-600"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={() => { setSearch(""); setStartDate(""); setEndDate(""); }}
            className="h-14 px-8 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-50 rounded-full"></div>
              </div>
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">Syncing Orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 gap-6 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/50">
            <div className="p-6 bg-white rounded-full shadow-xl shadow-slate-100">
              <ShoppingBag size={48} className="text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-900">No Orders Found</h3>
              <p className="text-slate-400 font-medium">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-100/50 bg-slate-50/50 text-xs font-black text-slate-400 uppercase tracking-widest">
                <div className="col-span-1"># ID</div>
                <div className="col-span-3">Customer Details</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center">Items</div>
                <div className="col-span-2 text-right">Total Amount</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-slate-100/50">
                {filtered.map((o) => {
                  const status = getStatusConfig(o.paymentStatus);
                  const StatusIcon = status.icon;
                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className="grid grid-cols-12 gap-4 items-center p-5 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="col-span-1">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-black font-mono group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                          #{rankMap[o.id]}
                        </span>
                      </div>

                      <div className="col-span-3">
                        <p className="font-bold text-slate-800 text-base group-hover:text-purple-700 transition-colors">{o.customer?.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                          <Truck size={12} />
                          <span className="truncate max-w-[150px]">{o.customer?.city || "Unknown City"}</span>
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-center" onClick={(e) => e.stopPropagation()}>
                        <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border ${status.bg} ${status.border} ${status.text} transition-all`}>
                          <StatusIcon size={14} />
                          <select
                            value={o.paymentStatus || "Pending"}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            disabled={statusUpdating === o.id}
                            className={`bg-transparent text-xs font-black uppercase outline-none appearance-none cursor-pointer w-[120px] ${statusUpdating === o.id ? 'opacity-50' : ''}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Online Payment">Online</option>
                            <option value="Cash Payment">Cash</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100">
                          {o.products?.length || 0} Products
                        </span>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="text-base font-black text-slate-900 group-hover:scale-110 inline-block transition-transform duration-300">
                          ₹{o.total?.toLocaleString()}
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-purple-500 hover:text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-1"
                          title="View Details"
                        >
                          <ArrowUpRight size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(o.id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1"
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {filtered.map((o) => {
                const status = getStatusConfig(o.paymentStatus);
                const StatusIcon = status.icon;
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-sm active:scale-95 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-black font-mono">
                            #{rankMap[o.id]}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {o.orderDate?.toDate ? format(o.orderDate.toDate(), "dd MMM") : "N/A"}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">{o.customer?.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Truck size={10} /> {o.customer?.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900">₹{o.total?.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{o.products?.length} Items</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                      <div className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border ${status.bg} ${status.border} ${status.text}`}>
                        <StatusIcon size={14} />
                        <span className="text-xs font-black uppercase">{status.label}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 active:bg-red-50 active:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="bg-white w-full md:max-w-2xl md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300">

            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white relative shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-mono border border-white/10">
                      ORDER #{rankMap[selectedOrder.id]}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">
                      {selectedOrder.orderDate?.toDate ? format(selectedOrder.orderDate.toDate(), "hh:mm a, dd MMM yyyy") : ""}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">{selectedOrder.customer?.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto customs-scrollbar">

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Truck size={14} /> Shipping Information
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-800 text-sm leading-relaxed">
                      {selectedOrder.customer?.address}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      {selectedOrder.customer?.city} - {selectedOrder.customer?.pincode}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-sm text-slate-600 font-bold">
                      <span>Customer: {selectedOrder.customer?.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Banknote size={14} /> Payment Status
                  </h4>
                  <div className={`p-4 rounded-2xl border ${getStatusConfig(selectedOrder.paymentStatus).bg} ${getStatusConfig(selectedOrder.paymentStatus).border} flex flex-col gap-2`}>
                    <div className="flex items-center gap-2">
                      {React.createElement(getStatusConfig(selectedOrder.paymentStatus).icon, { size: 18, className: getStatusConfig(selectedOrder.paymentStatus).text })}
                      <span className={`font-black uppercase ${getStatusConfig(selectedOrder.paymentStatus).text}`}>
                        {selectedOrder.paymentStatus || "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-tight">
                      Update this status from the main list view.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShoppingBag size={14} /> Purchased Items ({selectedOrder.products?.length})
                </h4>
                <div className="divide-y divide-slate-50">
                  {selectedOrder.products?.map((p, i) => (
                    <div key={i} className="flex justify-between items-center py-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-black text-sm border border-slate-200">
                          {p.qty}x
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">Unit Price: ₹{p.price}</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-900 text-sm">₹{(p.price * p.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Section */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <div className="text-slate-500 text-sm font-bold">Total Amount</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">
                  ₹{selectedOrder.total?.toLocaleString()}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-3 shrink-0">
              <button
                onClick={() => handleDownloadPDF(selectedOrder)}
                className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Download size={18} /> Download Invoice
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Delete this order completely?")) {
                    handleDelete(selectedOrder.id);
                    setSelectedOrder(null);
                  }
                }}
                className="md:w-16 py-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManagement;