import apiClient from './apiClient';
import { dedupeRequest, invalidateCache } from '../utils/requestCache';

/**
 * Data Access Layer - Toy API
 * Handles all HTTP requests related to toys
 * 
 * Optimizations:
 * - Request deduplication for GET requests
 * - Response caching (30s TTL by default)
 * - Automatic cache invalidation on mutations
 */

const toyAPI = {
    /**
     * Get all toys
     * @param {Object} filters - Filter options (search, category, minPrice, maxPrice, minCoins, maxCoins, sortBy)
     * @param {Object} options - Request options (ttl, skipCache, signal for cancellation)
     * @returns {Promise} Array of toys
     */
    getAllToys: async (filters = {}, options = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
                params.append(key, filters[key]);
            }
        });
        
        const queryString = params.toString();
        const url = queryString ? `/toys?${queryString}` : '/toys';
        
        return await dedupeRequest(
            url,
            async () => {
                const response = await apiClient.get(url, {
                    signal: options.signal // Support AbortController
                });
                return response.data;
            },
            {
                method: 'GET',
                params: filters,
                ttl: options.ttl || 30000, // 30 seconds default
                skipCache: options.skipCache || false
            }
        );
    },

    /**
     * Get toy by ID
     * @param {string} id - Toy ID
     * @param {Object} options - Request options (ttl, skipCache)
     * @returns {Promise} Toy object
     */
    getToyById: async (id, options = {}) => {
        const url = `/toys/${id}`;
        
        return await dedupeRequest(
            url,
            async () => {
                const response = await apiClient.get(url);
                return response.data;
            },
            {
                method: 'GET',
                params: { id },
                ttl: options.ttl || 60000, // 60 seconds for individual toys
                skipCache: options.skipCache || false
            }
        );
    },

    /**
     * Get toys by seller email
     * @param {string} email - Seller email
     * @param {Object} options - Request options (ttl, skipCache)
     * @returns {Promise} Array of toys
     */
    getToysByEmail: async (email, options = {}) => {
        const url = `/mytoys?email=${email}`;
        
        return await dedupeRequest(
            url,
            async () => {
                const response = await apiClient.get(url);
                return response.data;
            },
            {
                method: 'GET',
                params: { email },
                ttl: options.ttl || 30000,
                skipCache: options.skipCache || false
            }
        );
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
        
        // Invalidate cache after adding toy
        invalidateCache('/toys');
        if (toyData.sellerEmail) {
            invalidateCache(`/mytoys?email=${toyData.sellerEmail}`);
        }
        
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
        
        // Invalidate cache after updating toy
        invalidateCache('/toys');
        invalidateCache(`/toys/${id}`);
        if (toyData.sellerEmail) {
            invalidateCache(`/mytoys?email=${toyData.sellerEmail}`);
        }
        
        return response.data;
    },

    /**
     * Get pending old toys
     * @param {string} shopOwnerEmail - Shop owner email (optional)
     * @param {Object} options - Request options (ttl, skipCache)
     * @returns {Promise} Array of pending old toys
     */
    getPendingOldToys: async (shopOwnerEmail, options = {}) => {
        const url = shopOwnerEmail 
            ? `/toys/pending?shopOwnerEmail=${shopOwnerEmail}`
            : '/toys/pending';
        
        return await dedupeRequest(
            url,
            async () => {
                const response = await apiClient.get(url);
                return response.data;
            },
            {
                method: 'GET',
                params: { shopOwnerEmail },
                ttl: options.ttl || 30000,
                skipCache: options.skipCache || false
            }
        );
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
        
        // Invalidate cache after deleting toy
        invalidateCache('/toys');
        invalidateCache(`/toys/${id}`);
        
        return response.data;
    },
};

export default toyAPI;
