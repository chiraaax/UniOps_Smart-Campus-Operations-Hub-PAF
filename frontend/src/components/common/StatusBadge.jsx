import { getStatusColor } from "../../utils/helpers";

function StatusBadge({ status }) {
  const label = (status || "")
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
