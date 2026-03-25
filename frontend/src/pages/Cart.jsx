import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="bg-white p-16 rounded-[3rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={48} className="text-gray-200" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 font-medium mb-10">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate("/")}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            Start Shopping
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (    <div className="pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-500 font-medium">You have {cart.length} items in your selection</p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="text-sm font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          CONTINUE SHOPPING
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col sm:flex-row items-center gap-8"
            >
              {/* Image */}
              <Link to={`/product/${item._id}`} className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 text-left">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-xl font-black text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">{item.category}</p>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-2 hover:bg-white hover:text-indigo-600 rounded-lg transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-black text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-2 hover:bg-white hover:text-indigo-600 rounded-lg transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xl font-black text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 sticky top-28">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-1">Free</span>
              </div>
              <div className="h-px bg-gray-50 my-6" />
              <div className="flex justify-between items-end">
                <span className="text-gray-900 font-black">Total</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg"
            >
              Proceed to Checkout
              <ArrowRight size={22} />
            </button>
            
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center mt-6">
              Secure SSL Encryption Guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;