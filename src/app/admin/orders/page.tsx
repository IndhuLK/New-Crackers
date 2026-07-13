"use client";

import { Search, Eye, Trash2, Calendar, RefreshCcw, MapPin, FileText, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerCity?: string;
  orderStatus: string;
  paymentStatus: string;
  items: any[];
  totalAmount: number;
  createdAt?: any;
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
          orderStatus: data.orderStatus || data.status || 'Pending',
          paymentStatus: data.paymentStatus || 'Unpaid',
          items: data.products || data.items || [],
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
      } catch (err) {
        console.error("Error deleting order:", err);
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderCode.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerCity && o.customerCity.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] tracking-tight leading-none mb-2">Sales Orders</h1>
          <p className="text-gray-400 text-[13px]">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded font-medium text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm shrink-0">
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col p-4">
        
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
                    <div className="text-[11px] text-gray-500 font-medium whitespace-nowrap">
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
                      <button className="hover:text-[#0066cc] transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="hover:text-[#0066cc] transition-colors" title="Invoice">
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
    </div>
  );
}
