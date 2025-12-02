import apiClient from './apiClient';

/**
 * Data Access Layer - Analytics API
 * Handles all HTTP requests related to analytics
 */

const analyticsAPI = {
    /**
     * Get shop analytics
     * @param {string} email - Shop owner email
     * @returns {Promise} Analytics data
     */
    getShopAnalytics: async (email) => {
        const response = await apiClient.get(`/analytics/shop/${email}`);
        return response.data;
    },

    /**
     * Get sales trend
     * @param {string} email - Shop owner email
     * @param {number} days - Number of days (default: 30)
     * @returns {Promise} Sales trend data
     */
    getSalesTrend: async (email, days = 30) => {
        const response = await apiClient.get(`/analytics/shop/${email}/trend?days=${days}`);
        return response.data;
    },
};

export default analyticsAPI;

