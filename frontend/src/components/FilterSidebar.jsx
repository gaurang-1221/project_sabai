import { SlidersHorizontal } from "lucide-react";

const FilterSidebar = ({ categories, selected, onSelect }) => {
  return (
    <aside className="w-full sm:w-56 shrink-0">
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">

        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={14} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Filter by category</span>
        </div>

        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelect("")}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selected === ""
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onSelect(cat)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                  selected === cat
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>

      </div>
    </aside>
  );
};

export default FilterSidebar;