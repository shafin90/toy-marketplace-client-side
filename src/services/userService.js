import userAPI from '../api/userAPI';

/**
 * Business Logic Layer - User Service
 * Contains business logic for user operations
 */

const userService = {
    /**
     * Login or register user
     * @param {Object} userData - { email, name, photoURL, role, shopName, shopAddress, phone }
     * @returns {Promise} User object with credits
     */
    loginOrRegister: async (userData) => {
        try {
            // Validate user data
            if (!userData.email || !userData.name) {
                throw new Error('Email and name are required');
            }

            // Ensure role is set
            if (!userData.role) {
                userData.role = 'user';
            }

            const user = await userAPI.registerUser(userData);

            // Store user in localStorage
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.name);
            if (user.photoURL) {
                localStorage.setItem('userPhoto', user.photoURL);
            }
            if (user.role) {
                localStorage.setItem('userRole', user.role);
            }

            return user;
        } catch (error) {
            console.error('Error during login/register:', error);
            throw new Error('Failed to login. Please try again.');
        }
    },

    /**
     * Get current user from localStorage
     * @returns {Object|null} User object or null
     */
    getCurrentUser: () => {
        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName');
        const photoURL = localStorage.getItem('userPhoto');

        if (!email) return null;

        return {
            email,
            name,
            photoURL: photoURL || null,
        };
    },

    /**
     * Get user details including credits
     * @param {string} email - User email
     * @returns {Promise} User object
     */
    getUserDetails: async (email) => {
        try {
            const user = await userAPI.getUserByEmail(email);
            return user;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw new Error('Failed to fetch user details. Please try again.');
        }
    },


    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhoto');
    },

    /**
     * Check if user is logged in
     * @returns {boolean} True if logged in
     */
    isLoggedIn: () => {
        return !!localStorage.getItem('userEmail');
    },

    /**
     * Calculate new credit balance after earning
     * @param {number} currentCredits - Current credits
     * @param {number} earnedCredits - Credits earned
     * @returns {number} New credit balance
     */
    calculateEarnedCredits: (currentCredits, earnedCredits) => {
        return currentCredits + earnedCredits;
    },

    /**
     * Calculate new credit balance after spending
     * @param {number} currentCredits - Current credits
     * @param {number} spentCredits - Credits spent
     * @returns {number} New credit balance
     */
    calculateSpentCredits: (currentCredits, spentCredits) => {
        return Math.max(0, currentCredits - spentCredits);
    },
};

export default userService;
