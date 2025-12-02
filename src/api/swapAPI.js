import apiClient from './apiClient';

/**
 * Data Access Layer - Swap API
 * Handles all HTTP requests related to toy swaps
 */

const swapAPI = {
    /**
     * Perform a toy swap
     * @param {Object} swapData - { toyId, buyerEmail, sellerEmail }
     * @returns {Promise} Swap result
     */
    swapToy: async (swapData) => {
        const response = await apiClient.post('/swap', swapData);
        return response.data;
    },
};

export default swapAPI;
