import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { Card, Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { getImageUrl } from '../../config/apiConfig';
import './Chat.css';

const ChatWindow = memo(({ conversation, messages, onSendMessage, socket, currentUserEmail, messagesEndRef }) => {
    // Normalize currentUserEmail for comparison
    const normalizedCurrentEmail = useMemo(() => {
        return currentUserEmail?.toLowerCase()?.trim() || '';
    }, [currentUserEmail]);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);
    const scrollContainerRef = useRef(null); // Ref for scroll container
    const lastMessageIdRef = useRef(null);
    const isScrollingRef = useRef(false); // Prevent scroll conflicts

    const otherParticipant = conversation.otherParticipant;

    useEffect(() => {
        // Focus input when conversation changes
        inputRef.current?.focus();
    }, [conversation?._id]); // Only depend on conversation ID, not entire object

    // Auto-scroll when new messages arrive (but only if user is near bottom)
    useEffect(() => {
        if (!scrollContainerRef.current || messages.length === 0 || isScrollingRef.current) return;
        
        const lastMessage = messages[messages.length - 1];
        const lastMessageId = lastMessage?._id;
        
        // Only scroll if it's a new message (not just a re-render)
        if (lastMessageId && lastMessageId !== lastMessageIdRef.current) {
            lastMessageIdRef.current = lastMessageId;
            
            const container = scrollContainerRef.current;
            if (!container) return;
            
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            
            // Only auto-scroll if user is near bottom or it's an optimistic message
            if (isNearBottom || lastMessage?.isOptimistic) {
                isScrollingRef.current = true;
                
                // Use multiple RAFs to ensure DOM is fully updated before scrolling
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (container) {
                            // Use instant scroll (scrollTop) to prevent UI jump
                            container.scrollTop = container.scrollHeight;
                        }
                        isScrollingRef.current = false;
                    });
                });
            }
        }
    }, [messages.length, messages[messages.length - 1]?._id]);

    useEffect(() => {
        if (!socket || !conversation?._id) return;

        const convId = conversation._id;
        const handleTyping = (data) => {
            if (data.conversationId === convId && data.userEmail !== currentUserEmail) {
                setTypingUser(data.userName);
                setIsTyping(data.isTyping);
                
                if (!data.isTyping) {
                    setTimeout(() => {
                        setTypingUser(null);
                        setIsTyping(false);
                    }, 1000);
                }
            }
        };

        socket.on('user-typing', handleTyping);

        return () => {
            socket.off('user-typing', handleTyping);
        };
    }, [socket, conversation?._id, currentUserEmail]); // Only depend on conversation ID

    const handleInputChange = useCallback((e) => {
        setMessageText(e.target.value);

        const convId = conversation?._id;
        if (!convId || !socket) return;

        // Emit typing indicator (debounced)
        if (!isTyping) {
            socket.emit('typing', { conversationId: convId });
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            if (socket) {
                socket.emit('stop-typing', { conversationId: convId });
            }
        }, 1000);
    }, [socket, isTyping, conversation?._id]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const text = messageText.trim();
        if (!text) return;
        
        const convId = conversation?._id;
        onSendMessage(text);
        setMessageText('');
        
        // Stop typing indicator
        if (socket && convId) {
            socket.emit('stop-typing', { conversationId: convId });
        }
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    }, [messageText, onSendMessage, socket, conversation?._id]);

    const formatMessageTime = useCallback((dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }, []);

    // Memoize messages rendering
    const renderedMessages = useMemo(() => {
        return messages.map((message) => {
            // Compare senderEmail with currentUserEmail (case-insensitive and trimmed)
            const messageSenderEmail = message.senderEmail?.toLowerCase()?.trim() || '';
            const isOwnMessage = messageSenderEmail === normalizedCurrentEmail && normalizedCurrentEmail !== '';
            const isOptimistic = message.isOptimistic;
            
            // Debug log for troubleshooting (remove in production)
            if (isOptimistic || messageSenderEmail !== normalizedCurrentEmail) {
                console.log('Message display check:', {
                    messageSenderEmail,
                    normalizedCurrentEmail,
                    isOwnMessage,
                    messageText: message.text?.substring(0, 20)
                });
            }
            
            return (
                <div
                    key={message._id}
                    className={`message-wrapper ${isOwnMessage ? 'own-message' : 'other-message'} ${isOptimistic ? 'optimistic-message' : ''}`}
                >
                    <div className={`message-bubble ${isOwnMessage ? 'sent' : 'received'} ${isOptimistic ? 'sending' : ''}`}>
                        <p className="message-text mb-1">{message.text}</p>
                        <small className="message-time">
                            {isOptimistic ? (
                                <span className="text-muted">
                                    <i className="fas fa-circle-notch fa-spin me-1"></i>
                                    Sending...
                                </span>
                            ) : (
                                formatMessageTime(message.createdAt)
                            )}
                        </small>
                    </div>
                </div>
            );
        });
    }, [messages, normalizedCurrentEmail, formatMessageTime]);

    return (
        <Card className="h-100 chat-window-card">
            {/* Chat Header */}
            <Card.Header className="chat-window-header">
                <div className="d-flex align-items-center">
                    <div className="avatar-wrapper me-3">
                        {otherParticipant?.photoURL ? (
                            <img
                                src={getImageUrl(otherParticipant.photoURL)}
                                alt={otherParticipant.name}
                                className="chat-header-avatar"
                            />
                        ) : (
                            <div className="chat-header-avatar-placeholder">
                                {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h6 className="mb-0">{otherParticipant?.name || otherParticipant?.email || 'Unknown User'}</h6>
                        <small className="text-muted">
                            {otherParticipant?.email}
                        </small>
                    </div>
                </div>
            </Card.Header>

            {/* Messages Area */}
            <Card.Body ref={scrollContainerRef} className="chat-messages-container">
                <div className="messages-list">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted p-4">
                            <p>No messages yet</p>
                            <small>Start the conversation!</small>
                        </div>
                    ) : (
                        renderedMessages
                    )}
                    {isTyping && typingUser && (
                        <div className="typing-indicator">
                            <span>{typingUser} is typing...</span>
                            <span className="typing-dots">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </Card.Body>

            {/* Message Input */}
            <Card.Footer className="chat-input-container">
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Form.Control
                            ref={inputRef}
                            type="text"
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={handleInputChange}
                            className="chat-input"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!messageText.trim()}
                            className="send-button"
                        >
                            Send
                        </Button>
                    </InputGroup>
                </Form>
            </Card.Footer>
        </Card>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    // Check conversation ID
    if (prevProps.conversation?._id !== nextProps.conversation?._id) {
        return false;
    }
    
    // Check messages array - only re-render if messages actually changed
    if (prevProps.messages.length !== nextProps.messages.length) {
        return false;
    }
    
    // Check if last message changed
    const prevLastMsg = prevProps.messages[prevProps.messages.length - 1];
    const nextLastMsg = nextProps.messages[nextProps.messages.length - 1];
    if (prevLastMsg?._id !== nextLastMsg?._id || prevLastMsg?.text !== nextLastMsg?.text) {
        return false;
    }
    
    // Check if any message changed (for optimistic updates)
    const messagesChanged = prevProps.messages.some((msg, idx) => {
        const nextMsg = nextProps.messages[idx];
        return msg._id !== nextMsg._id || msg.isOptimistic !== nextMsg.isOptimistic;
    });
    
    if (messagesChanged) {
        return false;
    }
    
    return (
        prevProps.currentUserEmail === nextProps.currentUserEmail &&
        prevProps.socket === nextProps.socket
    );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;

