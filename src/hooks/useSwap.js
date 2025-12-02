import { useState, useContext } from 'react';
import swapService from '../services/swapService';
import { AuthContext } from '../component/Provider/Provider';
import userAPI from '../api/userAPI';
import toast from 'react-hot-toast';

/**
 * Custom Hook - useSwap
 * Manages toy swap operations
 */
const useSwap = () => {
    const [loading, setLoading] = useState(false);
    const { user, userCredits, setUserCredits } = useContext(AuthContext);

    /**
     * Perform a toy swap
     */
    const performSwap = async (toy) => {
        if (!user) {
            toast.error('Please login to swap toys');
            return { success: false };
        }

        // Validate swap
        const validation = swapService.validateSwap({
            userCredits: userCredits || 0,
            toyCost: toy.creditCost,
            buyerEmail: user.email,
            sellerEmail: toy.sellerEmail,
        });

        if (!validation.valid) {
            toast.error(validation.message);
            return { success: false, message: validation.message };
        }

        try {
            setLoading(true);

            const result = await swapService.performSwap({
                toyId: toy._id,
                toy: toy,
                buyerEmail: user.email,
                sellerEmail: toy.sellerEmail,
            });

            // Refresh credits after successful swap
            if (user?.email && setUserCredits) {
                try {
                    const userData = await userAPI.getUserByEmail(user.email);
                    if (userData && userData.credits !== undefined) {
                        setUserCredits(userData.credits);
                    }
                } catch (error) {
                    console.error('Error refreshing credits:', error);
                }
            }

            toast.success(`🎉 Swap successful! You got ${toy.name}!`);

            return {
                success: true,
                ...result,
            };
        } catch (error) {
            toast.error(error.message || 'Swap failed. Please try again.');
            return {
                success: false,
                message: error.message,
            };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if user can swap a toy
     */
    const canSwap = (toy) => {
        if (!user) return false;
        if (user.email === toy.sellerEmail) return false;
        if ((userCredits || 0) < toy.creditCost) return false;
        return true;
    };

    return {
        performSwap,
        canSwap,
        loading,
    };
};

export default useSwap;
