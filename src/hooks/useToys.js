import { useState, useEffect, useRef } from 'react';
import toyService from '../services/toyService';

/**
 * Custom Hook - useToys
 * Manages toy data fetching and state
 * Includes request cancellation to prevent memory leaks
 */
const useToys = () => {
    const [toys, setToys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        fetchToys();
        
        // Cleanup: Cancel request on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const fetchToys = async () => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Create new AbortController
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
        
        try {
            setLoading(true);
            setError(null);
            const data = await toyService.getAllToys({}, { signal });
            
            // Only update state if request wasn't aborted
            if (!signal.aborted) {
                setToys(data);
            }
        } catch (err) {
            // Don't set error if request was aborted
            if (err.name !== 'AbortError' && !signal.aborted) {
                setError(err.message);
                console.error('Error fetching toys:', err);
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
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
