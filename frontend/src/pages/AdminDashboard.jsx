import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'orders'
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
    images: [],
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [token, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (activeTab === "products") {
        const { data } = await axios.get(`${API}/products`);
        setProducts(data);
      } else {
        const { data } = await axios.get(`${API}/orders`, config);
        setOrders(data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);

      // Handle images (new files only for now)
      if (form.imageFiles) {
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
      setForm({ name: "", description: "", price: "", category: "", stock: "" });
      fetchData();
    } catch (err) {
      alert("Failed to save product");
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
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-indigo-600" size={24} />
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "products"
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Package size={20} />
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "orders"
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShoppingBag size={20} />
            Orders
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="px-8 py-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 capitalize">
              {activeTab}
            </h2>
            {activeTab === "products" && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setForm({ name: "", description: "", price: "", category: "", stock: "" });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-100"
              >
                <Plus size={18} />
                Add Product
              </button>
            )}
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
              <p className="text-sm text-gray-500 font-medium">Loading {activeTab}...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 flex items-center gap-4 text-rose-700">
              <AlertCircle size={24} />
              <p className="font-medium">{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  {activeTab === "products" ? (
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-700">Product</th>
                      <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-4 font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-4 font-semibold text-gray-700">Stock</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-700">Order ID</th>
                      <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 font-semibold text-gray-700">Total</th>
                      <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  ) }
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeTab === "products" ? (
                    products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || "/placeholder.jpg"}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                              alt=""
                            />
                            <span className="font-semibold text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600 font-medium text-xs">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium">₹{p.price}</td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${p.stock < 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{o._id.slice(-8)}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{o.customer.fullName}</span>
                            <span className="text-xs text-gray-500">{o.customer.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">₹{o.totalAmount}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold capitalize">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Product Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Classic White Tee"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                    placeholder="Describe the product..."
                  ></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Stock</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Category</label>
                  <input
                    required
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Clothing"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, imageFiles: e.target.files })}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-2xl transition-all shadow-lg shadow-indigo-100 mt-4"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
