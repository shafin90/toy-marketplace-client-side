import { useState, useEffect, useContext, useRef, useCallback, useMemo, startTransition, memo } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import { initializeSocket, getSocket, disconnectSocket } from '../../utils/socket';
import chatAPI from '../../api/chatAPI';
import { toast } from 'react-hot-toast';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './Chat.css';

const Chat = memo(() => {
    const { user } = useContext(AuthContext);
    const { userEmail } = useParams();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [sendingMessages, setSendingMessages] = useState(new Set()); // Track messages being sent
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null); // Ref for scroll container
    const conversationIdRef = useRef(null); // Track current conversation ID
    const socketRef = useRef(null); // Store socket in ref to avoid re-renders
    const listenersSetupRef = useRef(false); // Track if listeners are already set up
    const userEmailRef = useRef(null); // Store user email to prevent unnecessary re-runs
    const conversationsLoadedRef = useRef(false); // Track if conversations have been loaded
    const userNameRef = useRef(null); // Store user name
    const conversationsRef = useRef([]); // Store conversations in ref to avoid dependency issues
    const updateConversationTimeoutRef = useRef(null); // Debounce conversation updates
    const skipConversationUpdateRef = useRef(false); // Flag to skip conversation updates
    
    // Update refs when user changes
    useEffect(() => {
        if (user?.email) {
            userEmailRef.current = user.email;
            userNameRef.current = user.name;
        }
    }, [user?.email, user?.name]);
    
    // Keep conversations ref in sync
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);
    // Optimized function to update a specific conversation in the list (memoized)
    // Use ref to access current conversations without causing re-renders
    const updateConversationInList = useCallback((conversationId, messageData) => {
        // Skip update if flag is set (when sending messages)
        if (skipConversationUpdateRef.current) {
            return;
        }
        
        // Clear any pending updates
        if (updateConversationTimeoutRef.current) {
            clearTimeout(updateConversationTimeoutRef.current);
        }
        
        // Use ref to check current state without causing re-render
        const currentConversations = conversationsRef.current;
        const currentConvId = conversationIdRef.current?.toString();
        const convIdStr = conversationId?.toString();
        
        // Don't update if it's the current conversation (prevents re-renders)
        if (convIdStr === currentConvId) {
            return; // Skip update for current conversation
        }
        
        // Check if update is needed before setting timeout
        const convIndex = currentConversations.findIndex(conv => conv._id?.toString() === convIdStr);
        if (convIndex === -1) return; // Conversation not found, no update needed
        
        const conv = currentConversations[convIndex];
        const newLastMessage = messageData?.text || messageData?.message?.text || conv.lastMessage;
        const newUnreadCount = (conv.unreadCount || 0) + 1;
        
        // Check if update is actually needed
        const lastMsgChanged = conv.lastMessage !== newLastMessage;
        const unreadChanged = conv.unreadCount !== newUnreadCount;
        
        if (!lastMsgChanged && !unreadChanged) {
            return; // No change needed, exit early
        }
        
        // Debounce the update to batch multiple rapid updates (longer delay)
        updateConversationTimeoutRef.current = setTimeout(() => {
            startTransition(() => {
                setConversations(prev => {
                    // Double-check with current state
                    const checkIndex = prev.findIndex(c => c._id?.toString() === convIdStr);
                    if (checkIndex === -1) return prev;
                    
                    const checkConv = prev[checkIndex];
                    // Check again if update is still needed
                    if (checkConv.lastMessage === newLastMessage && 
                        checkConv.unreadCount === newUnreadCount) {
                        return prev; // Already updated or no change
                    }
                    
                    // Create new array only if needed
                    const updated = [...prev];
                    updated[checkIndex] = {
                        ...checkConv,
                        lastMessage: newLastMessage,
                        lastMessageAt: new Date().toISOString(),
                        unreadCount: newUnreadCount
                    };
                    
                    // Only sort if this conversation should move to top
                    if (checkIndex !== 0 && lastMsgChanged) {
                        return updated.sort((a, b) => {
                            const dateA = new Date(a.lastMessageAt || 0).getTime();
                            const dateB = new Date(b.lastMessageAt || 0).getTime();
                            return dateB - dateA;
                        });
                    }
                    
                    return updated;
                });
            });
        }, 1000); // Even longer debounce (1 second) to batch more updates
    }, []);

    // Update conversation read status (memoized)
    const updateConversationReadStatus = useCallback((conversationId) => {
        setConversations(prev => {
            return prev.map(conv => {
                if (conv._id?.toString() === conversationId?.toString()) {
                    if (conv.unreadCount === 0) return conv; // No change needed
                    return {
                        ...conv,
                        unreadCount: 0
                    };
                }
                return conv;
            });
        });
    }, []);

    // Define all functions before useEffects that use them
    const loadConversations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await chatAPI.getUserConversations();
            setConversations(data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMessages = useCallback(async (conversationId) => {
        try {
            const data = await chatAPI.getConversationMessages(conversationId);
            setMessages(data);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

            // Mark messages as read
            if (socket) {
                socket.emit('mark-read', { conversationId });
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }, [socket]);

    const scrollToBottom = useCallback((instant = false) => {
        // Use scrollContainerRef if available, otherwise find it
        let scrollContainer = scrollContainerRef.current;
        
        if (!scrollContainer && messagesEndRef.current) {
            // Find the scroll container (Card.Body with class chat-messages-container)
            const findScrollContainer = (element) => {
                if (!element) return null;
                if (element.classList?.contains('chat-messages-container')) {
                    return element;
                }
                return findScrollContainer(element.parentElement);
            };
            scrollContainer = findScrollContainer(messagesEndRef.current);
        }
        
        if (scrollContainer) {
            // Use scrollTop for instant, jump-free scrolling
            if (instant) {
                // Set scroll position directly without animation - prevents UI jump
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            } else {
                // Smooth scroll for other cases
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        } else if (messagesEndRef.current) {
            // Fallback to scrollIntoView
            messagesEndRef.current.scrollIntoView({ 
                behavior: instant ? 'auto' : 'smooth', 
                block: 'end' 
            });
        }
    }, []);

    const handleSelectConversation = useCallback((conversation) => {
        setSelectedConversation(conversation);
        setMessages([]);
    }, []);

    const handleSendMessage = useCallback((text) => {
        const currentSocket = socketRef.current || socket;
        // Always use current user email from context, fallback to ref
        // Ensure we have the latest user email
        const currentUserEmail = user?.email || userEmailRef.current;
        const currentUserName = user?.name || userNameRef.current;
        if (!currentSocket || !selectedConversation || !text.trim() || !currentUserEmail) {
            console.error('Cannot send message: missing socket, conversation, text, or user email');
            return;
        }

        const messageText = text.trim();
        const tempId = `temp_${Date.now()}_${Math.random()}`;
        const convId = selectedConversation._id;
        
        // Update refs to ensure they're current (use exact email from context)
        const exactUserEmail = user?.email || currentUserEmail;
        userEmailRef.current = exactUserEmail;
        userNameRef.current = currentUserName;
        
        // Debug log to verify sender email
        console.log('Sending message as:', exactUserEmail, 'to conversation:', convId);
        
        // Create optimistic message (show immediately)
        const optimisticMessage = {
            _id: tempId,
            conversationId: convId,
            senderEmail: exactUserEmail, // Use exact email from context
            receiverEmail: selectedConversation.otherParticipant?.email,
            text: messageText,
            createdAt: new Date().toISOString(),
            senderName: currentUserName || 'User',
            isOptimistic: true // Flag to identify optimistic messages
        };

        // Set flag to skip conversation updates when sending
        skipConversationUpdateRef.current = true;
        
        // Add optimistic message - ChatWindow will handle scrolling via useEffect
        setMessages(prev => {
            // Check if message already exists
            const exists = prev.some(m => m._id === tempId || (m.isOptimistic && m.text === messageText));
            if (exists) return prev;
            return [...prev, optimisticMessage];
        });
        
        // Don't scroll here - let ChatWindow's useEffect handle it to prevent jump
        
        // Reset flag after delay (longer to prevent updates during message send/receive cycle)
        setTimeout(() => {
            skipConversationUpdateRef.current = false;
        }, 500);

        // Track sending message (non-urgent)
        setSendingMessages(prev => {
            const newSet = new Set(prev);
            newSet.add(tempId);
            return newSet;
        });

        // Send via socket
        currentSocket.emit('send-message', {
            conversationId: convId,
            text: messageText
        });
    }, [socket, selectedConversation, scrollToBottom, updateConversationInList, user?.email, user?.name]);

    useEffect(() => {
        const currentUserEmail = user?.email;
        if (!currentUserEmail) return;

        // Check if user email changed - if not, don't re-run
        if (userEmailRef.current === currentUserEmail && listenersSetupRef.current) {
            return;
        }

        userEmailRef.current = currentUserEmail;

        // Initialize socket connection - always reconnect when user changes
        const token = localStorage.getItem('token');
        
        // Always reconnect socket when user email changes to ensure correct token is used
        if (token) {
            // Disconnect old socket if exists
            if (socketRef.current && socketRef.current.connected) {
                console.log('Disconnecting old socket for user:', userEmailRef.current);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            
            // Initialize new socket with current token
            const socketInstance = initializeSocket(token);
            socketRef.current = socketInstance;
            setSocket(socketInstance);
            
            console.log('Socket initialized for user:', currentUserEmail);
            
            // Set up listeners if not already set up
            if (!listenersSetupRef.current) {
                // Verify socket connection
                socketInstance.on('connect', () => {
                    console.log('Socket connected for user:', currentUserEmail, 'Socket ID:', socketInstance.id);
                });
                
                // Set up socket event listeners (only once)
                const handleNewMessage = (data) => {
                const conversationIdStr = conversationIdRef.current?.toString();
                const messageConvIdStr = data.conversationId?.toString();
                
                // If this message is for the current conversation, add it immediately
                if (conversationIdStr === messageConvIdStr) {
                    setMessages(prev => {
                        // Check if message already exists (prevent duplicates)
                        const exists = prev.some(m => {
                            const msgId = m._id?.toString();
                            const dataId = data._id?.toString();
                            return msgId === dataId;
                        });
                        
                        if (exists) {
                            return prev; // Message already exists, don't add duplicate
                        }
                        
                        // Replace optimistic message with real one (match by text and time, not senderEmail)
                        // This is important because optimistic message might have wrong senderEmail from stale ref
                        const hasOptimisticMatch = prev.some(m => 
                            m.isOptimistic && 
                            m.text === data.text && 
                            Math.abs(new Date(m.createdAt) - new Date(data.createdAt)) < 10000
                        );
                        
                        if (hasOptimisticMatch) {
                            // Replace optimistic message with real message from backend (which has correct senderEmail)
                            const updated = prev.map(m => {
                                if (m.isOptimistic && 
                                    m.text === data.text && 
                                    Math.abs(new Date(m.createdAt) - new Date(data.createdAt)) < 10000) {
                                    // Use backend data which has correct senderEmail and senderName
                                    return { ...data, isOptimistic: false };
                                }
                                return m;
                            });
                            return updated;
                        }
                        
                        // Add new message (use backend data which has correct senderEmail)
                        return [...prev, data];
                    });
                    // Scroll to bottom smoothly after message is added
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            scrollToBottom(false); // Use smooth scroll for received messages
                        });
                    });
                }
                
                // Completely skip conversation list update for current conversation
                // This prevents ALL re-renders when receiving messages in current conversation
                const isCurrentConversation = conversationIdRef.current?.toString() === data.conversationId?.toString();
                // Only update conversation list if it's NOT the current conversation
                if (!isCurrentConversation) {
                    updateConversationInList(data.conversationId, data);
                }
                // For current conversation, we don't need to update the list at all
            };

            const handleNewMessageNotification = (data) => {
                // Update conversation in list (already debounced inside function)
                updateConversationInList(data.conversationId, data.message);
            };

            const handleMessageSent = (data) => {
                // Use startTransition for non-urgent updates
                startTransition(() => {
                    // Remove optimistic messages that have been confirmed
                    setMessages(prev => {
                        const filtered = prev.filter(m => {
                            // Keep real messages and optimistic messages that don't match
                            if (!m.isOptimistic) return true;
                            // Remove optimistic messages that are being replaced
                            return m._id !== `temp_${data.messageId}`;
                        });
                        // Only update if something changed
                        if (filtered.length === prev.length) return prev;
                        return filtered;
                    });
                    
                    // Remove from sending set when confirmed
                    setSendingMessages(prev => {
                        if (!prev.has(data.messageId)) return prev;
                        const newSet = new Set(prev);
                        newSet.delete(data.messageId);
                        return newSet;
                    });
                });
            };

            const handleMessagesRead = (data) => {
                // Update read status for specific conversation (non-urgent)
                startTransition(() => {
                    updateConversationReadStatus(data.conversationId);
                });
            };

            const handleError = (error) => {
                console.error('Socket error:', error);
                toast.error(error.message || 'Connection error');
            };

            // Add event listeners (only if not already set up)
            socketInstance.on('new-message', handleNewMessage);
            socketInstance.on('new-message-notification', handleNewMessageNotification);
            socketInstance.on('message-sent', handleMessageSent);
            socketInstance.on('messages-read', handleMessagesRead);
            socketInstance.on('error', handleError);
            
                listenersSetupRef.current = true;
            }
        }

        // Load conversations only once when user changes
        if (currentUserEmail && !conversationsLoadedRef.current) {
            loadConversations();
            conversationsLoadedRef.current = true;
        }

        return () => {
            // Only cleanup if user email actually changed
            if (userEmailRef.current !== currentUserEmail) {
                listenersSetupRef.current = false;
                conversationsLoadedRef.current = false;
                const currentSocket = socketRef.current || socket || getSocket();
                if (currentSocket) {
                    currentSocket.off('new-message');
                    currentSocket.off('new-message-notification');
                    currentSocket.off('messages-read');
                    currentSocket.off('message-sent');
                    currentSocket.off('error');
                }
            }
        };
    }, [user?.email]); // Minimal dependencies - only user email

    // Handle starting chat with specific user from URL or location state
    useEffect(() => {
        const currentUserEmail = userEmailRef.current;
        if (!currentUserEmail) return;

        const startChatWithUser = async () => {
            if (userEmail && currentUserEmail !== userEmail) {
                try {
                    const conversation = await chatAPI.getOrCreateConversation(userEmail);
                    setSelectedConversation(conversation);
                    // Reload conversations to include the new one
                    await loadConversations();
                } catch (error) {
                    console.error('Error starting chat:', error);
                    toast.error(error.response?.data?.message || 'Failed to start chat');
                }
            } else if (location.state?.conversationId) {
                // If conversation ID is passed via state, find and select it
                const currentConversations = conversationsRef.current;
                const conversation = currentConversations.find(c => c._id === location.state.conversationId);
                if (conversation) {
                    setSelectedConversation(conversation);
                } else {
                    // If conversation not found in list, reload conversations
                    await loadConversations();
                    const updatedConversations = await chatAPI.getUserConversations();
                    const found = updatedConversations.find(c => c._id === location.state.conversationId);
                    if (found) {
                        setSelectedConversation(found);
                    }
                }
            }
        };

        if (userEmail || location.state?.conversationId) {
            startChatWithUser();
        }
    }, [userEmail, location.state?.conversationId, loadConversations]);

    useEffect(() => {
        const currentSocket = socketRef.current || socket;
        if (selectedConversation?._id && currentSocket) {
            const convId = selectedConversation._id;
            conversationIdRef.current = convId;
            
            // Join conversation room immediately
            currentSocket.emit('join-conversation', convId);
            
            // Load messages
            loadMessages(convId);

            return () => {
                conversationIdRef.current = null;
                const cleanupSocket = socketRef.current || socket || getSocket();
                if (cleanupSocket) {
                    cleanupSocket.emit('leave-conversation', convId);
                }
            };
        } else {
            conversationIdRef.current = null;
        }
    }, [selectedConversation?._id, socket, loadMessages]);

    // Use ref to check user instead of direct context access
    const currentUserEmail = userEmailRef.current || user?.email;
    
    if (!currentUserEmail) {
        return (
            <Container className="my-5">
                <Card>
                    <Card.Body className="text-center">
                        <h4>Please login to use chat</h4>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    // Memoize stable values to prevent re-renders
    const stableUserEmail = useMemo(() => userEmailRef.current || user?.email, [user?.email]);
    const stableSocket = useMemo(() => socketRef.current || socket, [socket]);

    return (
        <Container fluid className="chat-container">
            <Row className="h-100">
                {/* Chat List Sidebar */}
                <Col md={4} className="chat-sidebar p-0">
                    <ChatList
                        conversations={conversations}
                        selectedConversation={selectedConversation}
                        onSelectConversation={handleSelectConversation}
                        loading={loading}
                        currentUserEmail={stableUserEmail}
                    />
                </Col>

                {/* Chat Window */}
                <Col md={8} className="chat-window-container p-0">
                    {selectedConversation ? (
                        <ChatWindow
                            key={selectedConversation._id} // Key to prevent unnecessary re-renders
                            conversation={selectedConversation}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            socket={stableSocket}
                            currentUserEmail={stableUserEmail}
                            messagesEndRef={messagesEndRef}
                        />
                    ) : (
                        <div className="chat-placeholder">
                            <div className="text-center">
                                <h3>Select a conversation</h3>
                                <p className="text-muted">Choose a conversation from the list to start chatting</p>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
});

Chat.displayName = 'Chat';

export default Chat;

