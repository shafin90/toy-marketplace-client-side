import { useState, useEffect } from 'react';
import { Modal, Button, Table, Badge, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import exchangeAPI from '../../api/exchangeAPI';
import StripePayment from '../StripePayment/StripePayment';
import './ExchangeConfirmation.css';

const ExchangeConfirmation = ({ show, onClose, exchange, onSuccess }) => {
    const [showStripeModal, setShowStripeModal] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!exchange) return null;

    const handleAccept = async () => {
        try {
            setLoading(true);
            await exchangeAPI.userAcceptExchange(exchange._id);
            toast.success('Exchange accepted! Please complete payment.');
            setShowStripeModal(true);
        } catch (error) {
            console.error('Error accepting exchange:', error);
            toast.error(error.response?.data?.message || 'Failed to accept exchange');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Are you sure you want to reject this exchange offer?')) {
            return;
        }

        try {
            setLoading(true);
            await exchangeAPI.userRejectExchange(exchange._id);
            toast.success('Exchange rejected');
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error rejecting exchange:', error);
            toast.error(error.response?.data?.message || 'Failed to reject exchange');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            // Confirm exchange payment on backend
            await exchangeAPI.confirmExchangePayment(exchange._id, paymentIntentId);
            toast.success('Payment confirmed! Shop owner will arrange delivery.');
            setShowStripeModal(false);
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error confirming exchange payment:', error);
            toast.error(error.response?.data?.message || 'Payment succeeded but confirmation failed. Please contact support.');
        }
    };

    return (
        <>
            <Modal show={show && !showStripeModal} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Exchange Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info">
                        <strong>Shop owner has set the discount prices for your old toys.</strong>
                    </Alert>

                    <div className="mb-3">
                        <h5>Price Breakdown</h5>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Original Price</strong></td>
                                    <td className="text-end">৳ {exchange.originalPrice}</td>
                                </tr>
                                <tr>
                                    <td>Total Discount (from old toys)</td>
                                    <td className="text-end text-success">-৳ {exchange.totalDiscount}</td>
                                </tr>
                                <tr className="table-primary">
                                    <td><strong>Final Price to Pay</strong></td>
                                    <td className="text-end"><strong>৳ {exchange.finalPrice}</strong></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                    {exchange.oldToys && exchange.oldToys.length > 0 && (
                        <div className="mb-3">
                            <h5>Your Old Toys</h5>
                            <Table striped bordered size="sm">
                                <thead>
                                    <tr>
                                        <th>Toy Name</th>
                                        <th className="text-end">Discount</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exchange.oldToys.map((oldToy, index) => (
                                        <tr key={index}>
                                            <td>{oldToy.oldToyName}</td>
                                            <td className="text-end">৳ {oldToy.discountAmount}</td>
                                            <td className="text-center">
                                                {oldToy.status === 'approved' ? (
                                                    <Badge bg="success">Approved</Badge>
                                                ) : (
                                                    <Badge bg="secondary">Rejected</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    <Alert variant="warning">
                        <strong>Note:</strong> After payment, a delivery person will arrive with your new product 
                        and collect your old toys.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Close
                    </Button>
                    <Button variant="outline-dark" onClick={handleReject} disabled={loading}>
                        Reject
                    </Button>
                    <Button variant="success" onClick={handleAccept} disabled={loading}>
                        {loading ? 'Processing...' : 'Accept & Pay ৳' + exchange.finalPrice}
                    </Button>
                </Modal.Footer>
            </Modal>

            {showStripeModal && exchange.product && (
                <StripePayment
                    show={showStripeModal}
                    onClose={() => setShowStripeModal(false)}
                    toyId={exchange.productId}
                    buyerEmail={exchange.userId}
                    amount={exchange.finalPrice}
                    toyName={exchange.product.name || 'Product'}
                    onSuccess={(paymentIntentId) => handlePaymentSuccess(paymentIntentId)}
                    isExchange={true}
                />
            )}
        </>
    );
};

export default ExchangeConfirmation;

