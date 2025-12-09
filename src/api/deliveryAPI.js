import apiClient from './apiClient';

export const deliveryAPI = {
    createDelivery: async (exchangeId, deliveryData) => {
        return await apiClient.post(`/delivery/${exchangeId}`, deliveryData);
    },

    assignDeliveryMan: async (deliveryId, deliveryManEmail) => {
        return await apiClient.put(`/delivery/${deliveryId}/assign`, { deliveryManEmail });
    },

    updateStatus: async (deliveryId, status, updateData = {}) => {
        return await apiClient.put(`/delivery/${deliveryId}/status`, { status, ...updateData });
    },

    updateTracking: async (deliveryId, trackingData) => {
        return await apiClient.put(`/delivery/${deliveryId}/tracking`, trackingData);
    },

    getDeliveryByExchange: async (exchangeId) => {
        return await apiClient.get(`/delivery/exchange/${exchangeId}`);
    },

    getUserDeliveries: async (userEmail) => {
        return await apiClient.get(`/delivery/user/${userEmail}`);
    },

    getDeliveryManDeliveries: async (deliveryManEmail) => {
        return await apiClient.get(`/delivery/delivery-man/${deliveryManEmail}`);
    }
};

