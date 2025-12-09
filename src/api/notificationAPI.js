import apiClient from './apiClient';

export const notificationAPI = {
    getUserNotifications: async (userEmail, limit = 50) => {
        return await apiClient.get(`/notifications/${userEmail}?limit=${limit}`);
    },

    markAsRead: async (userEmail, notificationId) => {
        return await apiClient.put(`/notifications/${notificationId}/read`, { userEmail });
    },

    markAllAsRead: async (userEmail) => {
        return await apiClient.put('/notifications/read-all', { userEmail });
    },

    getUnreadCount: async (userEmail) => {
        return await apiClient.get(`/notifications/${userEmail}/unread-count`);
    },

    deleteNotification: async (userEmail, notificationId) => {
        return await apiClient.delete(`/notifications/${notificationId}`, { data: { userEmail } });
    }
};

