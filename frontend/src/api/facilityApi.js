import axiosInstance from "./axiosInstance";
import { buildSearchParams } from "../utils/helpers";

export const getAllFacilities = async ({
  page = 0,
  size = 10,
  sort = "name,asc",
} = {}) => {
  const response = await axiosInstance.get("/facilities", {
    params: { page, size, sort },
  });
  return response.data;
};

export const getFacilityById = async (id) => {
  const response = await axiosInstance.get(`/facilities/${id}`);
  return response.data;
};

export const searchFacilities = async ({
  type,
  status,
  location,
  minCapacity,
  page = 0,
  size = 10,
  sort = "name,asc",
} = {}) => {
  const params = buildSearchParams({
    type,
    status,
    location,
    minCapacity,
    page,
    size,
    sort,
  });
  const response = await axiosInstance.get("/facilities/search", { params });
  return response.data;
};

export const createFacility = async (data) => {
  const response = await axiosInstance.post("/facilities", data);
  return response.data;
};

export const updateFacility = async (id, data) => {
  const response = await axiosInstance.put(`/facilities/${id}`, data);
  return response.data;
};

export const updateFacilityStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/facilities/${id}/status`, {
    status,
  });
  return response.data;
};

export const deleteFacility = async (id) => {
  const response = await axiosInstance.delete(`/facilities/${id}`);
  return response.data;
};
