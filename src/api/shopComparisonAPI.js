import apiClient from './apiClient';

export const shopComparisonAPI = {
    compareShops: async (shopOwnerEmails) => {
        return await apiClient.post('/shop-comparison', { shopOwnerEmails });
    },

    findBestDeal: async (toyName) => {
        return await apiClient.get(`/shop-comparison/best-deal?toyName=${toyName}`);
    }
};

