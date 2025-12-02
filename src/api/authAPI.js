import apiClient from './apiClient';

/**
 * Data Access Layer - Auth API
 * Handles authentication HTTP requests
 */

const authAPI = {
    /**
     * Register a new user
     * @param {Object} userData - Registration data
     * @returns {Promise} User object with token
     */
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} User object with token
     */
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    }
};

export default authAPI;

