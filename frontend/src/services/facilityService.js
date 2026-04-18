import api from './api';

const facilityService = {
    getAllFacilities: async () => {
        const response = await api.get('/facilities');
        return response.data;
    },
    
    createFacility: async (facilityData) => {
        const response = await api.post('/facilities', facilityData);
        return response.data;
    },

    deleteFacility: async (id) => {
        await api.delete(`/facilities/${id}`);
    },

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/facilities/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data; 
    },

    // Handles the actual updating of the record
    updateFacility: async (id, facilityData) => {
        const response = await api.put(`/facilities/${id}`, facilityData);
        return response.data;
    }
};

export default facilityService;