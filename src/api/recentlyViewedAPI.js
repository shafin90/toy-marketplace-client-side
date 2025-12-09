import apiClient from './apiClient';

export const recentlyViewedAPI = {
    addView: async (userEmail, toyId) => {
        return await apiClient.post('/recently-viewed', { userEmail, toyId });
    },

    getUserRecentlyViewed: async (userEmail, limit = 10) => {
        return await apiClient.get(`/recently-viewed/${userEmail}?limit=${limit}`);
    },

    clearHistory: async (userEmail) => {
        return await apiClient.delete('/recently-viewed', { data: { userEmail } });
    }
};

