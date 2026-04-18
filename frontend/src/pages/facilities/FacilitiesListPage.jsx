import { Building2, LayoutGrid, List, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import FacilityCard from "../../components/facilities/FacilityCard";
import FacilityFilters from "../../components/facilities/FacilityFilters";
import FacilityTable from "../../components/facilities/FacilityTable";
import {
  useDeleteFacility,
  useFacilitiesList,
  useFacilitySearch,
  useUpdateFacilityStatus,
} from "../../hooks/useFacilities";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";
import { isAdminUser } from "../../utils/auth";

const initialFilters = {
  type: "",
  status: "",
  location: "",
  minCapacity: "",
};

function FacilitiesListPage() {
  const navigate = useNavigate();
  const admin = isAdminUser();
  const [viewMode, setViewMode] = useState("table");
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [deleteId, setDeleteId] = useState(null);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => String(value).trim() !== ""),
    [filters]
  );

  const listQuery = useFacilitiesList(
    { page, size, sort: "name,asc" },
    !hasActiveFilters
  );

  const searchQuery = useFacilitySearch(
    {
      ...filters,
      minCapacity: filters.minCapacity
        ? Number(filters.minCapacity)
        : undefined,
      page,
      size,
      sort: "name,asc",
    },
    hasActiveFilters
  );

  const activeQuery = hasActiveFilters ? searchQuery : listQuery;

  const deleteFacility = useDeleteFacility();
  const updateStatus = useUpdateFacilityStatus();

  const facilities = activeQuery.data?.content || [];
  const totalPages = activeQuery.data?.totalPages || 0;
  const totalElements = activeQuery.data?.totalElements || 0;

  const handleEdit = (id) => navigate(`/facilities/${id}?edit=true`);
  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = () => {
    if (!deleteId) {
      return;
    }

    deleteFacility.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  };

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-7 w-7 text-indigo-600" />
            <h1 className="page-title">Facilities</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`btn-secondary inline-flex items-center gap-2 ${
                viewMode === "table" ? "border-indigo-500 text-indigo-700" : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
              Table
            </button>
            <button
              type="button"
              className={`btn-secondary inline-flex items-center gap-2 ${
                viewMode === "card" ? "border-indigo-500 text-indigo-700" : ""
              }`}
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4" />
              Card
            </button>

            {admin && (
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto"
                onClick={() => navigate("/facilities/new")}
              >
                <PlusCircle className="h-4 w-4" />
                Add Facility
              </button>
            )}
          </div>
        </div>

        <FacilityFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {activeQuery.isLoading ? (
          <LoadingSpinner />
        ) : activeQuery.isError ? (
          <ErrorMessage
            message={
              activeQuery.error?.response?.data?.message ||
              "Failed to load facilities"
            }
            onRetry={activeQuery.refetch}
          />
        ) : viewMode === "table" ? (
          <FacilityTable
            facilities={facilities}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            isAdmin={admin}
            isLoading={false}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isAdmin={admin}
              />
            ))}
            {!facilities.length && (
              <div className="card col-span-full text-center text-gray-500">
                No facilities found
              </div>
            )}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={size}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setSize(newSize);
            setPage(0);
          }}
        />

        <ConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Delete Facility"
          message="Are you sure you want to delete this facility? This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="danger"
        />
      </div>
    </div>
  );
}

export default FacilitiesListPage;
