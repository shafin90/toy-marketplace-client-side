import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '../../config/apiConfig';
import purchaseAPI from '../../api/purchaseAPI';

// Initialize Stripe
const stripePromise = loadStripe(API_CONFIG.STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ toyId, buyerEmail, amount, toyName, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        // Create payment intent when component mounts
        const createPaymentIntent = async () => {
            try {
                setLoading(true);
                const result = await purchaseAPI.purchaseWithMoney({
                    toyId,
                    buyerEmail,
                    paymentDetails: { paymentMethod: 'stripe' }
                });

                if (result.requiresPayment && result.paymentIntent?.clientSecret) {
                    setClientSecret(result.paymentIntent.clientSecret);
                } else {
                    setError('Failed to initialize payment. Please try again.');
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to initialize payment');
            } finally {
                setLoading(false);
            }
        };

        createPaymentIntent();
    }, [toyId, buyerEmail]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);

        try {
            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        email: buyerEmail,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Confirm purchase on backend
                try {
                    const result = await purchaseAPI.confirmMoneyPurchase({
                        toyId,
                        buyerEmail,
                        paymentIntentId: paymentIntent.id
                    });

                    if (result.success) {
                        toast.success(`🎉 Purchase successful! You got ${toyName}!`);
                        onSuccess();
                    } else {
                        setError('Payment succeeded but purchase confirmation failed. Please contact support.');
                    }
                } catch (confirmError) {
                    setError(confirmError.response?.data?.message || 'Payment succeeded but purchase confirmation failed.');
                }
            } else {
                setError('Payment was not completed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            
            <div className="mb-3 p-3 border rounded">
                <h5>Payment Details</h5>
                <p className="mb-2"><strong>Amount:</strong> ৳ {amount}</p>
                <p className="mb-3 text-muted small">Enter your card details below</p>
                
                <div className="p-3 bg-light rounded">
                    <CardElement options={cardElementOptions} />
                </div>
                
                <p className="text-muted small mt-2">
                    <strong>Test Card:</strong> 4242 4242 4242 4242<br />
                    Any future expiry date, any CVC
                </p>
            </div>

            <div className="d-flex gap-2 justify-content-end">
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={!stripe || loading || !clientSecret}
                >
                    {loading ? 'Processing...' : `Pay ৳ ${amount}`}
                </Button>
            </div>
        </Form>
    );
};

const StripePayment = ({ show, onClose, toyId, buyerEmail, amount, toyName, onSuccess }) => {
    if (!API_CONFIG.STRIPE_PUBLISHABLE_KEY) {
        return (
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="danger">
                        Stripe is not configured. Please contact support.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Complete Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        toyId={toyId}
                        buyerEmail={buyerEmail}
                        amount={amount}
                        toyName={toyName}
                        onSuccess={onSuccess}
                        onClose={onClose}
                    />
                </Elements>
            </Modal.Body>
        </Modal>
    );
};

export default StripePayment;

