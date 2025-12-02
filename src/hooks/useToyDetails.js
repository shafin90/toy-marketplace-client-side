import { useState, useEffect } from 'react';
import toyService from '../services/toyService';

/**
 * Custom Hook - useToyDetails
 * Fetches and manages single toy details
 */
const useToyDetails = (toyId) => {
    const [toy, setToy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (toyId) {
            fetchToyDetails();
        }
    }, [toyId]);

    const fetchToyDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await toyService.getToyDetails(toyId);
            setToy(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching toy details:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        toy,
        loading,
        error,
        refreshToy: fetchToyDetails,
    };
};

export default useToyDetails;
