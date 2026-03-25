import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { ArrowLeft, LayoutGrid, PackageOpen, Loader2 } from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const CategoryDetail = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/products`);
        const filtered = data.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading {categoryName}...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 text-left">
          <div>
            <button 
              onClick={() => navigate("/categories")}
              className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-indigo-600 transition-colors group mb-6"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              BACK TO CATEGORIES
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
                <LayoutGrid size={24} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 capitalize tracking-tight">
                {categoryName}
              </h1>
            </div>
            <p className="text-lg text-gray-500 font-medium max-w-xl">
              Browsing our premium selection of {products.length} products in the {categoryName} collection.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-100/10 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <PackageOpen size={48} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">No products found</h2>
            <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">
              We couldn't find any products in the {categoryName} category right now.
            </p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
