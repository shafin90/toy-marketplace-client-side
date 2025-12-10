import React, { createContext, useEffect, useState, useMemo, useCallback } from 'react';
import toyService from '../../services/toyService';
import userAPI from '../../api/userAPI';

// Create a context for authentication and user data
export const AuthContext = createContext();

const Provider = ({ children }) => {
    // ---------- State ----------
    const [data, setData] = useState([]);
    const [user, setUser] = useState({});
    const [location, setLocation] = useState('');
    const [myToy, setMyToy] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');
    const [userCredits, setUserCredits] = useState(0);
    const [userRole, setUserRole] = useState(null);

    // ---------- Optimized Derived States with useMemo ----------
    // Latest 10 toys - computed only when data changes
    const latestToy = useMemo(() => {
        return data.slice(0, 10);
    }, [data]);

    // Featured (first 3) toys - computed only when data changes
    const featuredProducts = useMemo(() => {
        return data.slice(0, 3);
    }, [data]);

    // Best seller (first 5) toys - computed only when data changes
    const bestSellerProducts = useMemo(() => {
        return data.slice(0, 5);
    }, [data]);

    // Categorize toys - single useMemo instead of multiple useEffect hooks
    const categorizedToys = useMemo(() => {
        if (!data.length) {
            return {
                regular: [],
                trucks: [],
                sports: []
            };
        }
        
        const regular = data.filter(e => e.sub_category === 'Regular Car');
        const trucks = data.filter(e => e.sub_category === 'Truck');
        const sports = data.filter(e => e.sub_category === 'Sports Car');
        
        // Set spinner to true once data is categorized
        if (!spinner && data.length > 0) {
            setTimeout(() => setSpinner(true), 0);
        }
        
        return {
            regular,
            trucks,
            sports
        };
    }, [data, spinner]);

    // Destructure categorized toys for backward compatibility
    const regulerCar = categorizedToys.regular;
    const trucks = categorizedToys.trucks;
    const sportsCar = categorizedToys.sports;

    // ---------- Load Toys ----------
    useEffect(() => {
        const fetchToys = async () => {
            try {
                const toys = await toyService.getAllToys();
                setData(toys);
            } catch (err) {
                console.error('Failed to load toys', err);
            }
        };
        fetchToys();
    }, []);

    // ---------- My Toys for Logged User ----------
    useEffect(() => {
        const fetchMyToys = async () => {
            if (user?.email) {
                try {
                    const toys = await toyService.getUserToys(user.email);
                    setMyToy(toys);
                } catch (err) {
                    console.error('Failed to load my toys', err);
                }
            } else {
                setMyToy([]);
            }
        };
        fetchMyToys();
    }, [user]);

    // ---------- Initialize User from localStorage ----------
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (err) {
                console.error('Error parsing stored user:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    // ---------- Fetch User Credits and Role ----------
    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.email) {
                try {
                    const userData = await userAPI.getUserByEmail(user.email);
                    if (userData) {
                        if (userData.coins !== undefined) {
                            setUserCredits(userData.coins);
                        } else if (userData.credits !== undefined) {
                            setUserCredits(userData.credits);
                        } else {
                            setUserCredits(50); // default for new users
                        }
                        setUserRole(userData.role || 'user');
                    } else {
                        setUserCredits(50);
                        setUserRole('user');
                    }
                } catch (err) {
                    console.error('Failed to fetch user data', err);
                    setUserCredits(50);
                    setUserRole('user');
                }
            } else {
                setUserCredits(0);
                setUserRole(null);
            }
        };
        fetchUserData();
    }, [user]);

    // ---------- Optimized Handlers with useCallback ----------
    // Logout Handler - memoized to prevent unnecessary re-renders
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setUserCredits(0);
        setUserRole(null);
    }, []);

    // Memoized location setter
    const handleSetLocation = useCallback((newLocation) => {
        setLocation(newLocation);
    }, []);

    // Memoized photo URL setter
    const handleSetPhotoUrl = useCallback((newPhotoUrl) => {
        setPhotoUrl(newPhotoUrl);
    }, []);

    // Memoized user setter
    const handleSetUser = useCallback((newUser) => {
        setUser(newUser);
    }, []);

    // Memoized myToy setter
    const handleSetMyToy = useCallback((newToys) => {
        setMyToy(newToys);
    }, []);

    // Memoized credits setter
    const handleSetUserCredits = useCallback((credits) => {
        setUserCredits(credits);
    }, []);

    // ---------- Memoized Context Value ----------
    // Prevents unnecessary re-renders of all consumers
    const info = useMemo(() => ({
        regulerCar,
        sportsCar,
        trucks,
        data,
        location,
        setLocation: handleSetLocation,
        user,
        setUser: handleSetUser,
        handleLogout,
        setMyToy: handleSetMyToy,
        myToy,
        spinner,
        setPhotoUrl: handleSetPhotoUrl,
        photoUrl,
        latestToy,
        featuredProducts,
        bestSellerProducts,
        userCredits,
        setUserCredits: handleSetUserCredits,
        userRole,
    }), [
        regulerCar,
        sportsCar,
        trucks,
        data,
        location,
        handleSetLocation,
        user,
        handleSetUser,
        handleLogout,
        handleSetMyToy,
        myToy,
        spinner,
        handleSetPhotoUrl,
        photoUrl,
        latestToy,
        featuredProducts,
        bestSellerProducts,
        userCredits,
        handleSetUserCredits,
        userRole,
    ]);

    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    );
};

export default Provider;