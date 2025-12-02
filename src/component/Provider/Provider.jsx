import React, { createContext, useEffect, useState } from 'react';
import toyService from '../../services/toyService';
import userAPI from '../../api/userAPI';

// Create a context for authentication and user data
export const AuthContext = createContext();

const Provider = ({ children }) => {
    // ---------- State ----------
    const [data, setData] = useState([]);
    const [regulerCar, setRegulerCar] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [sportsCar, setSportsCar] = useState([]);
    const [user, setUser] = useState({});
    const [location, setLocation] = useState('');
    const [myToy, setMyToy] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');
    const [latestToy, setLatestToy] = useState(null);
    const [featuredProducts, setFeaturedProducts] = useState(null);
    const [bestSellerProducts, setBestSellerProducts] = useState(null);
    const [userCredits, setUserCredits] = useState(0);
    const [userRole, setUserRole] = useState(null);

    // ---------- Data Processing ----------
    // Latest 10 toys
    useEffect(() => {
        const latest = data.slice(0, 10);
        setLatestToy(latest);
    }, [data]);

    // Featured (first 3) toys
    useEffect(() => {
        const featured = data.slice(0, 3);
        setFeaturedProducts(featured);
    }, [data]);

    // Best seller (first 5) toys
    useEffect(() => {
        const best = data.slice(0, 5);
        setBestSellerProducts(best);
    }, [data]);

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

    // ---------- Categorize Cars ----------
    useEffect(() => {
        const regular = data.filter(e => e.sub_category === 'Regular Car');
        setRegulerCar(regular);
        const truck = data.filter(e => e.sub_category === 'Truck');
        setTrucks(truck);
        const sport = data.filter(e => e.sub_category === 'Sports Car');
        setSportsCar(sport);
        setSpinner(true);
    }, [data]);

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

    // ---------- Logout Handler ----------
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setUserCredits(0);
        setUserRole(null);
    };

    // ---------- Context Value ----------
    const info = {
        regulerCar,
        sportsCar,
        trucks,
        data,
        location,
        setLocation,
        user,
        setUser,
        handleLogout,
        setMyToy,
        myToy,
        spinner,
        setPhotoUrl,
        photoUrl,
        latestToy,
        featuredProducts,
        bestSellerProducts,
        userCredits,
        setUserCredits,
        userRole,
    };

    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    );
};

export default Provider;