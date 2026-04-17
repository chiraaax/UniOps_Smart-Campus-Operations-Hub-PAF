import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AssetForm from "../../components/assets/AssetForm";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  useAssetById,
  useCreateAsset,
  useUpdateAsset,
} from "../../hooks/useAssets";

function AssetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const assetQuery = useAssetById(id);

  if (isEditMode && assetQuery.isLoading) {
    return <LoadingSpinner message="Loading asset..." />;
  }

  if (isEditMode && assetQuery.isError) {
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

  const handleSubmit = (formData) => {
    if (isEditMode) {
      updateAsset.mutate(
        { id, data: formData },
        {
          onSuccess: () => navigate(`/assets/${id}`),
          onError: (error) => {
            toast.error(
              error?.response?.data?.message || "Failed to update asset"
            );
          },
        }
      );
      return;
    }

    createAsset.mutate(formData, {
      onSuccess: () => navigate("/assets"),
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to create asset");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          type="button"
          className="btn-secondary inline-flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div>
          <h1 className="page-title">
            {isEditMode ? `Edit Asset: ${asset?.name || ""}` : "Add New Asset"}
          </h1>
        </div>

        <AssetForm
          defaultValues={asset}
          onSubmit={handleSubmit}
          isLoading={createAsset.isPending || updateAsset.isPending}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
}

export default AssetFormPage;
