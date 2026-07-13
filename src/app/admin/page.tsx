"use client";

import { CreditCard, ShoppingBag, Users, AlertTriangle, Clock, Plus, Check, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useProducts } from '@/context/ProductContext';

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
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
          totalAmount: data.total || data.totalAmount || data.amount || 0,
          createdAt: data.createdAt || data.orderDate
        };
      });
      setOrders(fetchedOrders);
      setLoadingOrders(false);
    });
    return () => unsubscribe();
  }, []);

  const { totalRevenue, totalOrders, customersCount, lowStockCount } = useMemo(() => {
    let revenue = 0;
    let customerSet = new Set();
    orders.forEach(o => {
      if (o.status !== 'Cancelled') {
        revenue += o.totalAmount;
      }
      customerSet.add(o.customerName);
    });

    let lowStock = 0;
    products.forEach(p => {
      const stock = p.stock || 0;
      if (stock > 0 && stock < 20) lowStock++;
    });

    return {
      totalRevenue: revenue,
      totalOrders: orders.length,
      customersCount: customerSet.size,
      lowStockCount: lowStock
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-1.5 text-gray-400 text-[12px] mt-1.5">
            <Clock size={12} />
            <span>Real-time metrics</span>
          </div>
        </div>
        <Link href="/admin/add-product" className="px-4 py-2 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} /> New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded bg-[#eff4ff] text-[#0066cc] flex items-center justify-center mb-6">
            <CreditCard size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Total Revenue</p>
            <h3 className="text-[22px] font-bold text-gray-900 leading-none">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center mb-6">
            <ShoppingBag size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Total Orders</p>
            <h3 className="text-[22px] font-bold text-gray-900 leading-none">{totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mb-6">
            <Users size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Customers</p>
            <h3 className="text-[22px] font-bold text-gray-900 leading-none">{customersCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded bg-[#fff7ed] text-[#f59e0b] flex items-center justify-center mb-6">
            <AlertTriangle size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Low Stock</p>
            <h3 className="text-[22px] font-bold text-gray-900 leading-none">{lowStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Lower Grid (Orders & Inventory Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h2 className="font-bold text-gray-900 text-[15px]">Recent Orders</h2>
              <p className="text-[12px] text-gray-500 mt-1">Latest {recentOrders.length} transactions</p>
            </div>
            <Link href="/admin/orders" className="text-[13px] text-[#0066cc] font-medium hover:underline">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3 border-b border-gray-100">Order ID</th>
                  <th className="px-5 py-3 border-b border-gray-100">Customer</th>
                  <th className="px-5 py-3 border-b border-gray-100">Amount</th>
                  <th className="px-5 py-3 border-b border-gray-100">Status</th>
                  <th className="px-5 py-3 border-b border-gray-100 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {loadingOrders ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center">
                      <Loader2 className="animate-spin text-[#0066cc] mx-auto" size={24} />
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    return (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <Link href="/admin/orders" className="text-[#0066cc] font-bold hover:underline">
                            {order.orderCode}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-800 text-[12px] uppercase">{order.customerName}</div>
                          <div className="text-gray-500 text-[12px]">{order.customerCity}</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="px-5 py-4">
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
                        <td className="px-5 py-4 text-gray-500 text-right">
                          {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-[15px] mb-8">Inventory Alerts</h2>
            
            <div className="flex flex-col items-center justify-center py-10">
              {lowStockCount === 0 ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] mb-4">
                    <Check size={28} strokeWidth={2.5} />
                  </div>
                  <p className="text-gray-900 font-bold text-[14px]">All stocked up!</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                    <AlertTriangle size={28} strokeWidth={2.5} />
                  </div>
                  <p className="text-gray-900 font-bold text-[14px]">{lowStockCount} items low on stock!</p>
                </>
              )}
            </div>
          </div>
          
          <Link href="/admin/inventory" className="w-full py-2.5 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors flex items-center justify-center gap-2">
            View Inventory <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
