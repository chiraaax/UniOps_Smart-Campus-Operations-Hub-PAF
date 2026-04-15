import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZES } from "../../utils/constants";

function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const start = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements || 0);

  const generatePageNumbers = () => {
    const maxButtons = 5;
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(safeTotalPages - 1, startPage + maxButtons - 1);
    const adjustedStart = Math.max(0, endPage - maxButtons + 1);
    return Array.from(
      { length: endPage - adjustedStart + 1 },
      (_, i) => adjustedStart + i
    );
  };

  return (
    <div className="mt-6 card p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-gray-500 text-center lg:text-left">
        Showing {start}-{end} of {totalElements || 0} results
      </p>

      <div className="flex items-center justify-center gap-1 overflow-x-auto pb-1">
        <button
          type="button"
          className="btn-secondary px-3 py-2"
          onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {generatePageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm border transition-colors duration-200 ${
              currentPage === page
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          type="button"
          className="btn-secondary px-3 py-2"
          onClick={() =>
            onPageChange(Math.min(currentPage + 1, safeTotalPages - 1))
          }
          disabled={currentPage >= safeTotalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-center lg:justify-end gap-2">
        <label className="text-sm text-gray-600">Rows per page</label>
        <select
          className="input-field w-24"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Pagination;
