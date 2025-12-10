/**
 * Request Cache & Deduplication Utility
 * 
 * Layer: Utility Layer
 * Purpose: Prevents duplicate API calls and caches responses
 * 
 * Features:
 * - Request deduplication (prevents multiple identical requests)
 * - Response caching (stores responses for a TTL period)
 * - Automatic cache invalidation
 */

// Map to store pending requests (prevents duplicate calls)
const pendingRequests = new Map();

// Map to store cached responses
const requestCache = new Map();

// Default cache TTL (Time To Live) in milliseconds
const DEFAULT_TTL = 30000; // 30 seconds

/**
 * Generate a cache key from request config
 * @param {string} url - Request URL
 * @param {string} method - HTTP method
 * @param {Object} params - Request parameters
 * @returns {string} Cache key
 */
const generateCacheKey = (url, method = 'GET', params = {}) => {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${JSON.stringify(params[key])}`)
        .join('&');
    
    return `${method}:${url}${sortedParams ? `?${sortedParams}` : ''}`;
};

/**
 * Check if cached data is still valid
 * @param {Object} cached - Cached data object
 * @param {number} ttl - Time to live in milliseconds
 * @returns {boolean} True if cache is valid
 */
const isCacheValid = (cached, ttl) => {
    if (!cached || !cached.timestamp) return false;
    return Date.now() - cached.timestamp < ttl;
};

/**
 * Deduplicate and cache API requests
 * 
 * @param {string} url - Request URL
 * @param {Function} requestFn - Function that returns a Promise (the actual API call)
 * @param {Object} options - Options object
 * @param {number} options.ttl - Cache TTL in milliseconds (default: 30000)
 * @param {string} options.method - HTTP method (default: 'GET')
 * @param {Object} options.params - Request parameters for cache key generation
 * @param {boolean} options.skipCache - Skip caching for this request (default: false)
 * @returns {Promise} Response data
 * 
 * @example
 * const data = await dedupeRequest(
 *     '/api/toys',
 *     () => toyAPI.getAllToys(),
 *     { ttl: 60000 }
 * );
 */
export const dedupeRequest = async (url, requestFn, options = {}) => {
    const {
        ttl = DEFAULT_TTL,
        method = 'GET',
        params = {},
        skipCache = false
    } = options;

    const cacheKey = generateCacheKey(url, method, params);

    // Check cache first (only for GET requests and if caching is enabled)
    if (!skipCache && method === 'GET' && requestCache.has(cacheKey)) {
        const cached = requestCache.get(cacheKey);
        if (isCacheValid(cached, ttl)) {
            // Return cached data
            return Promise.resolve(cached.data);
        } else {
            // Remove expired cache
            requestCache.delete(cacheKey);
        }
    }

    // Check if request is already pending
    if (pendingRequests.has(cacheKey)) {
        // Return the existing promise (deduplication)
        return pendingRequests.get(cacheKey);
    }

    // Create new request promise
    const requestPromise = requestFn()
        .then((data) => {
            // Cache successful GET responses
            if (!skipCache && method === 'GET') {
                requestCache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
            }

            // Remove from pending requests
            pendingRequests.delete(cacheKey);

            return data;
        })
        .catch((error) => {
            // Remove from pending requests on error
            pendingRequests.delete(cacheKey);
            throw error;
        });

    // Store pending request
    pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
};

/**
 * Invalidate cache for a specific URL pattern
 * @param {string} urlPattern - URL pattern to match (supports wildcards)
 * @returns {number} Number of cache entries invalidated
 * 
 * @example
 * invalidateCache('/api/toys'); // Invalidates all /api/toys requests
 * invalidateCache('/api/toys/123'); // Invalidates specific toy
 */
export const invalidateCache = (urlPattern) => {
    let invalidatedCount = 0;

    for (const [key, value] of requestCache.entries()) {
        if (key.includes(urlPattern)) {
            requestCache.delete(key);
            invalidatedCount++;
        }
    }

    return invalidatedCount;
};

/**
 * Clear all cached requests
 * @returns {void}
 */
export const clearCache = () => {
    requestCache.clear();
    pendingRequests.clear();
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
    return {
        cachedRequests: requestCache.size,
        pendingRequests: pendingRequests.size,
        totalEntries: requestCache.size + pendingRequests.size
    };
};

/**
 * Preload data into cache
 * @param {string} url - Request URL
 * @param {*} data - Data to cache
 * @param {Object} options - Options object
 * @param {string} options.method - HTTP method
 * @param {Object} options.params - Request parameters
 * @returns {void}
 */
export const preloadCache = (url, data, options = {}) => {
    const {
        method = 'GET',
        params = {}
    } = options;

    const cacheKey = generateCacheKey(url, method, params);
    requestCache.set(cacheKey, {
        data,
        timestamp: Date.now()
    });
};

export default {
    dedupeRequest,
    invalidateCache,
    clearCache,
    getCacheStats,
    preloadCache
};

