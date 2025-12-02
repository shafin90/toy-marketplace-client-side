import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Image, Button, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import shopAPI from '../../api/shopAPI';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../config/apiConfig';
import PageTitle from '../PageTitle/PageTitle';
import './ShopDetails.css';

const ShopDetails = () => {
    const { shopOwnerEmail } = useParams();
    const { user, userRole } = useContext(AuthContext);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showExchangeableOnly, setShowExchangeableOnly] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    
    const isOwner = user?.email === shopOwnerEmail && userRole === 'shop_owner';
    
    const [editFormData, setEditFormData] = useState({
        shopName: '',
        shopDetails: '',
        shopLocation: '',
        shopImage: null,
        existingImage: ''
    });

    useEffect(() => {
        fetchShopDetails();
    }, [shopOwnerEmail]);

    const fetchShopDetails = async () => {
        try {
            setLoading(true);
            const data = await shopAPI.getShopByOwner(shopOwnerEmail);
            setShop(data);
            
            // Initialize edit form data
            if (data) {
                setEditFormData({
                    shopName: data.shopName || '',
                    shopDetails: data.shopDetails || data.shopDescription || '',
                    shopLocation: data.shopLocation || data.shopAddress || '',
                    shopImage: null,
                    existingImage: data.shopImage || ''
                });
                if (data.shopImage) {
                    setPreview(getImageUrl(data.shopImage));
                }
            }
        } catch (error) {
            console.error('Error fetching shop details:', error);
            toast.error('Failed to load shop details');
        } finally {
            setLoading(false);
        }
    };
    
    const handleEditClick = () => {
        if (shop) {
            setEditFormData({
                shopName: shop.shopName || '',
                shopDetails: shop.shopDetails || shop.shopDescription || '',
                shopLocation: shop.shopLocation || shop.shopAddress || '',
                shopImage: null,
                existingImage: shop.shopImage || ''
            });
            if (shop.shopImage) {
                setPreview(getImageUrl(shop.shopImage));
            }
        }
        setShowEditModal(true);
    };
    
    const handleEditInputChange = (event) => {
        const { id, value } = event.target;
        setEditFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };
    
    const handleEditFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEditFormData(prevState => ({
                ...prevState,
                shopImage: file
            }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveEdit = async (event) => {
        event.preventDefault();
        
        if (!editFormData.shopName || editFormData.shopName.trim() === '') {
            toast.error('Shop name is required');
            return;
        }
        
        if (!editFormData.shopLocation || editFormData.shopLocation.trim() === '') {
            toast.error('Shop location is required');
            return;
        }
        
        if (!editFormData.shopDetails || editFormData.shopDetails.trim() === '') {
            toast.error('Shop details are required');
            return;
        }
        
        try {
            setSaving(true);
            
            const formDataToSend = new FormData();
            formDataToSend.append('shopName', editFormData.shopName);
            formDataToSend.append('shopDetails', editFormData.shopDetails);
            formDataToSend.append('shopLocation', editFormData.shopLocation);
            if (editFormData.shopImage) {
                formDataToSend.append('shopImage', editFormData.shopImage);
            } else if (editFormData.existingImage) {
                formDataToSend.append('shopImage', editFormData.existingImage);
            }
            
            await shopAPI.createOrUpdateShop(shopOwnerEmail, formDataToSend);
            
            toast.success('Shop updated successfully!');
            setShowEditModal(false);
            fetchShopDetails(); // Refresh shop data
        } catch (error) {
            console.error('Error updating shop:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to update shop');
        } finally {
            setSaving(false);
        }
    };

    const handleToyClick = (toyId) => {
        navigate(`/view_details/${toyId}`);
    };

    if (loading) {
        return (
            <Container className="my-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!shop) {
        return (
            <Container className="my-5">
                <Card>
                    <Card.Body className="text-center">
                        <h3>Shop not found</h3>
                        <Button variant="primary" onClick={() => navigate('/shops')}>
                            Back to Shops
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const filteredToys = showExchangeableOnly 
        ? (shop.toys || []).filter(toy => toy.allowOldToyExchange)
        : (shop.toys || []);

    return (
        <Container className="my-5">
            <PageTitle title={shop.shopName || 'Shop Details'} />
            
            {/* Shop Info */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Row>
                                <Col md={3} className="text-center mb-3 mb-md-0">
                                    <Image 
                                        src={getImageUrl(shop.shopImage || shop.owner?.photoURL)} 
                                        rounded 
                                        style={{ 
                                            width: '200px', 
                                            height: '200px', 
                                            objectFit: 'cover',
                                            border: '3px solid #0d6efd'
                                        }}
                                    />
                                </Col>
                                <Col md={9}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h2 className="text-primary mb-0">{shop.shopName || 'Unnamed Shop'}</h2>
                                        {isOwner && (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                onClick={handleEditClick}
                                            >
                                                <i className="fas fa-edit me-1"></i>Edit Shop
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {shop.shopDetails || shop.shopDescription ? (
                                        <div className="mb-3 p-3 bg-light rounded">
                                            <p className="mb-0">{shop.shopDetails || shop.shopDescription}</p>
                                        </div>
                                    ) : null}
                                    
                                    <Row>
                                        <Col md={6}>
                                            <p className="mb-2">
                                                <strong>📍 Location:</strong> {shop.shopLocation || shop.shopAddress || 'Not specified'}
                                            </p>
                                            <p className="mb-2">
                                                <strong>👤 Owner:</strong> {shop.owner?.name || shop.owner?.email || 'N/A'}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p className="mb-2">
                                                <strong>📧 Email:</strong> {shop.owner?.email || 'N/A'}
                                            </p>
                                            <p className="mb-2">
                                                <strong>📞 Phone:</strong> {shop.owner?.phone || 'Not specified'}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Shop Members */}
            {shop.members && shop.members.length > 0 && (
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5>Shop Members</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    {shop.members.map((member, index) => (
                                        <Col md={3} key={index} className="mb-3">
                                            <div className="text-center">
                                                <Image 
                                                    src={getImageUrl(member.image || member.photoURL)} 
                                                    roundedCircle 
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                                <p className="mt-2 mb-0"><strong>{member.name}</strong></p>
                                                <p className="text-muted small">{member.role || 'Member'}</p>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Toys Filter */}
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    Available Toys ({shop.toys?.length || 0})
                                </h5>
                                <div>
                                    <Button
                                        variant={showExchangeableOnly ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        onClick={() => setShowExchangeableOnly(!showExchangeableOnly)}
                                    >
                                        {showExchangeableOnly ? 'Show All' : 'Show Exchangeable Only'}
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Toys by Category */}
            {filteredToys.length === 0 ? (
                <Row>
                    <Col>
                        <Card className="text-center p-5">
                            <Card.Body>
                                <h4>No products available</h4>
                                <p className="text-muted">
                                    {showExchangeableOnly 
                                        ? 'No exchangeable products in this shop.' 
                                        : 'This shop has no products yet.'}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <>
                    {shop.toysByCategory ? (
                        // Show toys grouped by category
                        Object.keys(shop.toysByCategory).map((category) => {
                            const categoryToys = showExchangeableOnly 
                                ? shop.toysByCategory[category].filter(toy => toy.allowOldToyExchange)
                                : shop.toysByCategory[category];
                            
                            if (categoryToys.length === 0) return null;
                            
                            return (
                                <div key={category} className="mb-5">
                                    <Card className="mb-3">
                                        <Card.Header className="bg-primary text-white">
                                            <h4 className="mb-0">
                                                🎯 {category} ({categoryToys.length})
                                            </h4>
                                        </Card.Header>
                                    </Card>
                                    <Row>
                                        {categoryToys.map((toy) => (
                                            <Col md={6} lg={4} key={toy._id} className="mb-4">
                                                <Card 
                                                    className="h-100 toy-card"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleToyClick(toy._id)}
                                                >
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={getImageUrl(toy.picture || toy.pictureUrl)} 
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                    <Card.Body>
                                                        <Card.Title>{toy.name}</Card.Title>
                                                        <Card.Text>
                                                            <small className="text-muted">
                                                                <strong>Price:</strong> ৳ {toy.price || 'N/A'}<br />
                                                                {toy.coinPrice > 0 && (
                                                                    <>💎 {toy.coinPrice} coins<br /></>
                                                                )}
                                                                {toy.allowOldToyExchange && (
                                                                    <Badge bg="success" className="mt-1">Exchange Available</Badge>
                                                                )}
                                                            </small>
                                                        </Card.Text>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Button 
                                                            variant="primary" 
                                                            className="w-100"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToyClick(toy._id);
                                                            }}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Card.Footer>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            );
                        })
                    ) : (
                        // Fallback: Show all toys in a grid
                        <Row>
                            {filteredToys.map((toy) => (
                                <Col md={6} lg={4} key={toy._id} className="mb-4">
                                    <Card 
                                        className="h-100 toy-card"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleToyClick(toy._id)}
                                    >
                                        <Card.Img 
                                            variant="top" 
                                            src={getImageUrl(toy.picture || toy.pictureUrl)} 
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <Card.Body>
                                            <Card.Title>{toy.name}</Card.Title>
                                            <Card.Text>
                                                <small className="text-muted">
                                                    <strong>Price:</strong> ৳ {toy.price || 'N/A'}<br />
                                                    {toy.allowOldToyExchange && (
                                                        <Badge bg="success" className="mt-1">Exchange Available</Badge>
                                                    )}
                                                </small>
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button 
                                                variant="primary" 
                                                className="w-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToyClick(toy._id);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}

            {/* Edit Shop Modal */}
            {isOwner && (
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Shop Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSaveEdit}>
                            <Form.Group controlId="shopName" className="mb-3">
                                <Form.Label>Shop Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Toy Paradise"
                                    value={editFormData.shopName}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="shopLocation" className="mb-3">
                                <Form.Label>Shop Location *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Dhaka, Mirpur-10"
                                    value={editFormData.shopLocation}
                                    onChange={handleEditInputChange}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Where is your shop located?
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="shopDetails" className="mb-3">
                                <Form.Label>Shop Details *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Describe your shop, what makes it special, your specialties..."
                                    value={editFormData.shopDetails}
                                    onChange={handleEditInputChange}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Tell customers about your shop
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="shopImage" className="mb-3">
                                <Form.Label>Shop Image/Logo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditFileChange}
                                />
                                <Form.Text className="text-muted">
                                    Upload a logo or banner image for your shop
                                </Form.Text>
                                {preview && (
                                    <div className="mt-3">
                                        <img
                                            src={preview}
                                            alt="Shop preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                    </div>
                                )}
                            </Form.Group>

                            <div className="d-grid gap-2 mt-4">
                                <Button variant="primary" type="submit" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
};

export default ShopDetails;

