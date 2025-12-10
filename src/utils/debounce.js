/**
 * Debounce Utility
 * 
 * Layer: Utility Layer
 * Purpose: Delay function execution until after a specified wait time
 * 
 * Use cases:
 * - Search input (wait for user to stop typing)
 * - Window resize events
 * - Scroll events
 * - API calls triggered by user input
 */

/**
 * Debounce a function - delays execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - If true, execute immediately on first call
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((term) => {
 *   fetchToys({ search: term });
 * }, 300);
 * 
 * // Usage in component
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export const debounce = (func, wait = 300, immediate = false) => {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func(...args);
    };
};

/**
 * React hook version of debounce
 * Note: Import React hooks at the top of your component file
 * This is a wrapper that requires React hooks to be available
 * 
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} reactHooks - React hooks object { useRef, useEffect, useCallback }
 * @returns {Function} Debounced callback
 * 
 * @example
 * import { useRef, useEffect, useCallback } from 'react';
 * const debouncedSearch = useDebounce((term) => {
 *   fetchToys({ search: term });
 * }, 300, { useRef, useEffect, useCallback });
 */
export const useDebounce = (callback, delay = 300, reactHooks = null) => {
    if (!reactHooks) {
        // Fallback: return regular debounced function if hooks not provided
        return debounce(callback, delay);
    }
    
    const { useRef, useEffect, useCallback } = reactHooks;
    
    const timeoutRef = useRef(null);
    
    const debouncedCallback = useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
    
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    
    return debouncedCallback;
};

export default debounce;

