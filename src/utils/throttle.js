/**
 * Throttle Utility
 * 
 * Layer: Utility Layer
 * Purpose: Limit function execution to at most once per specified time period
 * 
 * Use cases:
 * - Scroll events (update UI at most every X ms)
 * - Mouse move events
 * - Window resize events
 * - API calls that should be rate-limited
 */

/**
 * Throttle a function - limits execution to once per time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   updateScrollPosition();
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 */
export const throttle = (func, limit = 100) => {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};

/**
 * Throttle with leading and trailing options
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @param {Object} options - Options object
 * @param {boolean} options.leading - Execute on leading edge (default: true)
 * @param {boolean} options.trailing - Execute on trailing edge (default: false)
 * @returns {Function} Throttled function
 */
export const throttleAdvanced = (func, limit = 100, options = {}) => {
    const { leading = true, trailing = false } = options;
    let timeout;
    let previous = 0;
    
    return function executedFunction(...args) {
        const now = Date.now();
        
        if (!previous && !leading) previous = now;
        
        const remaining = limit - (now - previous);
        
        if (remaining <= 0 || remaining > limit) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout && trailing) {
            timeout = setTimeout(() => {
                previous = leading ? Date.now() : 0;
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
};

/**
 * React hook version of throttle
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled callback
 * 
 * @example
 * const throttledScroll = useThrottle(() => {
 *   updateScrollPosition();
 * }, 100);
 */
export const useThrottle = (callback, delay = 100) => {
    const { useRef, useEffect, useCallback } = require('react');
    
    const lastRun = useRef(Date.now());
    
    const throttledCallback = useCallback(
        (...args) => {
            if (Date.now() - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = Date.now();
            }
        },
        [callback, delay]
    );
    
    return throttledCallback;
};

export default throttle;

