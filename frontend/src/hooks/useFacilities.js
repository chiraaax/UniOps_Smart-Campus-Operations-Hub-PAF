import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createFacility,
  deleteFacility,
  getAllFacilities,
  getFacilityById,
  searchFacilities,
  updateFacility,
  updateFacilityStatus,
} from "../api/facilityApi";

export const useFacilitiesList = (params, enabled = true) => {
  return useQuery({
    queryKey: ["facilities", params],
    queryFn: () => getAllFacilities(params),
    enabled,
  });
};

export const useFacilityById = (id) => {
  return useQuery({
    queryKey: ["facility", id],
    queryFn: () => getFacilityById(id),
    enabled: !!id,
  });
};

export const useFacilitySearch = (filters, enabled = true) => {
  return useQuery({
    queryKey: ["facilities", "search", filters],
    queryFn: () => searchFacilities(filters),
    enabled,
  });
};

export const useCreateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFacility,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Facility created successfully");
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateFacility(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Facility updated successfully");
    },
  });
};

export const useUpdateFacilityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateFacilityStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Status updated successfully");
    },
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFacility,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Facility deleted");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete facility"
      );
    },
  });
};
