/**
 * Constants
 * Application-wide constants
 */

import { API_CONFIG as CONFIG } from '../config/apiConfig';

// API Configuration (imported from centralized config)
export const API_CONFIG = CONFIG;

// Credit System
export const CREDITS = {
    INITIAL_CREDITS: 50,
    MIN_CREDIT_COST: 5,
    MAX_CREDIT_COST: 100,
    DEFAULT_CREDIT_COST: 10,
};

// Toy Categories
export const TOY_CATEGORIES = [
    'Sports Car',
    'Truck',
    'Regular Car',
    'Mini Fire Truck',
    'Mini Police Car',
    'Action Figure',
    'Doll',
    'Building Blocks',
    'Educational',
    'Other',
];

// Toy Conditions
export const TOY_CONDITIONS = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor',
];

// Routes
export const ROUTES = {
    HOME: '/',
    ALL_TOYS: '/all-toys',
    TOY_DETAILS: '/toy/:id',
    ADD_TOY: '/add-toy',
    MY_TOYS: '/my-toys',
    UPDATE_TOY: '/update-toy/:id',
    LOGIN: '/login',
    FAQ: '/faq',
    SEED: '/seed',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    USER_EMAIL: 'userEmail',
    USER_NAME: 'userName',
    USER_PHOTO: 'userPhoto',
};

// Toast Messages
export const TOAST_MESSAGES = {
    SWAP_SUCCESS: '🎉 Swap successful!',
    SWAP_ERROR: '❌ Swap failed. Please try again.',
    LOGIN_SUCCESS: '✅ Login successful!',
    LOGIN_ERROR: '❌ Login failed. Please try again.',
    TOY_ADDED: '✅ Toy added successfully!',
    TOY_UPDATED: '✅ Toy updated successfully!',
    TOY_DELETED: '✅ Toy deleted successfully!',
    INSUFFICIENT_CREDITS: '💎 Insufficient credits!',
};

// Pagination
export const PAGINATION = {
    ITEMS_PER_PAGE: 12,
};

export default {
    API_CONFIG,
    CREDITS,
    TOY_CATEGORIES,
    TOY_CONDITIONS,
    ROUTES,
    STORAGE_KEYS,
    TOAST_MESSAGES,
    PAGINATION,
};
