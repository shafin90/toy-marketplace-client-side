import apiClient from './apiClient';

export const sustainabilityAPI = {
    getUserStats: async (userEmail) => {
        return await apiClient.get(`/sustainability/${userEmail}`);
    },

    getGlobalStats: async () => {
        return await apiClient.get('/sustainability/global/stats');
    }
};

