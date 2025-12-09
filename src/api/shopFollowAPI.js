import apiClient from './apiClient';

export const shopFollowAPI = {
    followShop: async (userEmail, shopOwnerEmail) => {
        return await apiClient.post('/shop-follow', { userEmail, shopOwnerEmail });
    },

    unfollowShop: async (userEmail, shopOwnerEmail) => {
        return await apiClient.delete(`/shop-follow/${shopOwnerEmail}`, { data: { userEmail } });
    },

    isFollowing: async (userEmail, shopOwnerEmail) => {
        return await apiClient.get(`/shop-follow/check?userEmail=${userEmail}&shopOwnerEmail=${shopOwnerEmail}`);
    },

    getUserFollowing: async (userEmail) => {
        return await apiClient.get(`/shop-follow/${userEmail}/following`);
    },

    getShopFollowers: async (shopOwnerEmail) => {
        return await apiClient.get(`/shop-follow/${shopOwnerEmail}/followers`);
    }
};

