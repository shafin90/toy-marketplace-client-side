import { useState, useEffect } from 'react';
import toyService from '../services/toyService';

/**
 * Custom Hook - useToys
 * Manages toy data fetching and state
 */
const useToys = () => {
    const [toys, setToys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchToys();
    }, []);

    const fetchToys = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await toyService.getAllToys();
            setToys(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching toys:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshToys = () => {
        fetchToys();
    };

    return {
        toys,
        loading,
        error,
        refreshToys,
    };
};

export default useToys;
