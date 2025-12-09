import apiClient from './apiClient';

export const priceAlertAPI = {
    createAlert: async (userEmail, toyId, targetPrice) => {
        return await apiClient.post('/price-alerts', { userEmail, toyId, targetPrice });
    },

    getUserAlerts: async (userEmail) => {
        return await apiClient.get(`/price-alerts/${userEmail}`);
    },

    deleteAlert: async (userEmail, alertId) => {
        return await apiClient.delete(`/price-alerts/${alertId}`, { data: { userEmail } });
    }
};

