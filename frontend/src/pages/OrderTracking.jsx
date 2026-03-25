import { useState } from "react";
import axios from "axios";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowRight, ShoppingBag } from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { data } = await axios.get(`${API}/orders/track/${orderId.trim()}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found. Please check your ID.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ["pending", "confirmed", "shipped", "delivered"];
    const currentIdx = steps.indexOf(status.toLowerCase());
    if (currentIdx === -1 && status.toLowerCase() === "complete") return 4;
    return currentIdx + 1;
  };

  return (
    <div className="pb-20 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
            <Truck size={12} />
            Real-time Updates
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Track your <span className="text-indigo-600">Order</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Enter your order ID to see the current status of your shipment.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 mb-10">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Paste your Order ID here (e.g. 65f...)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              disabled={loading}
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Now</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {order && (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-indigo-100/50 overflow-hidden animate-in fade-in zoom-in duration-500">
            {/* Order Header */}
            <div className="p-8 md:p-10 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Identifier</p>
                <h2 className="text-xl font-black text-gray-900 font-mono">#{order._id.toUpperCase()}</h2>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ordered On</p>
                <p className="font-bold text-gray-700">
                  {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="p-8 md:p-12">
              <div className="relative mb-16">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full" />
                {/* Progress Bar Active */}
                <div 
                  className="absolute top-1/2 left-0 h-1.5 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-1000"
                  style={{ width: `${(getStatusStep(order.status) - 1) * 33.33}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                  {[
                    { label: "Pending", icon: <Clock size={20} /> },
                    { label: "Confirmed", icon: <Package size={20} /> },
                    { label: "Shipped", icon: <Truck size={20} /> },
                    { label: "Delivered", icon: <CheckCircle size={20} /> },
                  ].map((step, i) => {
                    const stepNum = i + 1;
                    const isActive = getStatusStep(order.status) >= stepNum;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                          isActive 
                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110" 
                            : "bg-white text-gray-300 border-2 border-gray-100"
                        }`}>
                          {step.icon}
                        </div>
                        <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${
                          isActive ? "text-indigo-600" : "text-gray-400"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-[2rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="text-indigo-600" size={20} />
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Order Summary</h3>
                </div>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-indigo-600 bg-indigo-50 w-6 h-6 flex items-center justify-center rounded-lg text-[10px]">
                          {item.quantity}x
                        </span>
                        <span className="font-bold text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-black text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-black text-gray-400 uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="text-2xl font-black text-indigo-600">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-4 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <p className="text-xs font-bold text-indigo-700">
                  {order.status === "complete" 
                    ? "This order has been completed and archived." 
                    : `Current Status: Your order is ${order.status}.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
