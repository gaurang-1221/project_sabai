import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Store, LogOut, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/80 backdrop-blur-lg shadow-md py-2" : "bg-white py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Store size={24} className="text-white" />
            </div>
            <span className="text-gray-900 font-extrabold text-2xl tracking-tight">
              Shop<span className="text-indigo-600">Name</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 after:scale-x-0 after:transition-transform hover:after:scale-x-100 ${
                isActive("/") ? "text-indigo-600 after:scale-x-100" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-semibold transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 after:scale-x-0 after:transition-transform hover:after:scale-x-100 ${
                isActive("/contact") ? "text-indigo-600 after:scale-x-100" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <Link 
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 rounded-full border border-gray-100 hover:border-indigo-100 transition-colors cursor-pointer"
              >
                <User size={14} className="text-indigo-500" />
                <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">
                  {user.fullName || user.email.split("@")[0]}
                </span>
              </Link>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all duration-200 group active:scale-95"
            >
              <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 active:scale-95"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-2 mt-4">
              <Link 
                to="/" 
                className={`px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive("/") ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/contact" 
                className={`px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive("/contact") ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {user && (
                <Link 
                  to="/profile" 
                  className={`px-4 py-3 rounded-xl text-sm font-bold ${
                    isActive("/profile") ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
