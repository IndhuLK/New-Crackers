import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Images,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  Zap
} from "lucide-react";
import { useState } from "react";

const menus = [
  {
    name: "Dashboard",
    path: "/admin-dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Product Management",
    icon: <Package size={20} />,
    isSubmenu: true,
    subItems: [
      { name: "Add Product", path: "/admin/add-product", icon: <PlusCircle size={18} /> },
      { name: "Products List", path: "/admin/products", icon: <ListChecks size={18} /> },
    ],
  },
  { name: "Orders Management", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { name: "Slider Management", path: "/admin/slider-management", icon: <Images size={20} /> },
];

export default function Sidebar({ isOpen, setIsOpen, isMobile, navbarHeight = "top-0" }) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({ "Product Management": true });

  const toggleSubmenu = (name) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Classes
  const sidebarClasses = `
    border-r border-white/40 z-40 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
    backdrop-blur-xl bg-white/70 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
    ${isMobile
      ? "fixed top-0 left-0 h-screen"
      : `sticky ${navbarHeight} h-[calc(100vh-88px)] shrink-0`
    }
    ${isOpen
      ? "translate-x-0 w-72"
      : `${isMobile ? "-translate-x-full" : "w-20"} lg:translate-x-0`
    }
  `;

  const overlayClasses = `
    fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300
    ${isOpen && isMobile ? "opacity-100 visible" : "opacity-0 invisible"}
  `;

  return (
    <>
      <div className={overlayClasses} onClick={() => setIsOpen(false)} />

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full relative overflow-hidden">

          {/* subtle decorative gradient */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 pt-8 pb-6 space-y-2 overflow-y-auto customs-scrollbar relative z-10">

            {/* Menu Label */}
            {isOpen && (
              <div className="px-4 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Main Menu</p>
              </div>
            )}

            {menus.map((item, index) => {
              const isSubmenu = item.isSubmenu;
              const isActive = location.pathname === item.path;
              const isChildActive = isSubmenu && item.subItems.some(sub => location.pathname === sub.path);
              const isExpanded = expandedMenus[item.name];

              if (isSubmenu) {
                return (
                  <div key={index} className="space-y-1 mb-2">
                    <button
                      onClick={() => !isOpen ? setIsOpen(true) : toggleSubmenu(item.name)}
                      className={`
                        w-full flex items-center justify-between px-3 py-3 rounded-2xl transition-all duration-300 group
                        ${isChildActive ? "bg-red-50 text-red-600 shadow-sm" : "hover:bg-white/60 hover:text-slate-900 text-slate-500"}
                        ${!isOpen && "justify-center"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`transition-colors duration-300 ${isChildActive ? "text-red-500" : "text-slate-400 group-hover:text-slate-600"}`}>
                          {item.icon}
                        </div>
                        {isOpen && <span className="text-[14px] font-bold">{item.name}</span>}
                      </div>

                      {isOpen && (
                        <div className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""} ${isChildActive ? "text-red-500" : "text-slate-400"}`}>
                          <ChevronDown size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>

                    {/* Submenu List */}
                    <div className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpen && isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}>
                      <div className="relative ml-5 pl-5 border-l border-slate-200/60 space-y-1 my-1">
                        {item.subItems.map((sub) => {
                          const isSubActive = location.pathname === sub.path;
                          return (
                            <Link
                              key={sub.name}
                              to={sub.path}
                              onClick={() => isMobile && setIsOpen(false)}
                              className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                                ${isSubActive
                                  ? "text-red-600 font-bold bg-white shadow-sm"
                                  : "text-slate-500 hover:text-red-600 hover:translate-x-1 font-medium"}
                              `}
                            >
                              {/* Dot indicator */}
                              {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-red-600 absolute -left-[5.5px] shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>}

                              <span className="truncate">{sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard Menu Item
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={`
                    relative flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group mb-1
                    ${!isOpen && "justify-center"}
                    ${isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200 font-bold"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-900 font-medium"}
                  `}
                >
                  <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}>
                    {item.icon}
                  </div>

                  {isOpen && <span className="text-[14px] tracking-wide">{item.name}</span>}

                  {/* Active Glow for standard items */}
                  {isActive && isOpen && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  )}

                  {/* Tooltip for collapsed */}
                  {!isOpen && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl whitespace-nowrap translate-x-3 group-hover:translate-x-0">
                      {item.name}
                      {/* Arrow tip */}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions / Profile */}
          <div className="p-4 border-t border-slate-100 bg-white/30 backdrop-blur-md">

            {isOpen && (
              <div className="mb-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 text-center shadow-lg shadow-orange-200/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-b from-white/20 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 pointer-events-none"></div>
                <Sparkles className="mx-auto text-white mb-1" size={20} />
                <p className="text-white text-xs font-bold mb-2">Pro Features Active</p>
                <button className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors border border-white/20">
                  View Plan
                </button>
              </div>
            )}

            <button className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:bg-white group ${!isOpen && "justify-center"}`}>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                <Settings size={18} />
              </div>
              {isOpen && (
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Settings</p>
                  <p className="text-[10px] text-slate-400 font-medium">System Preferences</p>
                </div>
              )}
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}