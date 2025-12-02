import apiClient from './apiClient';

/**
 * Data Access Layer - Review API
 * Handles all HTTP requests related to reviews
 */

const reviewAPI = {
    /**
     * Create a review
     * @param {Object} reviewData - Review data
     * @returns {Promise} Created review
     */
    createReview: async (reviewData) => {
        const response = await apiClient.post('/reviews', reviewData);
        return response.data;
    },

    /**
     * Get reviews for a toy
     * @param {string} toyId - Toy ID
     * @returns {Promise} Array of reviews
     */
    getReviewsByToy: async (toyId) => {
        const response = await apiClient.get(`/reviews/toy/${toyId}`);
        return response.data;
    },

    /**
     * Get reviews for a shop owner
     * @param {string} email - Shop owner email
     * @returns {Promise} Array of reviews
     */
    getReviewsByShopOwner: async (email) => {
        const response = await apiClient.get(`/reviews/shop/${email}`);
        return response.data;
    },

    /**
     * Update a review
     * @param {string} id - Review ID
     * @param {Object} updateData - Updated review data
     * @returns {Promise} Updated review
     */
    updateReview: async (id, updateData) => {
        const response = await apiClient.put(`/reviews/${id}`, updateData);
        return response.data;
    },

    /**
     * Delete a review
     * @param {string} id - Review ID
     * @returns {Promise} Deletion result
     */
    deleteReview: async (id) => {
        const response = await apiClient.delete(`/reviews/${id}`);
        return response.data;
    },
};

export default reviewAPI;

