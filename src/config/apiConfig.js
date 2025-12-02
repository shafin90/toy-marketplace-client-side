/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Base API URL - Change this to switch between local and production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Alternative: Uncomment for production
// const API_BASE_URL = 'https://carz-server-shafin90.vercel.app';

/**
 * Get the base API URL
 * @returns {string} Base API URL
 */
export const getBaseURL = () => {
    return API_BASE_URL;
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // Toy endpoints
    TOYS: '/toys',
    TOY_BY_ID: (id) => `/toys/${id}`,
    MY_TOYS: (email) => `/mytoys?email=${email}`,
    TOYS_BY_SUBCATEGORY: (subcategory) => `/toys/${subcategory}`,

    // User endpoints
    USER_BY_EMAIL: (email) => `/users/${email}`,
    REGISTER_USER: '/users',

    // Swap endpoints
    SWAP: '/swap',
};

/**
 * API Configuration
 */
export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SYY36DMHyWRGxIQfZ6s5GoermOn4f56Y90NWu972XBSenhvbD6F8XX2vAv8WHK1fmAVyXQblrG85iT6vU8LK2LQ00n1WPg728',
};

/**
 * Get full image URL
 * @param {string} imagePath - Image path (relative or absolute)
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/uploads/${imagePath}`;
};

export default API_CONFIG;
