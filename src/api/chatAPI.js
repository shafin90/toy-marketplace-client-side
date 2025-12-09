import apiClient from './apiClient';

/**
 * Data Access Layer - Chat API
 * Handles all HTTP requests related to chat
 */

const chatAPI = {
    /**
     * Get or create conversation with another user
     * @param {string} otherUserEmail - Other user's email
     * @returns {Promise} Conversation object
     */
    getOrCreateConversation: async (otherUserEmail) => {
        const response = await apiClient.get(`/chat/conversation/${otherUserEmail}`);
        return response.data;
    },

    /**
     * Get all conversations for logged in user
     * @returns {Promise} Array of conversations
     */
    getUserConversations: async () => {
        const response = await apiClient.get('/chat/conversations');
        return response.data;
    },

    /**
     * Get messages for a conversation
     * @param {string} conversationId - Conversation ID
     * @param {number} limit - Number of messages to retrieve
     * @param {number} skip - Number of messages to skip
     * @returns {Promise} Array of messages
     */
    getConversationMessages: async (conversationId, limit = 50, skip = 0) => {
        const response = await apiClient.get(
            `/chat/conversation/${conversationId}/messages?limit=${limit}&skip=${skip}`
        );
        return response.data;
    }
};

export default chatAPI;

