import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        customer: form,
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
      };

      await axios.post(`${API}/orders`, orderData);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8 animate-fade-in">
        <div className="bg-white p-16 rounded-[3rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 text-center max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Placed!</h2>
          <p className="text-lg text-gray-500 font-medium mb-10">
            Thank you for your purchase. We've sent a confirmation email to <span className="text-indigo-600 font-bold">{form.email}</span>.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
          <button onClick={() => navigate("/")} className="btn-primary">Go to Store</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Checkout</h1>
          <p className="text-gray-500 font-medium">Complete your order details below</p>
        </div>
        <button 
          onClick={() => navigate("/cart")}
          className="text-sm font-black text-gray-400 hover:text-indigo-600 flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO CART
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <User size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="input-field pl-12"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field pl-12"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field pl-12"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left md:col-span-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Shipping Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <textarea
                      required
                      rows="3"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="input-field pl-12 resize-none pt-4"
                      placeholder="Street address, City, State, ZIP"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Payment Method</h3>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 border-dashed text-center">
                <p className="text-gray-500 font-medium">Cash on Delivery (COD)</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Payment integration coming soon</p>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 sticky top-28">
            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Order Review</h3>
            
            <div className="max-h-60 overflow-y-auto mb-8 pr-2 space-y-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img src={item.images?.[0]} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-black text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs font-medium text-gray-500">{item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="text-sm font-black text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Delivery</span>
                <span className="text-emerald-500 font-black uppercase tracking-widest text-xs mt-1">Free</span>
              </div>
              <div className="h-px bg-gray-50 my-6" />
              <div className="flex justify-between items-end">
                <span className="text-gray-900 font-black">Grand Total</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : (
                <>
                  Confirm Order
                  <ShieldCheck size={22} />
                </>
              )}
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-4 text-gray-400 opacity-50 grayscale hover:opacity-100 transition-all cursor-default">
              <Truck size={20} />
              <ShieldCheck size={20} />
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;