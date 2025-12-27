import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Menu, X } from "lucide-react";

export default function NavbarAdmin({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300">

      {/* Left: Brand & Toggle */}
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-200">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap hidden md:block">
            Dheeran <span className="text-red-600">Admin</span>
          </h1>
        </div>
      </div>

      {/* Center/Right: Title & Actions */}
      <div className="flex items-center gap-6">
        <h2 className="font-bold text-lg text-slate-700 hidden sm:block">Dashboard Overview</h2>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 
            px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
