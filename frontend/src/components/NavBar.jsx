import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Store, LogOut, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <Store size={22} className="text-indigo-600" />
            <span>ShopName</span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              Products
            </Link>
            <Link to="/contact" className="hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 border-r border-gray-100 pr-4 mr-2">
                <User size={16} className="text-gray-400" />
                <span className="font-medium truncate max-w-[100px]">
                  {user.fullName || user.email.split("@")[0]}
                </span>
              </div>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors p-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
