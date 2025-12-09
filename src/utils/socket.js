import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/apiConfig';

let socket = null;

/**
 * Initialize socket connection
 * @param {string} token - JWT token for authentication
 * @returns {Socket} Socket instance
 */
export const initializeSocket = (token) => {
    // If socket exists and is connected, disconnect it first to ensure fresh connection with new token
    // This is important when user switches accounts
    if (socket) {
        if (socket.connected) {
            console.log('Disconnecting existing socket to reconnect with new token');
            socket.disconnect();
        }
        socket = null;
    }

    // Use the same base URL as API, but socket.io connects to the root
    const serverUrl = API_CONFIG.BASE_URL || 'http://localhost:5000';

    socket = io(serverUrl, {
        auth: {
            token: token
        },
        transports: ['websocket'], // Force WebSocket for best performance
        upgrade: true,
        rememberUpgrade: true,
        reconnection: true,
        reconnectionDelay: 500, // Faster reconnection
        reconnectionDelayMax: 2000,
        reconnectionAttempts: Infinity, // Keep trying to reconnect
        timeout: 20000,
        forceNew: true, // Force new connection to ensure correct token is used
        autoConnect: true
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
    });

    return socket;
};

/**
 * Get current socket instance
 * @returns {Socket|null} Socket instance or null
 */
export const getSocket = () => {
    return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export default socket;

