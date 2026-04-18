import { Clock, Hash, MapPin, Pencil, Trash2 } from "lucide-react";
import { RESOURCE_STATUSES } from "../../utils/constants";
import { formatTime, getAssetTypeLabel } from "../../utils/helpers";
import StatusBadge from "../common/StatusBadge";

function AssetCard({ asset, onEdit, onDelete, onStatusChange, isAdmin }) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 break-words">
          {asset.name}
        </h3>
        <StatusBadge status={asset.status} />
      </div>

      <div className="mt-2 inline-flex px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
        {getAssetTypeLabel(asset.assetType)}
      </div>
      {asset.assetSubtype && (
        <p className="mt-1 text-sm text-gray-500">{asset.assetSubtype}</p>
      )}

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {asset.location}
        </p>
        {asset.serialNumber && (
          <p className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            {asset.serialNumber}
          </p>
        )}
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {formatTime(asset.availabilityStart)} -{" "}
          {formatTime(asset.availabilityEnd)}
        </p>
      </div>

      {asset.description && (
        <p className="mt-4 text-sm text-gray-500 line-clamp-2">
          {asset.description}
        </p>
      )}

      {isAdmin && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn-secondary text-xs inline-flex items-center gap-1"
            onClick={() => onEdit(asset.id)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            className="btn-danger text-xs inline-flex items-center gap-1"
            onClick={() => onDelete(asset.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
          <select
            className="w-full sm:w-auto sm:ml-auto border border-gray-300 rounded px-2 py-1 text-xs"
            value={asset.status}
            onChange={(e) => onStatusChange(asset.id, e.target.value)}
          >
            {RESOURCE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default AssetCard;
