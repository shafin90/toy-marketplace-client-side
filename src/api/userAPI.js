import apiClient from './apiClient';

/**
 * Data Access Layer - User API
 * Handles all HTTP requests related to users
 */

const userAPI = {
    /**
     * Get user by email
     * @param {string} email - User email
     * @returns {Promise} User object
     */
    getUserByEmail: async (email) => {
        const response = await apiClient.get(`/users/${email}`);
        return response.data;
    },

    /**
     * Register a new user
     * @param {Object} userData - User data (email, name, photoURL)
     * @returns {Promise} User object with credits
     */
    registerUser: async (userData) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },

    /**
     * Update user profile
     * @param {string} email - User email
     * @param {Object} profileData - Profile data to update
     * @returns {Promise} Updated user
     */
    updateProfile: async (email, profileData) => {
        const response = await apiClient.put(`/users/${email}`, profileData);
        return response.data;
    },

    /**
     * Upgrade user to shop owner
     * @param {string} email - User email
     * @param {Object} shopData - Shop data (shopName, shopAddress, phone)
     * @returns {Promise} Updated user
     */
    upgradeToShopOwner: async (email, shopData) => {
        const response = await apiClient.post(`/users/${email}/upgrade-shop`, shopData);
        return response.data;
    },
};

export default userAPI;
