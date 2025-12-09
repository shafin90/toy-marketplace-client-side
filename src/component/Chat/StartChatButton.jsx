import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Provider/Provider';
import chatAPI from '../../api/chatAPI';
import { toast } from 'react-hot-toast';

/**
 * Button component to start a chat with a user
 * @param {Object} props
 * @param {string} props.userEmail - Email of the user to chat with
 * @param {string} props.userName - Name of the user (optional)
 * @param {string} props.variant - Button variant (default: 'primary')
 * @param {string} props.size - Button size (default: 'sm')
 */
const StartChatButton = ({ userEmail, userName, variant = 'primary', size = 'sm' }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleStartChat = async () => {
        if (!user) {
            toast.error('Please login to start a chat');
            navigate('/login');
            return;
        }

        if (user.email === userEmail) {
            toast.error('You cannot chat with yourself');
            return;
        }

        try {
            setLoading(true);
            // Get or create conversation
            const conversation = await chatAPI.getOrCreateConversation(userEmail);
            
            // Navigate to chat page with conversation
            navigate('/chat', { state: { conversationId: conversation._id } });
        } catch (error) {
            console.error('Error starting chat:', error);
            toast.error(error.response?.data?.message || 'Failed to start chat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleStartChat}
            disabled={loading || !user || user.email === userEmail}
            className="start-chat-button"
        >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Starting...
                </>
            ) : (
                <>
                    <i className="fas fa-comments me-2"></i>
                    {userName ? `Chat with ${userName}` : 'Start Chat'}
                </>
            )}
        </Button>
    );
};

export default StartChatButton;

