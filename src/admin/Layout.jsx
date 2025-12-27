import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar";
import Footer from "../components/Footer";
import { LayoutDashboard } from "lucide-react";

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Default Website Navbar - Fixed Top */}
      <Navbar />

      {/* spacer for fixed navbar - Navbar height varies but ~88px is a good safe zone */}
      <div className="h-[88px] w-full"></div>

      <div className="flex relative">
        {/* Mobile Admin Menu Toggle - Visible only on mobile when sidebar is closed */}
        {isMobile && !isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-28 left-4 z-30 p-2.5 bg-slate-900 text-white rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-2"
          >
            <LayoutDashboard size={20} />
            <span className="text-xs font-bold pr-1">Admin Menu</span>
          </button>
        )}

        {/* Sidebar - Stuck to the left on Desktop, Fixed drawer on Mobile */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
          navbarHeight="top-[88px]"
        />

        {/* Main Content Area */}
        <main
          className="flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-[calc(100vh-88px)]"
        >
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer - Third Layer (Full Width, below Sidebar & Content) */}
      <Footer />
    </div>
  );
}
