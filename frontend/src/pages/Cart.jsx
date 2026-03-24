import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={52} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl font-bold text-gray-900">
            Your cart
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cart items */}
          <div className="flex-1 space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm"
              >
                {/* Image */}
                <Link to={`/products/${item._id}`} className="shrink-0">
                  <img
                    src={item.images?.[0] || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-50"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/products/${item._id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-gray-300 hover:text-rose-400 transition-colors shrink-0 mt-0.5"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <span className="text-xs text-indigo-600 capitalize font-medium">
                    {item.category}
                  </span>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Order summary</h2>

              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-xs text-gray-500">
                    <span className="truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="shrink-0 font-medium text-gray-700">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Shipping calculated at checkout</p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                Proceed to checkout →
              </button>

              <Link
                to="/"
                className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-3 transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;