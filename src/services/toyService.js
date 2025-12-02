import toyAPI from '../api/toyAPI';

/**
 * Business Logic Layer - Toy Service
 * Contains business logic and data transformation for toys
 */

const toyService = {
    /**
     * Get all available toys
     * @param {Object} filters - Filter options (search, category, minPrice, maxPrice, minCoins, maxCoins, sortBy)
     * @returns {Promise} Array of toys
     */
    getAllToys: async (filters = {}) => {
        try {
            const toys = await toyAPI.getAllToys(filters);
            return toys;
        } catch (error) {
            console.error('Error fetching toys:', error);
            throw new Error('Failed to fetch toys. Please try again.');
        }
    },

    /**
     * Get toy details by ID
     * @param {string} id - Toy ID
     * @returns {Promise} Toy object
     */
    getToyDetails: async (id) => {
        try {
            const toy = await toyAPI.getToyById(id);
            return toy;
        } catch (error) {
            console.error('Error fetching toy details:', error);
            throw new Error('Failed to fetch toy details. Please try again.');
        }
    },

    /**
     * Get user's toys
     * @param {string} email - User email
     * @returns {Promise} Array of user's toys
     */
    getUserToys: async (email) => {
        try {
            const toys = await toyAPI.getToysByEmail(email);
            return toys;
        } catch (error) {
            console.error('Error fetching user toys:', error);
            throw new Error('Failed to fetch your toys. Please try again.');
        }
    },

    /**
     * Search and filter toys
     * @param {Array} toys - Array of toys
     * @param {string} searchTerm - Search term
     * @returns {Array} Filtered toys
     */
    searchToys: (toys, searchTerm) => {
        if (!searchTerm) return toys;

        const term = searchTerm.toLowerCase();
        return toys.filter(toy =>
            toy.name?.toLowerCase().includes(term) ||
            toy.subcategory?.toLowerCase().includes(term) ||
            toy.sellerName?.toLowerCase().includes(term)
        );
    },

    /**
     * Sort toys by credit cost
     * @param {Array} toys - Array of toys
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array} Sorted toys
     */
    sortToysByPrice: (toys, order = 'asc') => {
        return [...toys].sort((a, b) => {
            const priceA = a.creditCost || 0;
            const priceB = b.creditCost || 0;
            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
    },

    /**
     * Filter toys by subcategory
     * @param {Array} toys - Array of toys
     * @param {string} subcategory - Subcategory name
     * @returns {Array} Filtered toys
     */
    filterBySubcategory: (toys, subcategory) => {
        if (!subcategory || subcategory === 'all') return toys;
        return toys.filter(toy => toy.subcategory === subcategory);
    },

    /**
     * Add a new toy
     * @param {Object} toyData - Toy data
     * @returns {Promise} Created toy
     */
    addToy: async (toyData) => {
        try {
            // Validate toy data
            if (!toyData.name || !toyData.pictureUrl || !toyData.sellerEmail) {
                throw new Error('Missing required fields');
            }

            // Set default values
            const toy = {
                ...toyData,
                creditCost: toyData.creditCost || 10,
                quantity: toyData.quantity || 1,
                createdAt: new Date().toISOString(),
            };

            const result = await toyAPI.addToy(toy);
            return result;
        } catch (error) {
            console.error('Error adding toy:', error);
            throw new Error('Failed to add toy. Please try again.');
        }
    },

    /**
     * Update a toy
     * @param {string} id - Toy ID
     * @param {Object} toyData - Updated toy data
     * @returns {Promise} Updated toy
     */
    updateToy: async (id, toyData) => {
        try {
            const result = await toyAPI.updateToy(id, toyData);
            return result;
        } catch (error) {
            console.error('Error updating toy:', error);
            throw new Error('Failed to update toy. Please try again.');
        }
    },

    /**
     * Delete a toy
     * @param {string} id - Toy ID
     * @returns {Promise} Deletion result
     */
    deleteToy: async (id) => {
        try {
            const result = await toyAPI.deleteToy(id);
            return result;
        } catch (error) {
            console.error('Error deleting toy:', error);
            throw new Error('Failed to delete toy. Please try again.');
        }
    },

    /**
     * Check if user can afford a toy
     * @param {number} userCredits - User's credit balance
     * @param {number} toyCost - Toy's credit cost
     * @returns {boolean} True if user can afford
     */
    canAffordToy: (userCredits, toyCost) => {
        return userCredits >= toyCost;
    },
};

export default toyService;
