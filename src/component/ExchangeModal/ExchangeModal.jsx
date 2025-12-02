import { useState, useEffect } from 'react';
import { Modal, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import exchangeAPI from '../../api/exchangeAPI';
import oldToyAPI from '../../api/oldToyAPI';
import { getImageUrl } from '../../config/apiConfig';
import './ExchangeModal.css';

const ExchangeModal = ({ show, onClose, productId, userId, onSuccess }) => {
    const [oldToys, setOldToys] = useState([]);
    const [selectedOldToys, setSelectedOldToys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (show && userId) {
            fetchUserOldToys();
        }
    }, [show, userId]);

    const fetchUserOldToys = async () => {
        try {
            setFetching(true);
            const data = await oldToyAPI.getUserOldToys(userId);
            setOldToys(data);
        } catch (error) {
            console.error('Error fetching old toys:', error);
            toast.error('Failed to load your old toys');
        } finally {
            setFetching(false);
        }
    };

    const handleToggleOldToy = (oldToyId) => {
        setSelectedOldToys(prev => {
            if (prev.includes(oldToyId)) {
                return prev.filter(id => id !== oldToyId);
            } else {
                return [...prev, oldToyId];
            }
        });
    };

    const handleSubmit = async () => {
        if (selectedOldToys.length === 0) {
            toast.error('Please select at least one old toy');
            return;
        }

        try {
            setLoading(true);
            await exchangeAPI.createExchangeRequest({
                productId,
                oldToyIds: selectedOldToys
            });
            
            toast.success('Exchange request submitted! Shop owner will review and set prices.');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating exchange request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit exchange request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Exchange with Old Toys</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-3">
                    Select the old toys you want to exchange for this product. 
                    The shop owner will review and set discount prices for each toy.
                </p>

                {fetching ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : oldToys.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted">You don't have any old toys listed yet.</p>
                        <Button variant="primary" onClick={() => {
                            onClose();
                            window.location.href = '/list-old-toy';
                        }}>
                            List Old Toy
                        </Button>
                    </div>
                ) : (
                    <>
                        <Form.Label className="mb-2">
                            <strong>Select Old Toys ({selectedOldToys.length} selected)</strong>
                        </Form.Label>
                        <ListGroup className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {oldToys.map((oldToy) => (
                                <ListGroup.Item
                                    key={oldToy._id}
                                    action
                                    active={selectedOldToys.includes(oldToy._id)}
                                    onClick={() => handleToggleOldToy(oldToy._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex align-items-center">
                                        {oldToy.images && oldToy.images.length > 0 && (
                                            <img
                                                src={getImageUrl(oldToy.images[0])}
                                                alt={oldToy.name}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    marginRight: '15px'
                                                }}
                                            />
                                        )}
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{oldToy.name}</h6>
                                            <small className="text-muted">
                                                {oldToy.purchaseLocation && (
                                                    <>📍 {oldToy.purchaseLocation}<br /></>
                                                )}
                                                {oldToy.purchaseDate && (
                                                    <>📅 {new Date(oldToy.purchaseDate).toLocaleDateString()}</>
                                                )}
                                            </small>
                                        </div>
                                        {selectedOldToys.includes(oldToy._id) && (
                                            <Badge bg="success">Selected</Badge>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={loading || selectedOldToys.length === 0 || oldToys.length === 0}
                >
                    {loading ? 'Submitting...' : `Submit Exchange Request (${selectedOldToys.length} toys)`}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExchangeModal;

