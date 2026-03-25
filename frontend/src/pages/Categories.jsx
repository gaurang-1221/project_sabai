import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutGrid, ArrowRight, Package, Sparkles } from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/products`);
        const uniqueCategories = [...new Set(data.map((p) => p.category))];
        
        // Enrich category data with a count and a representative image
        const enriched = uniqueCategories.map(cat => {
          const catProducts = data.filter(p => p.category === cat);
          return {
            name: cat,
            count: catProducts.length,
            image: catProducts[0]?.images?.[0] || "/placeholder.jpg"
          };
        });
        
        setCategories(enriched);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-100 rounded-full animate-spin border-t-indigo-600 mb-4" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Collections...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
            <LayoutGrid size={12} />
            Explore Collections
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Shop by <span className="text-indigo-600">Category</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Discover our curated collections of premium products, designed for every style and occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
              className="group relative bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 cursor-pointer h-[400px]"
            >
              {/* Image with overlay */}
              <div className="absolute inset-0">
                <img 
                  src={cat.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={cat.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-left">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Arrivals</span>
                  </div>
                  <h3 className="text-3xl font-black text-white capitalize mb-2 tracking-tight">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 font-bold flex items-center gap-2">
                      <Package size={16} />
                      {cat.count} Products
                    </p>
                    <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="bg-white p-20 rounded-[3rem] border border-gray-100 text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-4">No categories found</h2>
            <p className="text-gray-500 font-medium">Please add some products to see collections.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
