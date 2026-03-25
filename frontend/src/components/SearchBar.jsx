import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative group max-w-2xl w-full mx-auto">
      <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl blur-xl group-focus-within:bg-indigo-600/10 transition-colors -z-10" />
      <div className="relative flex items-center">
        <Search className="absolute left-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for premium products..."
          className="w-full pl-16 pr-14 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 shadow-xl shadow-indigo-100/20 transition-all duration-300"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-6 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;