import apiClient from './apiClient';

export const quickReorderAPI = {
    getReorderItems: async (userEmail, limit = 10) => {
        return await apiClient.get(`/quick-reorder/${userEmail}?limit=${limit}`);
    },

    canReorder: async (userEmail, toyId) => {
        return await apiClient.get(`/quick-reorder/check?userEmail=${userEmail}&toyId=${toyId}`);
    }
};

