import apiClient from './apiClient';

/**
 * Data Access Layer - Transaction API
 * Handles all HTTP requests related to transactions
 */

const transactionAPI = {
    /**
     * Get all transactions for a user
     * @param {string} email - User email
     * @returns {Promise} Array of transactions
     */
    getUserTransactions: async (email) => {
        const response = await apiClient.get(`/transactions/${email}`);
        return response.data;
    },

    /**
     * Get coin transactions for a user
     * @param {string} email - User email
     * @returns {Promise} Array of coin transactions
     */
    getCoinTransactions: async (email) => {
        const response = await apiClient.get(`/transactions/${email}/coins`);
        return response.data;
    },

    /**
     * Get purchase history for a user
     * @param {string} email - User email
     * @returns {Promise} Array of purchases
     */
    getPurchaseHistory: async (email) => {
        const response = await apiClient.get(`/transactions/${email}/purchases`);
        return response.data;
    },
};

export default transactionAPI;

