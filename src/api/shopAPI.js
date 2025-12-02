import apiClient from './apiClient';

const shopAPI = {
    getAllShops: async () => {
        const response = await apiClient.get('/shops');
        return response.data;
    },

    getShopByOwner: async (shopOwnerEmail) => {
        const response = await apiClient.get(`/shops/${shopOwnerEmail}`);
        return response.data;
    },

    createOrUpdateShop: async (shopOwnerEmail, formData) => {
        const response = await apiClient.post(`/shops/${shopOwnerEmail}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    addShopMember: async (shopOwnerEmail, memberData) => {
        const response = await apiClient.post(`/shops/${shopOwnerEmail}/members`, memberData);
        return response.data;
    },

    removeShopMember: async (shopOwnerEmail, memberEmail) => {
        const response = await apiClient.delete(`/shops/${shopOwnerEmail}/members/${memberEmail}`);
        return response.data;
    }
};

export default shopAPI;

