import apiClient from './apiClient';

export const tradeInAPI = {
    calculateValue: async (toyData) => {
        return await apiClient.post('/trade-in/calculate', toyData);
    },

    getConditionMultipliers: async () => {
        return await apiClient.get('/trade-in/condition-multipliers');
    }
};

