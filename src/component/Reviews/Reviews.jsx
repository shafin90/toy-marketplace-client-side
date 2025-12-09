import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Badge, Modal } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import { useContext } from 'react';
import reviewAPI from '../../api/reviewAPI';
import { toast } from 'react-hot-toast';

const Reviews = ({ toyId, shopOwnerEmail }) => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        if (toyId) {
            fetchReviews();
        }
    }, [toyId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewAPI.getReviewsByToy(toyId);
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to submit a review');
            return;
        }

        if (!reviewForm.comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            await reviewAPI.createReview({
                toyId: toyId,
                userEmail: user.email,
                userName: user.displayName || user.email,
                shopOwnerEmail: shopOwnerEmail,
                rating: parseInt(reviewForm.rating),
                comment: reviewForm.comment
            });

            toast.success('Review submitted successfully!');
            setShowReviewModal(false);
            setReviewForm({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            toast.error(error.message || 'Failed to submit review');
        }
    };

    const renderStars = (rating) => {
        return rating + ' / 5';
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Reviews ({reviews.length})</h4>
                {user && (
                    <Button variant="primary" onClick={() => setShowReviewModal(true)}>
                        Write a Review
                    </Button>
                )}
            </div>

            {loading ? (
                <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <Card>
                    <Card.Body>
                        <p className="text-muted">No reviews yet. Be the first to review!</p>
                    </Card.Body>
                </Card>
            ) : (
                <div>
                    {reviews.map((review, idx) => (
                        <Card key={idx} className="mb-3">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <strong>{review.userName || review.userEmail}</strong>
                                        <Badge bg="warning" text="dark" className="ms-2">
                                            {renderStars(review.rating)}
                                        </Badge>
                                    </div>
                                    <small className="text-muted">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                                <p className="mb-0">{review.comment}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Write a Review</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitReview}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select
                                value={reviewForm.rating}
                                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Share your experience..."
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit Review
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Reviews;

