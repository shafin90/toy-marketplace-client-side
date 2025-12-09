import apiClient from './apiClient';

export const recommendationAPI = {
    getAgeBasedRecommendations: async (age) => {
        return await apiClient.get(`/recommendations/age-based?age=${age}`);
    },

    getSimilarToys: async (toyId) => {
        return await apiClient.get(`/recommendations/similar/${toyId}`);
    },

    getTrendingToys: async () => {
        return await apiClient.get('/recommendations/trending');
    },

    getPersonalizedRecommendations: async (userEmail) => {
        return await apiClient.get(`/recommendations/personalized/${userEmail}`);
    }
};

