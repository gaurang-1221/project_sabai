import { LayoutGrid, Check } from "lucide-react";

const FilterSidebar = ({ categories, selected, onSelect }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-left">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <LayoutGrid size={18} />
        </div>
        <h3 className="text-lg font-black text-gray-900 tracking-tight">Categories</h3>
      </div>
      
      <div className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 group ${
              selected === cat
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="capitalize">{cat}</span>
            {selected === cat && <Check size={14} className="animate-in zoom-in duration-300" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;