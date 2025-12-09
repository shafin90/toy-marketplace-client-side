import { useState, useEffect, useMemo, memo } from 'react';
import { Card, ListGroup, Badge, Spinner, Form } from 'react-bootstrap';
import { getImageUrl } from '../../config/apiConfig';
import './Chat.css';

const ChatList = memo(({ conversations, selectedConversation, onSelectConversation, loading, currentUserEmail }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Memoize filtered conversations
    const filteredConversations = useMemo(() => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return conversations.filter(conv => {
                const otherParticipant = conv.otherParticipant;
                return (
                    otherParticipant?.name?.toLowerCase().includes(searchLower) ||
                    otherParticipant?.email?.toLowerCase().includes(searchLower) ||
                    conv.lastMessage?.toLowerCase().includes(searchLower)
                );
            });
        }
        return conversations;
    }, [searchTerm, conversations]);

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <Card className="h-100 chat-list-card">
            <Card.Header className="chat-list-header">
                <h5 className="mb-0">Messages</h5>
                <Form.Control
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2"
                />
            </Card.Header>
            <Card.Body className="p-0">
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <p>No conversations yet</p>
                        <small>Start chatting with other users!</small>
                    </div>
                ) : (
                    <ListGroup variant="flush" className="conversation-list">
                        {filteredConversations.map((conversation) => {
                            const otherParticipant = conversation.otherParticipant;
                            const isSelected = selectedConversation?._id === conversation._id;

                            return (
                                <ListGroup.Item
                                    key={conversation._id}
                                    className={`conversation-item ${isSelected ? 'active' : ''}`}
                                    onClick={() => onSelectConversation(conversation)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-wrapper me-3">
                                            {otherParticipant?.photoURL ? (
                                                <img
                                                    src={getImageUrl(otherParticipant.photoURL)}
                                                    alt={otherParticipant.name}
                                                    className="conversation-avatar"
                                                />
                                            ) : (
                                                <div className="conversation-avatar-placeholder">
                                                    {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            {conversation.unreadCount > 0 && (
                                                <Badge bg="dark" className="unread-badge">
                                                    {conversation.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 conversation-info">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h6 className="mb-0 conversation-name">
                                                    {otherParticipant?.name || otherParticipant?.email || 'Unknown User'}
                                                </h6>
                                                {conversation.lastMessageAt && (
                                                    <small className="text-muted conversation-time">
                                                        {formatTime(conversation.lastMessageAt)}
                                                    </small>
                                                )}
                                            </div>
                                            <p className="mb-0 conversation-preview text-muted">
                                                {conversation.lastMessage || 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    
    // Quick reference check first
    if (prevProps.conversations === nextProps.conversations) {
        // Same reference - check other props
        return (
            prevProps.selectedConversation?._id === nextProps.selectedConversation?._id &&
            prevProps.loading === nextProps.loading &&
            prevProps.currentUserEmail === nextProps.currentUserEmail
        );
    }
    
    // Different reference - check if length changed
    if (prevProps.conversations.length !== nextProps.conversations.length) {
        return false; // Re-render needed
    }
    
    // Check if conversations have actually changed (only check first few for performance)
    const checkCount = Math.min(prevProps.conversations.length, 10); // Only check first 10
    for (let i = 0; i < checkCount; i++) {
        const prevConv = prevProps.conversations[i];
        const nextConv = nextProps.conversations[i];
        
        if (!prevConv || !nextConv) {
            if (prevConv !== nextConv) return false;
            continue;
        }
        
        // Check if this conversation changed
        if (
            prevConv._id !== nextConv._id ||
            prevConv.lastMessage !== nextConv.lastMessage ||
            prevConv.lastMessageAt !== nextConv.lastMessageAt ||
            prevConv.unreadCount !== nextConv.unreadCount
        ) {
            return false; // Re-render needed
        }
    }
    
    // No significant changes detected
    return (
        prevProps.selectedConversation?._id === nextProps.selectedConversation?._id &&
        prevProps.loading === nextProps.loading &&
        prevProps.currentUserEmail === nextProps.currentUserEmail
    );
});

ChatList.displayName = 'ChatList';

export default ChatList;

