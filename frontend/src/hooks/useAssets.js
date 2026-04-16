import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  searchAssets,
  updateAsset,
  updateAssetStatus,
} from "../api/assetApi";

export const useAssetsList = (params, enabled = true) => {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAllAssets(params),
    enabled,
  });
};

export const useAssetById = (id) => {
  return useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
  });
};

export const useAssetSearch = (filters, enabled = true) => {
  return useQuery({
    queryKey: ["assets", "search", filters],
    queryFn: () => searchAssets(filters),
    enabled,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset created successfully");
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAsset(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset updated successfully");
    },
  });
};

export const useUpdateAssetStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateAssetStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Status updated successfully");
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset deleted");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete asset");
    },
  });
};
