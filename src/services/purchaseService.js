import purchaseAPI from '../api/purchaseAPI';
import userAPI from '../api/userAPI';

/**
 * Business Logic Layer - Purchase Service
 * Contains business logic for toy purchases
 */

const purchaseService = {
    /**
     * Purchase toy with coins
     * @param {Object} purchaseData - { toyId, buyerEmail }
     * @returns {Promise} Purchase result
     */
    purchaseWithCoins: async (purchaseData) => {
        try {
            const { toyId, buyerEmail } = purchaseData;

            if (!toyId || !buyerEmail) {
                throw new Error('Missing required purchase information');
            }

            const result = await purchaseAPI.purchaseWithCoins({ toyId, buyerEmail });
            return result;
        } catch (error) {
            console.error('Error purchasing with coins:', error);
            throw error;
        }
    },

    /**
     * Purchase toy with money
     * @param {Object} purchaseData - { toyId, buyerEmail, paymentDetails }
     * @returns {Promise} Purchase result
     */
    purchaseWithMoney: async (purchaseData) => {
        try {
            const { toyId, buyerEmail, paymentDetails } = purchaseData;

            if (!toyId || !buyerEmail) {
                throw new Error('Missing required purchase information');
            }

            const result = await purchaseAPI.purchaseWithMoney({ toyId, buyerEmail, paymentDetails });
            return result;
        } catch (error) {
            console.error('Error purchasing with money:', error);
            throw error;
        }
    },

    /**
     * Validate purchase eligibility
     * @param {Object} params - { userCredits, toyCoinPrice, buyerEmail, sellerEmail }
     * @returns {Object} Validation result
     */
    validatePurchase: (params) => {
        const { userCredits, toyCoinPrice, buyerEmail, sellerEmail } = params;

        if (buyerEmail === sellerEmail) {
            return {
                valid: false,
                message: 'You cannot purchase your own toy',
            };
        }

        if (userCredits < toyCoinPrice) {
            return {
                valid: false,
                message: `Insufficient coins. You need ${toyCoinPrice} coins but have ${userCredits}`,
            };
        }

        return {
            valid: true,
            message: 'Purchase is valid',
        };
    },
};

export default purchaseService;

