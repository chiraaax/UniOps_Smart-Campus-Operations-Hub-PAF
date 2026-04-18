import api from './api';

const bookingService = {
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    getUserBookings: async (userId) => {
        const response = await api.get(`/bookings/user/${userId}`);
        return response.data;
    },

    getAllBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    updateBookingStatus: async (bookingId, status) => {
        const response = await api.put(`/bookings/${bookingId}/status?status=${status}`);
        return response.data;
    },

    // --- NEW: Fetch all bookings for ONE facility ---
    getFacilityBookings: async (facilityId) => {
        // Since we don't have a dedicated backend route for this yet, 
        // we will fetch all bookings and filter them in React.
        const response = await api.get('/bookings');
        return response.data.filter(b => String(b.facilityId) === String(facilityId));
    }
};

export default bookingService;