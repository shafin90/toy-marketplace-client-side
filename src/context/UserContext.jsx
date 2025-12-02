import { createContext, useState, useEffect, useContext } from 'react';
import userService from '../services/userService';

// Create User Context
const UserContext = createContext();

/**
 * User Context Provider
 * Manages user state and authentication
 */
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    /**
     * Load user from localStorage and fetch credits
     */
    const loadUser = async () => {
        try {
            const currentUser = userService.getCurrentUser();

            if (currentUser) {
                setUser(currentUser);

                // Fetch user details including credits
                const userDetails = await userService.getUserDetails(currentUser.email);
                setCredits(userDetails.credits || 0);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login or register user
     */
    const login = async (userData) => {
        try {
            const loggedInUser = await userService.loginOrRegister(userData);
            setUser({
                email: loggedInUser.email,
                name: loggedInUser.name,
                photoURL: loggedInUser.photoURL,
            });
            setCredits(loggedInUser.credits || 50);
            return loggedInUser;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        userService.logout();
        setUser(null);
        setCredits(0);
    };

    /**
     * Refresh user credits
     */
    const refreshCredits = async () => {
        if (user) {
            try {
                const userDetails = await userService.getUserDetails(user.email);
                setCredits(userDetails.credits || 0);
            } catch (error) {
                console.error('Error refreshing credits:', error);
            }
        }
    };

    /**
     * Update credits locally (optimistic update)
     */
    const updateCreditsLocally = (newCredits) => {
        setCredits(newCredits);
    };

    const value = {
        user,
        credits,
        loading,
        isLoggedIn: !!user,
        login,
        logout,
        refreshCredits,
        updateCreditsLocally,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * Custom hook to use User Context
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

export default UserContext;
