import { RotateCcw } from "lucide-react";
import { ASSET_TYPES, RESOURCE_STATUSES } from "../../utils/constants";

function AssetFilters({ filters, onFilterChange, onReset }) {
  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">Type</label>
          <select
            className="input-field"
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
          >
            <option value="">All Types</option>
            {ASSET_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Status</label>
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            {RESOURCE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Location</label>
          <input
            className="input-field"
            type="text"
            placeholder="Filter by location"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Subtype</label>
          <input
            className="input-field"
            type="text"
            placeholder="Filter by subtype"
            value={filters.subtype}
            onChange={(e) => onFilterChange("subtype", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="btn-secondary inline-flex items-center gap-2"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default AssetFilters;
