import apiClient from './apiClient';

export const collectionAPI = {
    createCollection: async (shopOwnerEmail, collectionData) => {
        return await apiClient.post('/collections', { shopOwnerEmail, ...collectionData });
    },

    getCollection: async (collectionId) => {
        return await apiClient.get(`/collections/${collectionId}`);
    },

    getShopCollections: async (shopOwnerEmail) => {
        return await apiClient.get(`/collections/shop/${shopOwnerEmail}`);
    },

    addToyToCollection: async (collectionId, toyId) => {
        return await apiClient.put(`/collections/${collectionId}/toy`, { toyId });
    },

    removeToyFromCollection: async (collectionId, toyId) => {
        return await apiClient.delete(`/collections/${collectionId}/toy/${toyId}`);
    },

    updateCollection: async (collectionId, updateData) => {
        return await apiClient.put(`/collections/${collectionId}`, updateData);
    },

    deleteCollection: async (collectionId) => {
        return await apiClient.delete(`/collections/${collectionId}`);
    }
};

