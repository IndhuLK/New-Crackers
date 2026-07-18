"use client";

import { Search, Eye, Trash2, Calendar, RefreshCcw, MapPin, FileText, Loader2, X, Printer } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity?: number;
  qty?: number;
  total?: number;
}

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerCity?: string;
  customerPhone?: string;
  customerAddress?: string;
  orderStatus: string;
  paymentStatus: string;
  items: OrderItem[];
  subtotal?: number;
  shipping?: number;
  totalAmount: number;
  createdAt?: any;
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'invoice' | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderCode: data.orderCode || `ORD-${doc.id.substring(0, 8).toUpperCase()}`,
          customerName: data.customer?.name || data.customerName || data.name || 'Unknown Customer',
          customerCity: data.customer?.city || data.customerCity || data.city || data.location || 'Unknown Location',
          customerPhone: data.customer?.phone || data.customerPhone || data.phone || '',
          customerAddress: data.customer?.address || data.customerAddress || data.address || '',
          orderStatus: data.orderStatus || data.status || 'Pending',
          paymentStatus: data.paymentStatus || 'Unpaid',
          items: data.products || data.items || [],
          subtotal: data.subtotal,
          shipping: data.shipping,
          totalAmount: data.total || data.totalAmount || data.amount || 0,
          createdAt: data.createdAt || data.orderDate
        };
      }) as Order[];
      setOrders(fetchedOrders);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching orders:", err);
      setLoading(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsub = fetchOrders();
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete order ${id}?`)) {
      try {
        await deleteDoc(doc(db, "orders", id));
        if (viewOrder?.id === id) {
          closeModal();
        }
      } catch (err) {
        console.error("Error deleting order:", err);
      }
    }
  };

  const handleUpdateStatus = async (id: string, field: 'orderStatus' | 'paymentStatus', value: string) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        [field]: value
      });
      // Update local viewOrder state if it's currently open
      if (viewOrder && viewOrder.id === id) {
        setViewOrder({ ...viewOrder, [field]: value });
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      alert("Failed to update status.");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderCode.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerCity && o.customerCity.toLowerCase().includes(search.toLowerCase()))
  );

  const openDetails = (order: Order) => {
    setViewOrder(order);
    setViewMode('details');
  };

  const openInvoice = (order: Order) => {
    setViewOrder(order);
    setViewMode('invoice');
  };

  const closeModal = () => {
    setViewOrder(null);
    setViewMode(null);
  };

  const printInvoice = () => {
    const printArea = document.getElementById('invoice-print-area');
    if (!printArea) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.write(`
        <html>
          <head>
            <base href="${window.location.origin}" />
            ${document.head.innerHTML}
          </head>
          <body style="background: white !important; padding: 20px;">
            ${printArea.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative print:static print:block print:m-0 print:p-0 print:max-w-none">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] tracking-tight leading-none mb-2">Sales Orders</h1>
          <p className="text-gray-400 text-[13px]">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded font-medium text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm shrink-0">
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col p-4 print:hidden">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, city, order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[13px] outline-none focus:border-[#0066cc] transition-colors placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="mm/dd/yyyy" 
                className="w-36 pl-9 pr-3 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[13px] outline-none focus:border-[#0066cc] transition-colors placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="mm/dd/yyyy" 
                className="w-36 pl-9 pr-3 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[13px] outline-none focus:border-[#0066cc] transition-colors placeholder:text-gray-400"
              />
            </div>
            <button className="px-4 py-2.5 bg-[#f8fafc] border border-gray-200 text-gray-600 rounded-md font-medium text-[13px] hover:bg-gray-100 transition-colors">
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-[#0066cc]" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-[#0066cc] text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3 border-b-2 border-[#0066cc]">#</th>
                  <th className="px-5 py-3 border-b-2 border-[#0066cc]">CUSTOMER</th>
                  <th className="px-5 py-3 border-b-2 border-[#0066cc] text-center">STATUS</th>
                  <th className="px-5 py-3 border-b-2 border-[#0066cc] text-center">ITEMS</th>
                  <th className="px-5 py-3 border-b-2 border-[#0066cc] text-center">AMOUNT</th>
                  <th className="px-5 py-3 border-b-2 border-[#0066cc] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    
                    <td className="px-5 py-4 font-bold text-[#0066cc]">{order.orderCode}</td>
                    
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0f172a] text-[12px] uppercase">{order.customerName}</span>
                        <span className="text-gray-400 text-[11px] mt-1 flex items-center gap-1">
                          <MapPin size={10} /> {order.customerCity}
                        </span>
                      </div>
                    </td>
                  
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-flex uppercase tracking-wider mb-1 ${
                      order.paymentStatus === 'Paid' 
                        ? 'bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {order.paymentStatus}
                    </span>
                    <div className={`text-[11px] font-medium whitespace-nowrap ${
                      order.orderStatus === 'Delivered' ? 'text-green-600' :
                      order.orderStatus === 'Cancelled' ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {order.orderStatus}
                    </div>
                  </td>
                  
                  <td className="px-5 py-4 text-center">
                    <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded border border-gray-100 text-[12px] font-medium inline-flex">
                      {order.items?.length || 0}
                    </span>
                  </td>
                  
                  <td className="px-5 py-4 text-center font-bold text-[#0f172a]">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-[#94a3b8]">
                      <button onClick={() => openDetails(order)} className="hover:text-[#0066cc] transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openInvoice(order)} className="hover:text-[#0066cc] transition-colors" title="Invoice">
                        <FileText size={16} />
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                  </tr>
                ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500 text-[13px]">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
        
      </div>

      {/* Modal Overlay */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm print:static print:block print:p-0 print:bg-white">
          
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative print:static print:block print:shadow-none print:max-w-none print:w-full print:max-h-none print:overflow-visible print:border-none print:rounded-none">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 print:hidden">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {viewMode === 'details' ? 'Order Details' : 'Invoice'} 
                <span className="text-[#0066cc] font-mono text-sm ml-2 bg-blue-50 px-2 py-1 rounded">
                  {viewOrder.orderCode}
                </span>
              </h2>
              <div className="flex items-center gap-3">
                {viewMode === 'invoice' && (
                  <button 
                    onClick={printInvoice}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium rounded-md transition-colors"
                  >
                    <Printer size={16} /> Print
                  </button>
                )}
                <button 
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar print:overflow-visible print:p-0 print:static print:block print:h-auto">
              
              {viewMode === 'details' ? (() => {
                const computedSubtotal = viewOrder.subtotal ?? viewOrder.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || item.quantity || 1)), 0) ?? 0;
                const computedShipping = viewOrder.shipping ?? (viewOrder.totalAmount - computedSubtotal);
                return (
                // DETAILS VIEW
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2 uppercase tracking-wide">Customer Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-gray-500 w-24 flex justify-between shrink-0 pr-2"><span>Name</span><span>:</span></span> 
                          <span className="font-medium text-gray-900 flex-1">{viewOrder.customerName}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24 flex justify-between shrink-0 pr-2"><span>Phone</span><span>:</span></span> 
                          <span className="font-medium text-gray-900 flex-1">{viewOrder.customerPhone || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24 flex justify-between shrink-0 pr-2 align-top"><span>Address</span><span>:</span></span> 
                          <span className="font-medium text-gray-900 flex-1 text-justify line-clamp-1 hover:line-clamp-none transition-all">{viewOrder.customerAddress || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24 flex justify-between shrink-0 pr-2"><span>City</span><span>:</span></span> 
                          <span className="font-medium text-gray-900 flex-1">{viewOrder.customerCity || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2 uppercase tracking-wide">Order Info</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-500 w-28 flex justify-between shrink-0 pr-2"><span>Date</span><span>:</span></span> 
                          <span className="font-medium text-gray-900 flex-1">{formatDate(viewOrder.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-gray-500 w-28 flex justify-between shrink-0 pr-2"><span>Status</span><span>:</span></span> 
                          <select 
                            value={viewOrder.orderStatus}
                            onChange={(e) => handleUpdateStatus(viewOrder.id, 'orderStatus', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="flex items-center">
                          <span className="text-gray-500 w-28 flex justify-between shrink-0 pr-2"><span>Payment</span><span>:</span></span> 
                          <select 
                            value={viewOrder.paymentStatus}
                            onChange={(e) => handleUpdateStatus(viewOrder.id, 'paymentStatus', e.target.value)}
                            className={`border text-xs rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5 ${
                              viewOrder.paymentStatus === 'Paid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                          >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <h3 className="text-sm font-semibold text-gray-900 p-4 border-b bg-gray-50 uppercase tracking-wide">Order Items ({viewOrder.items?.length || 0})</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs border-b">
                          <tr>
                            <th className="px-4 py-3 font-medium">Product</th>
                            <th className="px-4 py-3 font-medium text-center">Price</th>
                            <th className="px-4 py-3 font-medium text-center">Qty</th>
                            <th className="px-4 py-3 font-medium text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {viewOrder.items && viewOrder.items.length > 0 ? (
                            viewOrder.items.map((item, idx) => {
                              const itemQty = item.qty || item.quantity || 1;
                              const itemTotal = item.total || (item.price * itemQty);
                              return (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                  <td className="px-4 py-3 text-center text-gray-600">₹{item.price?.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-center text-gray-900 font-medium">{itemQty}</td>
                                  <td className="px-4 py-3 text-right font-bold text-[#0066cc]">₹{itemTotal.toLocaleString()}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No items found in this order.</td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="bg-gray-50/80 border-t">
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right text-gray-500 font-medium pt-4">Subtotal:</td>
                            <td className="px-4 py-2 text-right text-gray-700 font-medium pt-4">₹{computedSubtotal.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right text-gray-500 font-medium border-b border-gray-100 pb-4">Shipping:</td>
                            <td className="px-4 py-2 text-right text-gray-700 font-medium border-b border-gray-100 pb-4">
                              {computedShipping === 0 ? <span className="text-green-600">Free</span> : `₹${computedShipping.toLocaleString()}`}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-4 py-4 text-right font-bold text-gray-900">Grand Total:</td>
                            <td className="px-4 py-4 text-right font-bold text-lg text-[#0066cc]">₹{viewOrder.totalAmount?.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  
                </div>
                );
              })() : (
                // INVOICE VIEW
                (() => {
                  const computedSubtotal = viewOrder.subtotal ?? viewOrder.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || item.quantity || 1)), 0) ?? 0;
                  const computedShipping = viewOrder.shipping ?? (viewOrder.totalAmount - computedSubtotal);
                  return (
                <div id="invoice-print-area" className="bg-white p-4 sm:p-8 max-w-3xl mx-auto border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-gray-800 pb-6 mb-6 gap-6 sm:gap-0">
                    <div>
                      <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">INVOICE</h1>
                      <p className="text-gray-500 mt-1 font-medium">{viewOrder.orderCode}</p>
                    </div>
                    <div className="text-left sm:text-right text-sm text-gray-600">
                      <p className="font-bold text-gray-900 text-base mb-1">Dheeran Crackers</p>
                      <p>Sivakasi</p>
                      <p>Tamil Nadu</p>
                      <p>Email: support@dheerancrackers.com</p>
                      <p>Phone: +91 90803 00546</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
                      <div className="text-sm text-gray-800">
                        <p className="font-bold text-base text-gray-900">{viewOrder.customerName}</p>
                        <p className="mt-1">{viewOrder.customerAddress || 'Address not provided'}</p>
                        <p>{viewOrder.customerCity || 'City not provided'}</p>
                        <p className="mt-1">{viewOrder.customerPhone}</p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="inline-block text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Invoice Details</p>
                        <table className="text-sm text-gray-800">
                          <tbody>
                            <tr>
                              <td className="pr-4 py-1 font-medium">Date:</td>
                              <td className="py-1">{formatDate(viewOrder.createdAt)}</td>
                            </tr>
                            <tr>
                              <td className="pr-4 py-1 font-medium">Payment:</td>
                              <td className={`py-1 font-bold ${viewOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                                {viewOrder.paymentStatus}
                              </td>
                            </tr>
                            <tr>
                              <td className="pr-4 py-1 font-medium">Status:</td>
                              <td className="py-1 font-bold">{viewOrder.orderStatus}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <table className="w-full text-left mb-8 border-collapse">
                    <thead>
                      <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 font-semibold rounded-tl-md">Item Description</th>
                        <th className="px-4 py-3 font-semibold text-center">Price</th>
                        <th className="px-4 py-3 font-semibold text-center">Qty</th>
                        <th className="px-4 py-3 font-semibold text-right rounded-tr-md">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800 divide-y divide-gray-200">
                      {viewOrder.items && viewOrder.items.length > 0 ? (
                        viewOrder.items.map((item, idx) => {
                          const itemQty = item.qty || item.quantity || 1;
                          const itemTotal = item.total || (item.price * itemQty);
                          return (
                            <tr key={idx} className="print:break-inside-avoid">
                              <td className="px-4 py-4 font-medium">{item.name}</td>
                              <td className="px-4 py-4 text-center">₹{item.price?.toLocaleString()}</td>
                              <td className="px-4 py-4 text-center">{itemQty}</td>
                              <td className="px-4 py-4 text-right font-medium">₹{itemTotal.toLocaleString()}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No items in this invoice.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="flex justify-end print:break-inside-avoid">
                    <div className="w-full sm:w-1/2 min-w-[250px]">
                      <table className="w-full text-sm text-gray-800">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-500 font-medium">Subtotal</td>
                            <td className="py-2 text-right font-medium">₹{computedSubtotal.toLocaleString()}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-500 font-medium">Shipping</td>
                            <td className="py-2 text-right font-medium">
                              {computedShipping === 0 ? 'Free' : `₹${computedShipping.toLocaleString()}`}
                            </td>
                          </tr>
                          <tr className="text-lg">
                            <td className="py-4 font-bold text-gray-900">Total</td>
                            <td className="py-4 text-right font-bold text-gray-900">₹{viewOrder.totalAmount?.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
                    <p>Thank you for your business!</p>
                    <p className="mt-1">If you have any questions about this invoice, please contact us.</p>
                  </div>
                </div>
                );
              })()
              )}
              
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

