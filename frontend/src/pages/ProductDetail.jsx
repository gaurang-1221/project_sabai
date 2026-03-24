import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, ArrowLeft, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setAdded(false);
        setQuantity(1);
        setActiveImage(0);
        const { data } = await axios.get(`${API}/products/${id}`);
        setProduct(data);

        // Fetch related products (same category, exclude self)
        const { data: allProducts } = await axios.get(`${API}/products`);
        const rel = allProducts
          .filter((p) => p.category === data.category && p._id !== id)
          .slice(0, 3);
        setRelated(rel);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const images = product?.images?.length ? product.images : ["/placeholder.jpg"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-4 py-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-7 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-20 bg-gray-200 rounded w-full" />
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-rose-500 font-medium mb-4">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-indigo-600 hover:underline"
        >
          Back to products
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Image gallery */}
          <div className="w-full md:w-1/2">
            <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden aspect-square shadow-sm">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-1.5 transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-1.5 transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImage
                        ? "border-indigo-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex-1">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest capitalize">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-5">
              {inStock ? (
                <>
                  <CheckCircle size={15} className="text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-medium">
                    {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={15} className="text-rose-400" />
                  <span className="text-sm text-rose-500 font-medium">Out of stock</span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="flex items-center gap-3 mb-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="px-4 py-2.5 text-sm font-semibold text-gray-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium text-sm transition-all ${
                    added
                      ? "bg-emerald-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle size={16} />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Add to cart
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Go to cart */}
            {added && (
              <Link
                to="/cart"
                className="block text-center text-sm text-indigo-600 hover:underline mt-2"
              >
                View cart →
              </Link>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;