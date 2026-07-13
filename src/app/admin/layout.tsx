"use client";

import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut, ChevronDown, Bell, Image as ImageIcon, ChevronRight, Menu, X, AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Categories', href: '/admin/category-management', icon: Tag },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#f8fafc] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed inset-y-0 left-0 z-[101] md:relative md:z-0 ${sidebarOpen ? 'translate-x-0 w-[250px]' : '-translate-x-full w-[250px] md:translate-x-0 md:w-[70px]'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-8 h-8 rounded bg-[#0066cc] text-white flex items-center justify-center font-bold text-lg shrink-0">
              D
            </div>
            {sidebarOpen && (
              <span className="font-bold text-gray-900 text-[15px] whitespace-nowrap">
                Dheeran <span className="text-[#0066cc]">Admin</span>
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors hidden md:block">
              <X size={18} />
            </button>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 transition-all duration-200 group ${
                  isActive 
                    ? "text-[#0066cc]" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <div className={`${!sidebarOpen ? 'mx-auto' : 'mr-3'}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#0066cc]" : "text-gray-400 group-hover:text-gray-600"} /> 
                </div>
                {sidebarOpen && <span className={`text-[14px] ${isActive ? "font-bold" : "font-medium"}`}>{item.name}</span>}
              </Link>
            );
          })}

          {/* Products Dropdown */}
          <div className="flex flex-col">
            <button 
              onClick={() => { setSidebarOpen(true); setProductsOpen(!productsOpen); }}
              className={`flex items-center justify-between px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-all group w-full ${pathname.includes('/admin/products') || pathname.includes('/admin/add-product') ? 'text-[#0066cc]' : ''}`}
              title={!sidebarOpen ? "Products" : undefined}
            >
              <div className="flex items-center">
                <div className={`${!sidebarOpen ? 'mx-auto' : 'mr-3'}`}>
                  <Package size={18} strokeWidth={2} className={(pathname.includes('/admin/products') || pathname.includes('/admin/add-product')) ? "text-[#0066cc]" : "text-gray-400 group-hover:text-gray-600"} />
                </div>
                {sidebarOpen && <span className="text-[14px] font-medium">Products</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${!productsOpen ? '-rotate-90' : ''}`} />
              )}
            </button>
            
            {sidebarOpen && productsOpen && (
              <div className="flex flex-col mt-1 mb-2">
                <Link href="/admin/add-product" className={`pl-12 py-2 text-[13px] hover:text-[#0066cc] ${pathname === '/admin/add-product' ? 'text-[#0066cc] font-medium' : 'text-gray-500'}`}>
                  Add Product
                </Link>
                <Link href="/admin/products" className={`pl-12 py-2 text-[13px] hover:text-[#0066cc] ${pathname === '/admin/products' ? 'text-[#0066cc] font-medium' : 'text-gray-500'}`}>
                  All Products
                </Link>
                <Link href="/admin/inventory" className={`pl-12 py-2 text-[13px] hover:text-[#0066cc] ${pathname === '/admin/inventory' ? 'text-[#0066cc] font-medium' : 'text-gray-500'}`}>
                  Inventory
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/admin/orders"
            className={`flex items-center px-4 py-2.5 transition-all duration-200 group ${pathname === '/admin/orders' ? "text-[#0066cc]" : "text-gray-600 hover:bg-gray-50"}`}
            title={!sidebarOpen ? "Orders" : undefined}
          >
            <div className={`${!sidebarOpen ? 'mx-auto' : 'mr-3'}`}>
              <ShoppingBag size={18} strokeWidth={pathname === '/admin/orders' ? 2.5 : 2} className={pathname === '/admin/orders' ? "text-[#0066cc]" : "text-gray-400 group-hover:text-gray-600"} /> 
            </div>
            {sidebarOpen && <span className={`text-[14px] ${pathname === '/admin/orders' ? "font-bold" : "font-medium"}`}>Orders</span>}
          </Link>

          <Link
            href="/admin/sliders"
            className={`flex items-center px-4 py-2.5 transition-all duration-200 group ${pathname === '/admin/sliders' ? "text-[#0066cc]" : "text-gray-600 hover:bg-gray-50"}`}
            title={!sidebarOpen ? "Sliders" : undefined}
          >
            <div className={`${!sidebarOpen ? 'mx-auto' : 'mr-3'}`}>
              <ImageIcon size={18} strokeWidth={pathname === '/admin/sliders' ? 2.5 : 2} className={pathname === '/admin/sliders' ? "text-[#0066cc]" : "text-gray-400 group-hover:text-gray-600"} /> 
            </div>
            {sidebarOpen && <span className={`text-[14px] ${pathname === '/admin/sliders' ? "font-bold" : "font-medium"}`}>Sliders</span>}
          </Link>

        </nav>

        <div className="border-t border-gray-100 py-2">
          <Link href="/admin-login" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors group">
            <div className={`${!sidebarOpen ? 'mx-auto' : 'mr-3'}`}>
              <LogOut size={18} className="text-gray-400 group-hover:text-gray-600" />
            </div>
            {sidebarOpen && <span className="text-[14px] font-medium">Sign out</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f7f9]">
        {/* Top Navbar */}
        <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 transition-colors md:block hidden">
                <AlignLeft size={20} />
              </button>
            )}
            <button 
              className="text-gray-500 md:hidden block hover:bg-gray-100 p-2 rounded"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-[13px] text-gray-500 hidden sm:block">admin@dheerancrackers.com</span>
              <Link href="/admin-login" className="flex items-center gap-2 text-[13px] text-gray-600 font-medium hover:text-gray-900">
                <LogOut size={16} /> Logout
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
