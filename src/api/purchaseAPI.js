import apiClient from './apiClient';

/**
 * Data Access Layer - Purchase API
 * Handles all HTTP requests related to purchases
 */

const purchaseAPI = {
    /**
     * Purchase toy with coins
     * @param {Object} purchaseData - { toyId, buyerEmail }
     * @returns {Promise} Purchase result
     */
    purchaseWithCoins: async (purchaseData) => {
        const response = await apiClient.post('/purchase/coins', purchaseData);
        return response.data;
    },

    /**
     * Purchase toy with money
     * @param {Object} purchaseData - { toyId, buyerEmail, paymentDetails }
     * @returns {Promise} Purchase result
     */
    purchaseWithMoney: async (purchaseData) => {
        const response = await apiClient.post('/purchase/money', purchaseData);
        return response.data;
    },

    /**
     * Confirm money purchase (after payment gateway confirmation)
     * @param {Object} purchaseData - { toyId, buyerEmail, paymentIntentId }
     * @returns {Promise} Purchase confirmation result
     */
    confirmMoneyPurchase: async (purchaseData) => {
        const response = await apiClient.post('/purchase/confirm', purchaseData);
        return response.data;
    },
};

export default purchaseAPI;

