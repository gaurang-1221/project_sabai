import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import { PackageOpen } from "lucide-react";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;
console.log("Using API URL (Home):", API);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/products`);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Our Products</h1>
        <p className="text-sm text-gray-500">
          {products.length} items available
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-grow w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        {filtered.length !== products.length && (
          <span className="text-sm text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        {categories.length > 0 && (
          <div className="w-full lg:w-64">
            <FilterSidebar
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        )}

        {/* Grid */}
        <div className="flex-1">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-rose-500 font-medium">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 text-sm text-indigo-600 hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <PackageOpen size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;