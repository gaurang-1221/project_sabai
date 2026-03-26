import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Trash2,
  Edit,
  Package,
  ShoppingBag,
  LogOut,
  X,
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle,
  History,
  Menu,
} from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'orders' | 'history'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [], // This will hold existing image URLs
    imageFiles: [], // This will hold new File objects
  });
  const [previews, setPreviews] = useState([]);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Generate previews for new files
    if (form.imageFiles && form.imageFiles.length > 0) {
      const newPreviews = Array.from(form.imageFiles).map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [form.imageFiles]);

  useEffect(() => {
    if (!token || (user && user.role !== 'admin')) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [token, activeTab, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (activeTab === "products") {
        const { data } = await axios.get(`${API}/products`);
        setProducts(data);
      } else {
        // Fetch all orders for both 'orders' and 'history' tabs
        const { data } = await axios.get(`${API}/orders`, config);
        setOrders(data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/admin/login");
      }
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm("Mark this order as complete? It will be moved to History.")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API}/orders/${orderId}/status`, { status: "complete" }, config);
      // Optimistically update or just re-fetch
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'complete' } : o));
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const handleClearHistory = async () => {
    const count = orders.filter(o => o.status === 'complete').length;
    if (count === 0) {
      alert("No completed orders to clear.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete all ${count} completed orders? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API}/orders/history`, config);
      setOrders(orders.filter(o => o.status !== 'complete'));
      alert("Order history cleared successfully!");
    } catch (err) {
      console.error("Clear history error:", err);
      alert("Failed to clear history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order record? This cannot be undone.")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API}/orders/${id}`, config);
      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API}/products/${id}`, config);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        } 
      };
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);

      // Existing images to keep (if editing)
      if (editingProduct && form.images) {
        form.images.forEach((img) => {
          formData.append("existingImages", img);
        });
      }

      // New image files
      if (form.imageFiles && form.imageFiles.length > 0) {
        Array.from(form.imageFiles).forEach((file) => {
          formData.append("images", file);
        });
      }

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct._id}`, formData, config);
      } else {
        await axios.post(`${API}/products`, formData, config);
      }

      setShowModal(false);
      setEditingProduct(null);
      setForm({ name: "", description: "", price: "", category: "", stock: "", images: [], imageFiles: [] });
      fetchData();
    } catch (err) {
      console.error("Save product error details:", err.response?.data || err.message);
      alert(`Failed to save product: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images || [], // Store existing images
      imageFiles: [], // Clear any pending new files
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex animate-fade-in relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-[100dvh] w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Package className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Admin<span className="text-indigo-600">Hub</span>
            </h1>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Management Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto min-h-0">
          <button
            onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-[1.25rem] text-sm font-black transition-all duration-300 ${
              activeTab === "products"
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Package size={20} />
            Products
          </button>
          <button
            onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-[1.25rem] text-sm font-black transition-all duration-300 ${
              activeTab === "orders"
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShoppingBag size={20} />
            Orders
          </button>
          <button
            onClick={() => { setActiveTab("history"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-[1.25rem] text-sm font-black transition-all duration-300 ${
              activeTab === "history"
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <History size={20} />
            History
          </button>
        </nav>

        <div className="p-6 border-t border-gray-50 bg-gray-50/30">
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-900 truncate">{user.fullName || user.email.split("@")[0]}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-[1.25rem] text-sm font-black text-rose-500 hover:bg-rose-50 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full max-w-full min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 w-full">
          <div className="px-4 lg:px-10 py-4 lg:py-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 lg:gap-8 min-w-0">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl flex-shrink-0"
              >
                <Menu size={24} />
              </button>
              <div className="min-w-0">
                <h2 className="text-xl lg:text-2xl font-black text-gray-900 capitalize tracking-tight truncate">
                  {activeTab}
                </h2>
                <p className="hidden sm:block text-xs font-medium text-gray-500 mt-0.5 truncate">Manage your store's {activeTab} effortlessly</p>
              </div>

              {/* Admin Profile Info */}
              {user && (
                <div className="hidden lg:flex items-center gap-4 pl-8 border-l border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 shadow-sm">
                    {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 leading-tight">{user.fullName || user.email.split("@")[0]}</p>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Active Session</p>
                  </div>
                </div>
              )}
            </div>
            
            {activeTab === "products" && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setForm({ name: "", description: "", price: "", category: "", stock: "", images: [], imageFiles: [] });
                  setShowModal(true);
                }}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98] flex-shrink-0"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">New Product</span>
              </button>
            )}

            {activeTab === "history" && (
              <button
                onClick={handleClearHistory}
                className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-black px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl transition-all shadow-xl shadow-rose-100 hover:shadow-rose-200 active:scale-[0.98] flex-shrink-0"
              >
                <Trash2 size={20} />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-10 w-full max-w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full animate-spin border-t-indigo-600" />
                <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
              </div>
              <p className="text-sm text-gray-500 font-black uppercase tracking-widest mt-6">Loading {activeTab}...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100 flex items-center gap-4 text-rose-700">
              <AlertCircle size={28} />
              <div>
                <p className="font-black">Error occurred</p>
                <p className="text-sm font-medium opacity-80">{error}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      {activeTab === "products" ? (
                        <>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Product</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Category</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Price</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Stock</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                        </>
                      ) : (
                        <>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Order ID</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Customer</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Date</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Total</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px]">Status</th>
                          <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                        </>
                      ) }
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeTab === "products" ? (
                      products.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                <img
                                  src={p.images?.[0] || "/placeholder.jpg"}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              </div>
                              <span className="font-bold text-gray-900">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-wider">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 font-bold text-gray-900 text-base">₹{p.price}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${p.stock < 5 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                              <span className={`font-bold ${p.stock < 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {p.stock} <span className="text-[10px] font-medium opacity-60">units</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      orders
                        .filter(o => activeTab === 'history' ? o.status === 'complete' : o.status !== 'complete')
                        .map((o) => (
                        <tr key={o._id} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-8 py-5 font-mono text-xs text-gray-400 font-bold">#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{o.customer.fullName}</span>
                              <span className="text-[10px] font-medium text-gray-400 tracking-wider">{o.customer.email}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-gray-500 font-medium">
                            {new Date(o.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </td>
                          <td className="px-8 py-5 text-gray-900 font-black text-base">₹{o.totalAmount}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              o.status === 'complete' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              {o.status !== 'complete' && (
                                <button
                                  onClick={() => handleCompleteOrder(o._id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                                >
                                  <CheckCircle size={14} />
                                  Complete
                                </button>
                              )}
                              <button
                                className="p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              {activeTab === 'history' && (
                                <button
                                  onClick={() => handleDeleteOrder(o._id)}
                                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                  title="Delete Order"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 lg:px-10 py-6 lg:py-8 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
                  {editingProduct ? "Update Product" : "New Creation"}
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Fill in the details for your masterpiece</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 lg:p-3 text-gray-400 hover:text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-6 lg:p-10 space-y-6 overflow-y-auto w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Premium Leather Bag"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                  <textarea
                    required
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Tell the story of this product..."
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Inventory Stock</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative group">
                    <input
                      required
                      list="category-suggestions"
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="e.g. Accessories"
                    />
                    <datalist id="category-suggestions">
                      {[...new Set(products.map(p => p.category))].map((cat, i) => (
                        <option key={i} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium italic ml-1">
                    * Type a new category name or select from the suggestions above.
                  </p>
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Images</label>
                  
                  {/* Image Previews & Existing Images */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {/* Existing Images */}
                    {form.images?.map((img, idx) => (
                      <div key={`existing-${idx}`} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/40 py-0.5 text-[8px] text-white text-center font-black uppercase tracking-tighter">Current</div>
                      </div>
                    ))}
                    
                    {/* New File Previews */}
                    {previews.map((url, idx) => (
                      <div key={`new-${idx}`} className="relative group aspect-square rounded-2xl overflow-hidden border border-indigo-100 shadow-sm bg-indigo-50/30">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = Array.from(form.imageFiles).filter((_, i) => i !== idx);
                            setForm({ ...form, imageFiles: newFiles });
                          }}
                          className="absolute top-1 right-1 p-1.5 bg-indigo-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-indigo-600/60 py-0.5 text-[8px] text-white text-center font-black uppercase tracking-tighter">New</div>
                      </div>
                    ))}

                    {/* Add More Trigger */}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-gray-400 hover:text-indigo-600">
                      <Plus size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Add Photo</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setForm({ ...form, imageFiles: [...(form.imageFiles || []), ...files] });
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] text-gray-400 font-medium italic">
                    * You can upload up to 5 images per product.
                  </p>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-5 rounded-[1.25rem] transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98] mt-4"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : "Save Masterpiece"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
