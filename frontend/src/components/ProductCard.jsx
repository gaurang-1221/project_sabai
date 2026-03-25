import { Link } from "react-router-dom";
import { ShoppingCart, Tag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 flex flex-col h-full relative">
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm flex items-center gap-1.5 border border-indigo-50">
          <Tag size={10} />
          {product.category}
        </div>
      </div>

      {/* Rating (Static/Sample) */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-amber-400 text-white px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-md shadow-amber-200">
          <Star size={10} fill="currentColor" />
          4.5
        </div>
      </div>

      {/* Image Container */}
      <Link 
        to={`/product/${product._id}`} 
        className="aspect-square overflow-hidden bg-gray-50 relative block"
      >
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-300" />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <Link 
          to={`/product/${product._id}`}
          className="block"
        >
          <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-4 h-8 leading-relaxed">
            {product.description}
          </p>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</span>
            <span className="text-xl font-black text-gray-900">₹{product.price}</span>
          </div>

          <button
            onClick={() => addItem(product, 1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-90 group/btn"
            title="Add to Cart"
          >
            <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stock indicator */}
      {product.stock < 5 && (
        <div className="absolute top-1/2 left-0 w-full text-center pointer-events-none">
          <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg -rotate-12 inline-block">
            LOW STOCK
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;