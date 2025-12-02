import apiClient from './apiClient';

const oldToyAPI = {
    createOldToy: async (formData) => {
        const response = await apiClient.post('/old-toys', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getOldToyById: async (id) => {
        const response = await apiClient.get(`/old-toys/${id}`);
        return response.data;
    },

    getUserOldToys: async (email) => {
        const response = await apiClient.get(`/old-toys?email=${email}`);
        return response.data;
    },

    updateOldToy: async (id, updateData) => {
        const response = await apiClient.put(`/old-toys/${id}`, updateData);
        return response.data;
    },

    deleteOldToy: async (id) => {
        const response = await apiClient.delete(`/old-toys/${id}`);
        return response.data;
    }
};

export default oldToyAPI;

