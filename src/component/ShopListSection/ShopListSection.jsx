import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import shopAPI from '../../api/shopAPI';
import { getImageUrl } from '../../config/apiConfig';
import { toast } from 'react-hot-toast';

const ShopListSection = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            setLoading(true);
            const data = await shopAPI.getAllShops();
            setShops(data.slice(0, 6)); // Show first 6 shops
        } catch (error) {
            console.error('Error fetching shops:', error);
            toast.error('Failed to load shops');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    if (shops.length === 0) {
        return null;
    }

    return (
        <Container className="my-5 py-5 border-bottom">
            <h1 className="display-4 fw-bold mb-4">Our Shops</h1>
            <Row>
                {shops.map((shop) => (
                    <Col md={6} lg={4} key={shop._id || shop.shopOwnerEmail} className="mb-4">
                        <Card 
                            className="h-100" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/shops/${shop.shopOwnerEmail}`)}
                        >
                            <Card.Img 
                                variant="top" 
                                src={getImageUrl(shop.shopImage || shop.owner?.photoURL)} 
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{shop.shopName || 'Unnamed Shop'}</Card.Title>
                                <Card.Text className="text-muted small">
                                    <strong>Location:</strong> {shop.shopLocation || shop.shopAddress || 'Not specified'}<br />
                                    <strong>Products:</strong> {shop.toyCount || 0} toys
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button 
                                    variant="primary" 
                                    className="w-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/shops/${shop.shopOwnerEmail}`);
                                    }}
                                >
                                    Visit Shop
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-4">
                <Button 
                    variant="outline-primary" 
                    size="lg"
                    onClick={() => navigate('/shops')}
                >
                    View All Shops
                </Button>
            </div>
        </Container>
    );
};

export default ShopListSection;

