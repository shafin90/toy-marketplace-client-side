import apiClient from './apiClient';

export const bulkExchangeAPI = {
    createBulkExchange: async (userEmail, productId, oldToyIds, shopOwnerEmail) => {
        return await apiClient.post('/bulk-exchange', {
            userEmail,
            productId,
            oldToyIds,
            shopOwnerEmail
        });
    }
};

