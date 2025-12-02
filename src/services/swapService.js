import swapAPI from '../api/swapAPI';
import userService from './userService';
import toyService from './toyService';

/**
 * Business Logic Layer - Swap Service
 * Contains business logic for toy swapping
 */

const swapService = {
    /**
     * Perform a toy swap
     * @param {Object} swapData - { toyId, toy, buyerEmail, sellerEmail }
     * @returns {Promise} Swap result
     */
    performSwap: async (swapData) => {
        try {
            const { toyId, toy, buyerEmail, sellerEmail } = swapData;

            // Validate swap data
            if (!toyId || !buyerEmail || !sellerEmail) {
                throw new Error('Missing required swap information');
            }

            // Check if buyer is trying to swap their own toy
            if (buyerEmail === sellerEmail) {
                throw new Error('You cannot swap your own toy');
            }

            // Get buyer's current credits
            const buyer = await userService.getUserDetails(buyerEmail);

            // Check if buyer has enough credits
            if (!toyService.canAffordToy(buyer.credits, toy.creditCost)) {
                throw new Error(`Insufficient credits. You need ${toy.creditCost} credits but have ${buyer.credits}`);
            }

            // Perform the swap
            const result = await swapAPI.swapToy({
                toyId,
                buyerEmail,
                sellerEmail,
            });

            return {
                success: true,
                message: 'Swap successful!',
                newCredits: buyer.credits - toy.creditCost,
                toy: toy,
            };
        } catch (error) {
            console.error('Error performing swap:', error);
            throw error;
        }
    },


    /**
     * Validate swap eligibility
     * @param {Object} params - { userCredits, toyCost, buyerEmail, sellerEmail }
     * @returns {Object} Validation result
     */
    validateSwap: (params) => {
        const { userCredits, toyCost, buyerEmail, sellerEmail } = params;

        if (buyerEmail === sellerEmail) {
            return {
                valid: false,
                message: 'You cannot swap your own toy',
            };
        }

        if (userCredits < toyCost) {
            return {
                valid: false,
                message: `Insufficient credits. You need ${toyCost} credits but have ${userCredits}`,
            };
        }

        return {
            valid: true,
            message: 'Swap is valid',
        };
    },

    /**
     * Calculate swap transaction
     * @param {number} buyerCredits - Buyer's current credits
     * @param {number} sellerCredits - Seller's current credits
     * @param {number} toyCost - Toy's credit cost
     * @returns {Object} Transaction details
     */
    calculateSwapTransaction: (buyerCredits, sellerCredits, toyCost) => {
        return {
            buyerNewBalance: buyerCredits - toyCost,
            sellerNewBalance: sellerCredits + toyCost,
            creditTransferred: toyCost,
        };
    },
};

export default swapService;
