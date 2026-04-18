import { Inbox, Pencil, Trash2 } from "lucide-react";
import { formatDate, formatTime, getAssetTypeLabel } from "../../utils/helpers";
import StatusBadge from "../common/StatusBadge";

function AssetTable({ assets, onEdit, onDelete, isAdmin, isLoading }) {
  const columns = [
    "Name",
    "Type",
    "Subtype",
    "Serial Number",
    "Location",
    "Availability",
    "Booking Date",
    "Status",
  ];
  if (isAdmin) {
    columns.push("Actions");
  }

  if (isLoading) {
    return (
      <div className="card p-0 overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-3 px-4 text-left text-xs uppercase text-gray-500 font-medium"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td colSpan={columns.length} className="py-4 px-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!assets?.length) {
    return (
      <div className="card text-center py-12">
        <Inbox className="h-10 w-10 text-gray-300 mx-auto" />
        <p className="mt-3 text-gray-500">No assets found</p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="py-3 px-4 text-left text-xs uppercase text-gray-500 font-medium"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.id}
              className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
            >
              <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                {asset.name}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {getAssetTypeLabel(asset.assetType)}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {asset.assetSubtype || "-"}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {asset.serialNumber || "-"}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {asset.location}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {formatTime(asset.availabilityStart)} -{" "}
                {formatTime(asset.availabilityEnd)}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {formatDate(asset.bookingDate)}
              </td>
              <td className="py-4 px-4 text-sm">
                <StatusBadge status={asset.status} />
              </td>
              {isAdmin && (
                <td className="py-4 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Edit"
                      className="p-1 text-indigo-600 hover:text-indigo-700"
                      onClick={() => onEdit(asset.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="p-1 text-red-600 hover:text-red-700"
                      onClick={() => onDelete(asset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTable;
