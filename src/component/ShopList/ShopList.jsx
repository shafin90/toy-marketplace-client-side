import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import shopAPI from '../../api/shopAPI';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../config/apiConfig';
import PageTitle from '../PageTitle/PageTitle';
import './ShopList.css';

const ShopList = () => {
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
            setShops(data);
        } catch (error) {
            console.error('Error fetching shops:', error);
            toast.error('Failed to load shops');
        } finally {
            setLoading(false);
        }
    };

    const handleShopClick = (shopOwnerEmail) => {
        navigate(`/shops/${shopOwnerEmail}`);
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

    return (
        <Container className="my-5">
            <PageTitle title="All Shops" />
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center mb-4">Browse Shops</h2>
                    <p className="text-center text-muted">
                        Discover toys from different shops. Click on a shop to view details and products.
                    </p>
                </Col>
            </Row>

            {shops.length === 0 ? (
                <Row>
                    <Col>
                        <Card className="text-center p-5">
                            <Card.Body>
                                <h4>No shops available</h4>
                                <p className="text-muted">Check back later for new shops.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Row>
                    {shops.map((shop) => (
                        <Col md={6} lg={4} key={shop._id || shop.shopOwnerEmail} className="mb-4">
                            <Card 
                                className="h-100 shop-card" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleShopClick(shop.shopOwnerEmail)}
                            >
                                {shop.shopImage && (
                                    <Card.Img 
                                        variant="top" 
                                        src={getImageUrl(shop.shopImage)} 
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{shop.shopName || 'Unnamed Shop'}</Card.Title>
                                    <Card.Text>
                                        <small className="text-muted">
                                            <strong>Owner:</strong> {shop.owner?.name || shop.owner?.email || 'N/A'}<br />
                                            <strong>Location:</strong> {shop.shopAddress || 'Not specified'}<br />
                                            <strong>Products:</strong> {shop.toyCount || 0} toys
                                        </small>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button 
                                        variant="primary" 
                                        className="w-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShopClick(shop.shopOwnerEmail);
                                        }}
                                    >
                                        View Shop
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ShopList;

