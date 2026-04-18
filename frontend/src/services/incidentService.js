import axios from 'axios';

const API_URL = '/api/incidents'; // Proxied by Vite

export const createIncident = async (ticketData) => {
    const response = await axios.post(API_URL, ticketData);
    return response.data;
};

export const getAllIncidents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const updateIncidentStatus = async (id, status, notes = '', technicianId = '', rejectedReason = '') => {
    const response = await axios.patch(`${API_URL}/${id}/status`, null, {
        params: { status, resolutionNotes: notes, technicianId, rejectedReason }
    });
    return response.data;
};

export const getIncidentById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const getIncidentAnalytics = async () => {
    const response = await axios.get(`${API_URL}/analytics`);
    return response.data;
};

export const uploadIncidentImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data; // URL string
};

export const addIncidentComment = async (id, userId, text) => {
    const response = await axios.post(`${API_URL}/${id}/comments`, { userId, text });
    return response.data;
};

export const updateIncidentComment = async (id, commentId, userId, text) => {
    const response = await axios.put(`${API_URL}/${id}/comments/${commentId}`, { userId, text });
    return response.data;
};

export const deleteIncidentComment = async (id, commentId, userId, role = '') => {
    const response = await axios.delete(`${API_URL}/${id}/comments/${commentId}`, {
        params: { userId, role }
    });
    return response.data;
};