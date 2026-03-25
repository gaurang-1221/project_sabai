import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import { PackageOpen, Sparkles, ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All products");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== "All products") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, selectedCategory, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(data);
      setFiltered(data);
      const cats = ["All products", ...new Set(data.map((p) => p.category))];
      setCategories(cats);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white rounded-[3rem] mt-4 mb-16 border border-gray-100 shadow-2xl shadow-indigo-100/50">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-50 rounded-full blur-3xl opacity-50" />
        
        <div className="relative px-8 py-20 md:py-28 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100">
            <Sparkles size={14} />
            New Collection 2024
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
            Discover Your <span className="text-indigo-600">Unique</span> Style.
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Explore our curated collection of premium products designed for modern living. Quality meets elegance in every piece.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              Shop Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-gray-50 text-gray-900 font-black rounded-2xl border border-gray-200 transition-all active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
        {[
          { icon: <Truck className="text-indigo-600" />, title: "Free Shipping", desc: "On all orders over ₹2000" },
          { icon: <ShieldCheck className="text-emerald-600" />, title: "Secure Payment", desc: "100% protected transactions" },
          { icon: <Clock className="text-purple-600" />, title: "24/7 Support", desc: "Always here to help you" }
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-5 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-gray-50 rounded-2xl">{f.icon}</div>
            <div className="text-left">
              <h4 className="font-black text-gray-900">{f.title}</h4>
              <p className="text-sm text-gray-500 font-medium">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div id="products-grid" className="scroll-mt-24">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-500 font-medium">{filtered.length} products curated for you</p>
          </div>
          <div className="w-full md:w-96">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-8">
              <FilterSidebar
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
              
              {/* Promo Card */}
              <div className="bg-indigo-600 rounded-[2rem] p-8 text-white text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-2xl font-black mb-4 relative z-10">Get 20% Off</h4>
                <p className="text-indigo-100 text-sm mb-6 font-medium relative z-10">Subscribe to our newsletter and get exclusive deals.</p>
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-sm relative z-10 active:scale-95 transition-transform">
                  Join Now
                </button>
              </div>
            </div>
          </aside>

          {/* Grid Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-8 space-y-4">
                      <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                      <div className="h-6 bg-gray-100 rounded-full w-3/4" />
                      <div className="h-4 bg-gray-100 rounded-full w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 p-12 rounded-[2rem] border border-rose-100 text-center">
                <p className="text-rose-600 font-bold mb-4">{error}</p>
                <button onClick={fetchProducts} className="btn-primary">Try Again</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border border-gray-100 text-center">
                <PackageOpen size={64} className="text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 font-medium mb-8">Try searching for something else or reset your filters.</p>
                <button 
                  onClick={() => { setSearch(""); setSelectedCategory("All products"); }}
                  className="btn-secondary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;