import apiClient from './apiClient';

const exchangeAPI = {
    createExchangeRequest: async (exchangeData) => {
        const response = await apiClient.post('/exchange/request', exchangeData);
        return response.data;
    },

    getShopOwnerExchangeRequests: async () => {
        // The route uses shopOwnerEmail from authenticated user
        const response = await apiClient.get('/exchange/shop-owner');
        return response.data;
    },

    getExchangeRequestsByUser: async (userEmail) => {
        const response = await apiClient.get(`/exchange/user/${userEmail}`);
        return response.data;
    },

    setDiscounts: async (exchangeId, discounts) => {
        const response = await apiClient.put(`/exchange/${exchangeId}/set-discounts`, { discounts });
        return response.data;
    },

    userAcceptExchange: async (exchangeId) => {
        const response = await apiClient.put(`/exchange/${exchangeId}/accept`);
        return response.data;
    },

    userRejectExchange: async (exchangeId) => {
        const response = await apiClient.put(`/exchange/${exchangeId}/reject`);
        return response.data;
    },

    confirmExchange: async (exchangeId) => {
        const response = await apiClient.put(`/exchange/${exchangeId}/confirm`);
        return response.data;
    }
};

export default exchangeAPI;

