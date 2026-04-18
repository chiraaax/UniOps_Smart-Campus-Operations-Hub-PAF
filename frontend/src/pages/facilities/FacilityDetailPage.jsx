import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import FacilityForm from "../../components/facilities/FacilityForm";
import FacilityStatusModal from "../../components/facilities/FacilityStatusModal";
import {
  useDeleteFacility,
  useFacilityById,
  useUpdateFacility,
  useUpdateFacilityStatus,
} from "../../hooks/useFacilities";
import { isAdminUser } from "../../utils/auth";
import {
  formatDate,
  formatDateTime,
  formatTime,
  getFacilityTypeLabel,
} from "../../utils/helpers";

function FacilityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const admin = isAdminUser();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const isEditing = admin && searchParams.get("edit") === "true";

  const facilityQuery = useFacilityById(id);
  const deleteFacility = useDeleteFacility();
  const updateStatus = useUpdateFacilityStatus();
  const updateFacility = useUpdateFacility();

  if (facilityQuery.isLoading) {
    return <LoadingSpinner message="Loading facility..." />;
  }

  if (facilityQuery.isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            message={
              facilityQuery.error?.response?.data?.message ||
              "Failed to load facility"
            }
            onRetry={facilityQuery.refetch}
          />
        </div>
      </div>
    );
  }

  const facility = facilityQuery.data;

  const details = [
    { label: "Type", value: getFacilityTypeLabel(facility.facilityType) },
    { label: "Capacity", value: facility.capacity },
    { label: "Location", value: facility.location },
    {
      label: "Availability Window",
      value: `${formatTime(facility.availabilityStart)} - ${formatTime(
        facility.availabilityEnd
      )}`,
    },
    { label: "Booking Date", value: formatDate(facility.bookingDate) },
    { label: "Description", value: facility.description || "-" },
    { label: "Created At", value: formatDateTime(facility.createdAt) },
    { label: "Updated At", value: formatDateTime(facility.updatedAt) },
  ];

  const openEditMode = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("edit", "true");
    setSearchParams(nextParams, { replace: true });
  };

  const closeEditMode = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("edit");
    setSearchParams(nextParams, { replace: true });
  };

  const handleUpdate = (formData) => {
    updateFacility.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Facility updated successfully");
          closeEditMode();
          facilityQuery.refetch();
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to update facility"
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          type="button"
          className="btn-secondary inline-flex items-center gap-2"
          onClick={() => navigate("/facilities")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Facilities
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {facility.name}
              </h1>
              <StatusBadge status={facility.status} />
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                {getFacilityTypeLabel(facility.facilityType)}
              </span>
            </div>
          </div>

          {admin && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn-secondary inline-flex items-center gap-2"
                onClick={openEditMode}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                className="btn-danger inline-flex items-center gap-2"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="card lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Facility Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1 break-words">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Status</h2>
            <StatusBadge status={facility.status} />
            {admin && (
              <button
                type="button"
                className="btn-primary mt-4"
                onClick={() => setStatusOpen(true)}
              >
                Change Status
              </button>
            )}
          </section>
        </div>

        {isEditing && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Facility
              </h2>
              <button
                type="button"
                className="btn-secondary"
                onClick={closeEditMode}
              >
                Cancel
              </button>
            </div>

            <FacilityForm
              defaultValues={facility}
              onSubmit={handleUpdate}
              isLoading={updateFacility.isPending}
              isEditMode
            />
          </section>
        )}

        <ConfirmModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => {
            deleteFacility.mutate(facility.id, {
              onSuccess: () => navigate("/facilities"),
            });
          }}
          title="Delete Facility"
          message="Are you sure you want to delete this facility?"
        />

        <FacilityStatusModal
          isOpen={statusOpen}
          onClose={() => setStatusOpen(false)}
          facility={facility}
          onUpdate={(facilityId, status) => {
            updateStatus.mutate(
              { id: facilityId, status },
              {
                onSuccess: () => {
                  setStatusOpen(false);
                  facilityQuery.refetch();
                },
              }
            );
          }}
          isLoading={updateStatus.isPending}
        />
      </div>
    </div>
  );
}

export default FacilityDetailPage;
