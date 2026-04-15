import { ASSET_TYPES, FACILITY_TYPES } from "./constants";

export const formatTime = (timeString) => {
  if (!timeString) {
    return "-";
  }

  const date = new Date(`1970-01-01T${timeString}`);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) {
    return "-";
  }

  const date = new Date(dateTimeString);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getStatusColor = (status) => {
  const map = {
    ACTIVE: "bg-green-100 text-green-800",
    OUT_OF_SERVICE: "bg-red-100 text-red-800",
    UNDER_MAINTENANCE: "bg-yellow-100 text-yellow-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

export const getFacilityTypeLabel = (type) => {
  return FACILITY_TYPES.find((item) => item.value === type)?.label || type;
};

export const getAssetTypeLabel = (type) => {
  return ASSET_TYPES.find((item) => item.value === type)?.label || type;
};

export const buildSearchParams = (filters) => {
  const entries = Object.entries(filters || {}).filter(([, value]) => {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === "string" && value.trim() === "") {
      return false;
    }
    return true;
  });

  return Object.fromEntries(entries);
};
