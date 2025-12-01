import { useState } from "react";
import { FilterXIcon, X } from "lucide-react";

export default function OrderFilters({ applyFilters, currentFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentFilters.status || "");
  const [dateRange, setDateRange] = useState({
    from: currentFilters.from || "",
    to: currentFilters.to || "",
  });

  const handleApply = () => {
    applyFilters({
        status,
        from: dateRange.from,
        to: dateRange.to,
    });
    setIsOpen(false);
};

const handleClear = () => {
    setStatus('');
    setDateRange({ from: '', to: '' });
    applyFilters({ status: '', from: '', to: '' });
};


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <FilterXIcon className="w-5 h-5" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>

          
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="placed">Placed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2"
              value={dateRange.from}
              onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
            />
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">To</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2"
              value={dateRange.to}
              onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>

            <button
                onClick={handleClear}
                className="text-sm text-red-600 hover:underline"
            >
                Clear All
            </button>
        </div>
      )}
    </div>
  );
}
