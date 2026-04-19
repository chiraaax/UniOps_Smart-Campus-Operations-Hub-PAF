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

    // --- Fetch all bookings for ONE facility ---
    getFacilityBookings: async (facilityId) => {
        const response = await api.get('/bookings');
        return response.data.filter(b => String(b.facilityId) === String(facilityId));
    },

    // --- Fetch Analytics ---
    getAnalytics: async () => {
        const response = await api.get('/bookings/analytics');
        return response.data;
    },

    // --- NEW: QR Code Check-in ---
    checkInBooking: async (bookingId) => {
        const response = await api.put(`/bookings/${bookingId}/checkin`);
        return response.data;
    }
};

export default bookingService;