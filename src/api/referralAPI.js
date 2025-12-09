import apiClient from './apiClient';

export const referralAPI = {
    getReferralCode: async (userEmail) => {
        return await apiClient.get(`/referral/${userEmail}/code`);
    },

    useReferralCode: async (refereeEmail, referralCode) => {
        return await apiClient.post('/referral/use', { refereeEmail, referralCode });
    },

    getUserReferrals: async (userEmail) => {
        return await apiClient.get(`/referral/${userEmail}/referrals`);
    }
};

