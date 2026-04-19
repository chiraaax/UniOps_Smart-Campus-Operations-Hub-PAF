import api from './api';

const notificationService = {
    getUserNotifications: async (userId) => {
        const response = await api.get(`/notifications/user/${userId}`);
        return response.data;
    },
    markAsRead: async (notificationId) => {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    },
    markAllAsRead: async (userId) => {
        const response = await api.put(`/notifications/user/${userId}/read-all`);
        return response.data;
    },
    // --- NEW: DELETE NOTIFICATION ---
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    }
};

export default notificationService;