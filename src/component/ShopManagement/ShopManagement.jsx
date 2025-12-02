import { useContext, useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import { toast } from 'react-hot-toast';
import shopAPI from '../../api/shopAPI';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../config/apiConfig';
import './ShopManagement.css';

const ShopManagement = () => {
    const { user, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        shopName: '',
        shopDetails: '',
        shopLocation: '',
        shopImage: null,
        existingImage: ''
    });

    useEffect(() => {
        if (user?.email && userRole === 'shop_owner') {
            fetchShopData();
        }
    }, [user, userRole]);

    const fetchShopData = async () => {
        try {
            setFetching(true);
            const shop = await shopAPI.getShopByOwner(user.email);
            if (shop) {
                setFormData({
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
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                shopImage: file
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user?.email || userRole !== 'shop_owner') {
            toast.error('Only shop owners can manage shops');
            return;
        }

        if (!formData.shopName || formData.shopName.trim() === '') {
            toast.error('Shop name is required');
            return;
        }

        if (!formData.shopLocation || formData.shopLocation.trim() === '') {
            toast.error('Shop location is required');
            return;
        }

        if (!formData.shopDetails || formData.shopDetails.trim() === '') {
            toast.error('Shop details are required');
            return;
        }

        try {
            setLoading(true);

            // Create FormData for multipart/form-data
            const formDataToSend = new FormData();
            formDataToSend.append('shopName', formData.shopName);
            formDataToSend.append('shopDetails', formData.shopDetails);
            formDataToSend.append('shopLocation', formData.shopLocation);
            if (formData.shopImage) {
                formDataToSend.append('shopImage', formData.shopImage);
            } else if (formData.existingImage) {
                formDataToSend.append('shopImage', formData.existingImage);
            }

            await shopAPI.createOrUpdateShop(user.email, formDataToSend);

            toast.success(formData.shopName ? 'Shop updated successfully!' : 'Shop created successfully!');
            
            // Refresh shop data
            await fetchShopData();
            
            setTimeout(() => {
                navigate(`/shops/${user.email}`);
            }, 1500);
        } catch (error) {
            console.error('Error updating shop:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to update shop');
        } finally {
            setLoading(false);
        }
    };

    if (!user || userRole !== 'shop_owner') {
        return (
            <Container className="my-5">
                <PageTitle title="Shop Management" />
                <Card>
                    <Card.Body>
                        <h3>Access Denied</h3>
                        <p>Only shop owners can manage shops.</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (fetching) {
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

    return (
        <Container className="mb-5">
            <PageTitle title="Manage Your Shop" />
            <Card className="p-4">
                <h1 className="h2 my-4 text-center">
                    {formData.shopName ? 'Edit Your Shop' : 'Create Your Shop'}
                </h1>
                <p className="text-center text-muted mb-4">
                    {formData.shopName 
                        ? 'Update your shop information to keep it current'
                        : 'Set up your shop details to attract more customers'}
                </p>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="shopName" className="mb-3">
                                <Form.Label>Shop Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Toy Paradise"
                                    value={formData.shopName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="shopLocation" className="mb-3">
                                <Form.Label>Shop Location *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Dhaka, Mirpur-10"
                                    value={formData.shopLocation}
                                    onChange={handleInputChange}
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
                                    rows={6}
                                    placeholder="Describe your shop, what makes it special, your specialties..."
                                    value={formData.shopDetails}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Tell customers about your shop
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="shopImage" className="mb-3">
                                <Form.Label>Shop Image/Logo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
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
                                                maxHeight: '300px',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid gap-2 mt-4">
                        <Button variant="primary" type="submit" size="lg" disabled={loading}>
                            {loading ? 'Saving...' : (formData.shopName ? 'Update Shop' : 'Create Shop')}
                        </Button>
                        {formData.shopName && (
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => navigate(`/shops/${user.email}`)}
                            >
                                View Shop
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default ShopManagement;

