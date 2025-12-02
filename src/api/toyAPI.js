import apiClient from './apiClient';

/**
 * Data Access Layer - Toy API
 * Handles all HTTP requests related to toys
 */

const toyAPI = {
    /**
     * Get all toys
     * @param {Object} filters - Filter options (search, category, minPrice, maxPrice, minCoins, maxCoins, sortBy)
     * @returns {Promise} Array of toys
     */
    getAllToys: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
                params.append(key, filters[key]);
            }
        });
        
        const queryString = params.toString();
        const url = queryString ? `/toys?${queryString}` : '/toys';
        const response = await apiClient.get(url);
        return response.data;
    },

    /**
     * Get toy by ID
     * @param {string} id - Toy ID
     * @returns {Promise} Toy object
     */
    getToyById: async (id) => {
        const response = await apiClient.get(`/toys/${id}`);
        return response.data;
    },

    /**
     * Get toys by seller email
     * @param {string} email - Seller email
     * @returns {Promise} Array of toys
     */
    getToysByEmail: async (email) => {
        const response = await apiClient.get(`/mytoys?email=${email}`);
        return response.data;
    },

    /**
     * Add a new toy (legacy - uses type detection)
     * @param {Object} toyData - Toy data (can include File for picture)
     * @returns {Promise} Created toy
     */
    addToy: async (toyData) => {
        const formData = new FormData();
        Object.keys(toyData).forEach(key => {
            if (toyData[key] instanceof File) {
                formData.append('picture', toyData[key]);
            } else if (toyData[key] !== null && toyData[key] !== undefined) {
                formData.append(key, toyData[key]);
            }
        });
        
        const response = await apiClient.post('/toys', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Add shop toy (for shop owners)
     * @param {Object} toyData - Toy data with File for picture
     * @returns {Promise} Created toy
     */
    addShopToy: async (toyData) => {
        const formData = new FormData();
        Object.keys(toyData).forEach(key => {
            if (toyData[key] instanceof File) {
                formData.append('picture', toyData[key]);
            } else if (toyData[key] !== null && toyData[key] !== undefined) {
                formData.append(key, toyData[key]);
            }
        });
        
        const response = await apiClient.post('/toys/shop-toy', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Add old toy (for users to earn coins)
     * @param {Object} toyData - Toy data with File for picture
     * @returns {Promise} Created toy
     */
    addOldToy: async (toyData) => {
        const formData = new FormData();
        Object.keys(toyData).forEach(key => {
            if (toyData[key] instanceof File) {
                formData.append('picture', toyData[key]);
            } else if (toyData[key] !== null && toyData[key] !== undefined) {
                formData.append(key, toyData[key]);
            }
        });
        
        const response = await apiClient.post('/toys/old-toy', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Update a toy
     * @param {string} id - Toy ID
     * @param {Object} toyData - Updated toy data (can include File for picture)
     * @returns {Promise} Updated toy
     */
    updateToy: async (id, toyData) => {
        const formData = new FormData();
        Object.keys(toyData).forEach(key => {
            if (toyData[key] instanceof File) {
                formData.append('picture', toyData[key]);
            } else if (toyData[key] !== null && toyData[key] !== undefined) {
                formData.append(key, toyData[key]);
            }
        });
        
        const response = await apiClient.put(`/toys/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Get pending old toys
     * @param {string} shopOwnerEmail - Shop owner email (optional)
     * @returns {Promise} Array of pending old toys
     */
    getPendingOldToys: async (shopOwnerEmail) => {
        const url = shopOwnerEmail 
            ? `/toys/pending?shopOwnerEmail=${shopOwnerEmail}`
            : '/toys/pending';
        const response = await apiClient.get(url);
        return response.data;
    },

    /**
     * Approve old toy
     * @param {string} toyId - Toy ID
     * @param {string} shopOwnerEmail - Shop owner email
     * @param {number} coinsAwarded - Coins to award (optional, will calculate if not provided)
     * @returns {Promise} Approval result
     */
    approveOldToy: async (toyId, shopOwnerEmail, coinsAwarded) => {
        const response = await apiClient.put(
            `/toys/${toyId}/approve/${shopOwnerEmail}`,
            { coinsAwarded }
        );
        return response.data;
    },

    /**
     * Reject old toy
     * @param {string} toyId - Toy ID
     * @param {string} shopOwnerEmail - Shop owner email
     * @param {string} rejectionReason - Reason for rejection
     * @returns {Promise} Rejection result
     */
    rejectOldToy: async (toyId, shopOwnerEmail, rejectionReason) => {
        const response = await apiClient.put(
            `/toys/${toyId}/reject/${shopOwnerEmail}`,
            { rejectionReason }
        );
        return response.data;
    },

    /**
     * Delete a toy
     * @param {string} id - Toy ID
     * @returns {Promise} Deletion result
     */
    deleteToy: async (id) => {
        const response = await apiClient.delete(`/toys/${id}`);
        return response.data;
    },
};

export default toyAPI;
