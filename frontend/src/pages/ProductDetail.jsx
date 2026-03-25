import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/products/${id}`);
      setProduct(data);
      
      const { data: allProducts } = await axios.get(`${API}/products`);
      setRelated(allProducts.filter(p => p.category === data.category && p._id !== data._id).slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading details...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Product not found</h2>
        <button onClick={() => navigate("/")} className="btn-primary">Back to Store</button>
      </div>
    </div>
  );

  return (
    <div className="pb-20 animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/")}
        className="mb-8 flex items-center gap-2 text-sm font-black text-gray-400 hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO COLLECTION
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Gallery */}
        <div className="space-y-6 lg:sticky lg:top-28 h-fit">
          <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl shadow-indigo-100/50 group relative">
            <img 
              src={product.images?.[activeImg] || "/placeholder.jpg"} 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              alt={product.name}
            />
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 snap-start relative group ${
                    activeImg === i 
                      ? "border-indigo-600 ring-4 ring-indigo-50 shadow-lg scale-95" 
                      : "border-gray-100 hover:border-indigo-200 hover:scale-105"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  {activeImg !== i && (
                    <div className="absolute inset-0 bg-white/40 group-hover:bg-transparent transition-colors" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 w-fit border border-indigo-100">
            <Star size={12} fill="currentColor" />
            Top Rated Selection
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-6 mb-8">
            <span className="text-3xl font-black text-indigo-600">₹{product.price}</span>
            <div className="h-8 w-px bg-gray-100" />
            <span className={`text-sm font-black uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="space-y-8">
            {/* Quantity */}
            <div className="flex items-center gap-6">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-white hover:text-indigo-600 rounded-xl transition-all active:scale-90"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-white hover:text-indigo-600 rounded-xl transition-all active:scale-90"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stock === 0}
              className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ShoppingCart size={22} />
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-gray-50 pt-10">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Truck size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><ShieldCheck size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><RotateCcw size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 pt-20">
          <div className="flex items-end justify-between mb-12 text-left">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">You Might Also Like</h2>
              <p className="text-gray-500 font-medium text-sm">Similar items from the {product.category} collection</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;