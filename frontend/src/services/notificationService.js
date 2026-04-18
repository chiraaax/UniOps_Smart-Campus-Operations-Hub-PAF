import api from './api';

const notificationService = {
    // Fetch all notifications for the logged-in student
    getUserNotifications: async (userId) => {
        const response = await api.get(`/notifications/user/${userId}`);
        return response.data;
    },
    
    // Mark a single notification as read when clicked
    markAsRead: async (notificationId) => {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    },
    
    // Mark all notifications as read at once
    markAllAsRead: async (userId) => {
        const response = await api.put(`/notifications/user/${userId}/read-all`);
        return response.data;
    }
};

// THIS IS THE CRITICAL LINE THAT WAS MISSING!
export default notificationService;