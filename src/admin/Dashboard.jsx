import {
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Plus,
  ArrowRight,
  Package,
  Clock,
  TrendingDown,
  Activity
} from "lucide-react";
import { useOrders } from "./OrderContext";
import { useProducts } from "./ProductContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();

  // 1. Calculate Stats
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const totalOrders = orders.length;
  // Estimate active customers by unique phone numbers
  const uniqueCustomers = new Set(orders.map(o => o.customer?.phone).filter(Boolean)).size;

  const lowStockItems = products.filter(p => (Number(p.stock) || 0) < 5);
  const lowStockCount = lowStockItems.length;

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-slate-200 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      trend: "+12.5%",
      trendUp: true,
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Total Orders",
      value: totalOrders,
      trend: "+4",
      trendUp: true,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Active Customers",
      value: uniqueCustomers,
      trend: "+2.4%",
      trendUp: true,
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      trend: "Action Needed",
      trendUp: false,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <Activity size={16} /> Real-time store analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 shadow-sm flex items-center gap-2">
            <Clock size={14} /> {format(new Date(), "dd MMM, HH:mm")}
          </div>
          <Link to="/admin/add-product" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200">
            <Plus size={18} /> New Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item, i) => (
          <div
            key={i}
            className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3.5 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={22} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${item.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                {item.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{item.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Recent Orders - Takes 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-slate-900">Recent Orders</h2>
              <p className="text-slate-400 text-xs font-medium mt-1">Latest transactions from your store.</p>
            </div>
            <Link to="/admin/orders" className="bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold transition-all">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 font-bold border-b border-slate-50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-medium">No orders found yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">#{order.id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-700">{order.customer?.name || "Unknown"}</div>
                        <div className="text-xs text-slate-400 font-medium">{order.customer?.city}</div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-900">₹{order.total?.toLocaleString() || 0}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right text-slate-400 text-xs font-medium">
                        {order.orderDate?.toDate ? format(order.orderDate.toDate(), "dd MMM") : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Low Stock / Quick Actions */}
        <div className="space-y-6">

          {/* Low Stock Alert */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                Inventory Alert
              </h2>
              {lowStockCount > 0 && <span className="bg-red-50 text-red-600 text-xs font-black px-2 py-1 rounded-md animate-pulse">{lowStockCount} Critical</span>}
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] customs-scrollbar pr-2">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-3">
                    <Check size={20} />
                  </div>
                  <p className="text-sm font-bold text-slate-600">All stocked up!</p>
                </div>
              ) : (
                lowStockItems.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-xl">🧨</span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wide">{item.productCode || "SKU-???"}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-lg font-black text-red-500">{item.stock}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link to="/admin/products" className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors">
              Manage Inventory <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

// Icon helper
import { Check } from "lucide-react";
