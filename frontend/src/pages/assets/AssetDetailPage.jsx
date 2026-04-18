import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AssetForm from "../../components/assets/AssetForm";
import AssetStatusModal from "../../components/assets/AssetStatusModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import {
  useAssetById,
  useDeleteAsset,
  useUpdateAsset,
  useUpdateAssetStatus,
} from "../../hooks/useAssets";
import { isAdminUser } from "../../utils/auth";
import {
  formatDate,
  formatDateTime,
  formatTime,
  getAssetTypeLabel,
} from "../../utils/helpers";

function AssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const admin = isAdminUser();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const isEditing = admin && searchParams.get("edit") === "true";

  const assetQuery = useAssetById(id);
  const deleteAsset = useDeleteAsset();
  const updateStatus = useUpdateAssetStatus();
  const updateAsset = useUpdateAsset();

  if (assetQuery.isLoading) {
    return <LoadingSpinner message="Loading asset..." />;
  }

  if (assetQuery.isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            message={
              assetQuery.error?.response?.data?.message ||
              "Failed to load asset"
            }
            onRetry={assetQuery.refetch}
          />
        </div>
      </div>
    );
  }

  const asset = assetQuery.data;

  const details = [
    { label: "Type", value: getAssetTypeLabel(asset.assetType) },
    { label: "Subtype", value: asset.assetSubtype || "-" },
    { label: "Serial Number", value: asset.serialNumber || "-" },
    { label: "Location", value: asset.location },
    {
      label: "Availability Window",
      value: `${formatTime(asset.availabilityStart)} - ${formatTime(
        asset.availabilityEnd
      )}`,
    },
    { label: "Booking Date", value: formatDate(asset.bookingDate) },
    { label: "Description", value: asset.description || "-" },
    { label: "Created At", value: formatDateTime(asset.createdAt) },
    { label: "Updated At", value: formatDateTime(asset.updatedAt) },
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
    updateAsset.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Asset updated successfully");
          closeEditMode();
          assetQuery.refetch();
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to update asset"
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
          onClick={() => navigate("/assets")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Assets
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {asset.name}
              </h1>
              <StatusBadge status={asset.status} />
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                {getAssetTypeLabel(asset.assetType)}
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
              Asset Details
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
            <StatusBadge status={asset.status} />
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
                Edit Asset
              </h2>
              <button
                type="button"
                className="btn-secondary"
                onClick={closeEditMode}
              >
                Cancel
              </button>
            </div>

            <AssetForm
              defaultValues={asset}
              onSubmit={handleUpdate}
              isLoading={updateAsset.isPending}
              isEditMode
            />
          </section>
        )}

        <ConfirmModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => {
            deleteAsset.mutate(asset.id, {
              onSuccess: () => navigate("/assets"),
            });
          }}
          title="Delete Asset"
          message="Are you sure you want to delete this asset?"
        />

        <AssetStatusModal
          isOpen={statusOpen}
          onClose={() => setStatusOpen(false)}
          asset={asset}
          onUpdate={(assetId, status) => {
            updateStatus.mutate(
              { id: assetId, status },
              {
                onSuccess: () => {
                  setStatusOpen(false);
                  assetQuery.refetch();
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

export default AssetDetailPage;
