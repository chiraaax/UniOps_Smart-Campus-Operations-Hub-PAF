import axiosInstance from "./axiosInstance";
import { buildSearchParams } from "../utils/helpers";

export const getAllAssets = async ({
  page = 0,
  size = 10,
  sort = "name,asc",
} = {}) => {
  const response = await axiosInstance.get("/assets", {
    params: { page, size, sort },
  });
  return response.data;
};

export const getAssetById = async (id) => {
  const response = await axiosInstance.get(`/assets/${id}`);
  return response.data;
};

export const searchAssets = async ({
  type,
  status,
  location,
  subtype,
  page = 0,
  size = 10,
  sort = "name,asc",
} = {}) => {
  const params = buildSearchParams({
    type,
    status,
    location,
    subtype,
    page,
    size,
    sort,
  });
  const response = await axiosInstance.get("/assets/search", { params });
  return response.data;
};

export const createAsset = async (data) => {
  const response = await axiosInstance.post("/assets", data);
  return response.data;
};

export const updateAsset = async (id, data) => {
  const response = await axiosInstance.put(`/assets/${id}`, data);
  return response.data;
};

export const updateAssetStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/assets/${id}/status`, {
    status,
  });
  return response.data;
};

export const deleteAsset = async (id) => {
  const response = await axiosInstance.delete(`/assets/${id}`);
  return response.data;
};
