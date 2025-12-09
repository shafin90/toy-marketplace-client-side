import apiClient from './apiClient';

export const wishlistAPI = {
    addToWishlist: async (userEmail, toyId) => {
        return await apiClient.post('/wishlist', { userEmail, toyId });
    },

    removeFromWishlist: async (userEmail, toyId) => {
        return await apiClient.delete(`/wishlist/${toyId}`, { data: { userEmail } });
    },

    getUserWishlist: async (userEmail) => {
        return await apiClient.get(`/wishlist/${userEmail}`);
    }
};

