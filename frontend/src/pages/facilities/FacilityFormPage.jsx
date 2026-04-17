import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import FacilityForm from "../../components/facilities/FacilityForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  useCreateFacility,
  useFacilityById,
  useUpdateFacility,
} from "../../hooks/useFacilities";

function FacilityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const createFacility = useCreateFacility();
  const updateFacility = useUpdateFacility();
  const facilityQuery = useFacilityById(id);

  if (isEditMode && facilityQuery.isLoading) {
    return <LoadingSpinner message="Loading facility..." />;
  }

  if (isEditMode && facilityQuery.isError) {
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

  const handleSubmit = (formData) => {
    if (isEditMode) {
      updateFacility.mutate(
        { id, data: formData },
        {
          onSuccess: () => navigate(`/facilities/${id}`),
          onError: (error) => {
            toast.error(
              error?.response?.data?.message || "Failed to update facility"
            );
          },
        }
      );
      return;
    }

    createFacility.mutate(formData, {
      onSuccess: () => navigate("/facilities"),
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to create facility"
        );
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
            {isEditMode
              ? `Edit Facility: ${facility?.name || ""}`
              : "Add New Facility"}
          </h1>
        </div>

        <FacilityForm
          defaultValues={facility}
          onSubmit={handleSubmit}
          isLoading={createFacility.isPending || updateFacility.isPending}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
}

export default FacilityFormPage;
