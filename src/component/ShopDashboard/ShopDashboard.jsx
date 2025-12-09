import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Table, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import toyAPI from '../../api/toyAPI';
import exchangeAPI from '../../api/exchangeAPI';
import analyticsAPI from '../../api/analyticsAPI';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import './ShopDashboard.css';

const ShopDashboard = () => {
    const { user, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [myToys, setMyToys] = useState([]);
    const [exchangeRequests, setExchangeRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exchangeLoading, setExchangeLoading] = useState(true);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [selectedExchange, setSelectedExchange] = useState(null);
    const [discounts, setDiscounts] = useState({});

    useEffect(() => {
        if (user?.email) {
            fetchDashboardData();
            fetchExchangeRequests();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [analyticsData, toysData] = await Promise.all([
                analyticsAPI.getShopAnalytics(user.email),
                toyAPI.getToysByEmail(user.email)
            ]);
            setAnalytics(analyticsData);
            setMyToys(toysData.filter(t => t.type === 'shop_toy'));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchExchangeRequests = async () => {
        try {
            setExchangeLoading(true);
            const requests = await exchangeAPI.getShopOwnerExchangeRequests();
            setExchangeRequests(requests);
        } catch (error) {
            console.error('Error fetching exchange requests:', error);
            toast.error('Failed to load exchange requests');
        } finally {
            setExchangeLoading(false);
        }
    };

    const handleDiscountChange = (oldToyId, value) => {
        setDiscounts(prev => ({
            ...prev,
            [oldToyId]: parseFloat(value) || 0
        }));
    };

    const handleSetDiscounts = async () => {
        if (!selectedExchange) return;

        try {
            // Convert discounts object to array format expected by backend
            const discountsArray = Object.keys(discounts).map(oldToyId => ({
                oldToyId: oldToyId,
                discountAmount: discounts[oldToyId] || 0
            }));
            
            await exchangeAPI.setDiscounts(selectedExchange._id, discountsArray);
            toast.success('Discounts set and offer sent to user!');
            setShowDiscountModal(false);
            setSelectedExchange(null);
            setDiscounts({});
            fetchExchangeRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to set discounts.');
        }
    };

    if (!user || userRole !== 'shop_owner') {
        return (
            <Container className="my-5">
                <PageTitle title="Shop Dashboard" />
                <Card>
                    <Card.Body>
                        <h3>Access Denied</h3>
                        <p>You need to be a shop owner to access this page.</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    const pendingExchangeCount = exchangeRequests.filter(r => 
        r.status === 'pending_shop_owner' || r.status === 'price_set'
    ).length;

    return (
        <Container fluid className="my-4">
            <PageTitle title="Shop Dashboard" />
            
            {/* Welcome Section */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-1">Welcome back, {user.displayName || user.name || 'Shop Owner'}!</h3>
                                    <p className="text-muted mb-0">Manage your shop, products, and orders from here</p>
                                </div>
                                <Button variant="primary" onClick={() => navigate('/list-shop-toy')}>
                                    <i className="fas fa-plus me-2"></i>Add New Product
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="mb-4 g-3">
                <Col xs={12} sm={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 stats-card stats-card-primary">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 small">Total Products</p>
                                    <h2 className="mb-0 fw-bold">{analytics?.totalToysListed || 0}</h2>
                                </div>
                                <div className="stats-icon">
                                    <i className="fas fa-box fa-2x text-dark opacity-25"></i>
                                </div>
                            </div>
                            <small className="text-muted">
                                {analytics?.availableToys || 0} available, {analytics?.soldToys || 0} sold
                            </small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 stats-card stats-card-success">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 small">Total Sales</p>
                                    <h2 className="mb-0 fw-bold">{analytics?.salesCount || 0}</h2>
                                </div>
                                <div className="stats-icon">
                                    <i className="fas fa-shopping-cart fa-2x text-dark opacity-25"></i>
                                </div>
                            </div>
                            <small className="text-muted">All time sales</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 stats-card stats-card-info">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 small">Total Revenue</p>
                                    <h2 className="mb-0 fw-bold">৳ {analytics?.totalRevenue?.toLocaleString() || 0}</h2>
                                </div>
                                <div className="stats-icon">
                                    <i className="fas fa-dollar-sign fa-2x text-dark opacity-25"></i>
                                </div>
                            </div>
                            <small className="text-muted">Total earnings</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 stats-card stats-card-warning">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 small">Average Rating</p>
                                    <h2 className="mb-0 fw-bold">
                                        {analytics?.averageRating ? analytics.averageRating.toFixed(1) : '0.0'}
                                    </h2>
                                </div>
                                <div className="stats-icon">
                                    <i className="fas fa-star fa-2x text-dark opacity-25"></i>
                                </div>
                            </div>
                            <small className="text-muted">{analytics?.totalReviews || 0} reviews</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Main Content Tabs */}
            <Row>
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <Tabs defaultActiveKey="products" id="shop-dashboard-tabs" className="px-3 pt-3">
                                {/* Products Tab */}
                                <Tab eventKey="products" title={
                                    <span>
                                        <i className="fas fa-box me-2"></i>Products ({myToys.length})
                                    </span>
                                }>
                                    <div className="p-4">
                                        {myToys.length === 0 ? (
                                            <div className="text-center py-5">
                                                <i className="fas fa-box fa-3x text-muted mb-3"></i>
                                                <p className="text-muted">No products listed yet</p>
                                                <Button variant="primary" onClick={() => navigate('/list-shop-toy')}>
                                                    Add Your First Product
                                                </Button>
                                            </div>
                                        ) : (
                                            <Row>
                                                {myToys.map((toy) => (
                                                    <Col md={6} lg={4} key={toy._id} className="mb-3">
                                                        <Card className="h-100 product-card">
                                                            <Card.Img 
                                                                variant="top" 
                                                                src={getImageUrl(toy.picture || toy.images?.[0])} 
                                                                style={{ height: '200px', objectFit: 'cover' }}
                                                            />
                                                            <Card.Body>
                                                                <Card.Title className="h6">{toy.name}</Card.Title>
                                                                <div className="mb-2">
                                                                    <Badge bg={toy.status === 'available' ? 'dark' : 'secondary'} className="me-2">
                                                                        {toy.status}
                                                                    </Badge>
                                                                    {toy.allowOldToyExchange && (
                                                                        <Badge bg="dark">Exchangeable</Badge>
                                                                    )}
                                                                </div>
                                                                <p className="mb-2">
                                                                    <strong>৳ {toy.price || 0}</strong>
                                                                    <small className="text-muted ms-2">
                                                                        Qty: {toy.available_quantity || toy.quantity || 0}
                                                                    </small>
                                                                </p>
                                                                <Button 
                                                                    variant="outline-primary" 
                                                                    size="sm" 
                                                                    className="w-100"
                                                                    onClick={() => navigate(`/view_details/${toy._id}`)}
                                                                >
                                                                    View Details
                                                                </Button>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        )}
                                    </div>
                                </Tab>

                                {/* Exchange Requests Tab */}
                                <Tab eventKey="exchanges" title={
                                    <span>
                                        <i className="fas fa-exchange-alt me-2"></i>Exchange Requests
                                        {pendingExchangeCount > 0 && (
                                            <Badge bg="dark" className="ms-2">{pendingExchangeCount}</Badge>
                                        )}
                                    </span>
                                }>
                                    <div className="p-4">
                                        {exchangeLoading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : exchangeRequests.length === 0 ? (
                                            <div className="text-center py-5">
                                                <i className="fas fa-exchange-alt fa-3x text-muted mb-3"></i>
                                                <p className="text-muted">No exchange requests yet</p>
                                            </div>
                                        ) : (
                                            <Table striped bordered hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Customer</th>
                                                        <th>Old Toys</th>
                                                        <th>Original Price</th>
                                                        <th>Final Price</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {exchangeRequests.map((request) => (
                                                        <tr key={request._id}>
                                                            <td>
                                                                <strong>{request.product?.name || 'N/A'}</strong>
                                                            </td>
                                                            <td>{request.userId}</td>
                                                            <td>
                                                                <Badge bg="dark">{request.oldToys?.length || 0} toys</Badge>
                                                            </td>
                                                            <td>৳ {request.originalPrice || 0}</td>
                                                            <td>
                                                                {request.status === 'price_set' || request.status === 'user_accepted' || request.status === 'delivered' ? (
                                                                    <span className="text-dark fw-bold">৳ {request.finalPrice || 0}</span>
                                                                ) : (
                                                                    <span className="text-muted">-</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Badge bg={
                                                                    request.status === 'pending_shop_owner' ? 'secondary' :
                                                                    request.status === 'price_set' ? 'dark' :
                                                                    request.status === 'user_accepted' ? 'dark' :
                                                                    request.status === 'user_rejected' ? 'dark' :
                                                                    request.status === 'delivered' ? 'dark' :
                                                                    'secondary'
                                                                }>
                                                                    {request.status.replace(/_/g, ' ')}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                {request.status === 'pending_shop_owner' && (
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setSelectedExchange(request);
                                                                            const initialDiscounts = {};
                                                                            request.oldToys?.forEach(ot => {
                                                                                initialDiscounts[ot.oldToyId] = ot.discountAmount || 0;
                                                                            });
                                                                            setDiscounts(initialDiscounts);
                                                                            setShowDiscountModal(true);
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-tags me-1"></i>Set Discounts
                                                                    </Button>
                                                                )}
                                                                {request.status === 'user_accepted' && (
                                                                    <Button
                                                                        variant="dark"
                                                                        size="sm"
                                                                        onClick={async () => {
                                                                            try {
                                                                                await exchangeAPI.confirmExchange(request._id);
                                                                                toast.success('Exchange confirmed! Delivery arranged.');
                                                                                fetchExchangeRequests();
                                                                            } catch (error) {
                                                                                toast.error(error.response?.data?.message || 'Failed to confirm exchange');
                                                                            }
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-check me-1"></i>Confirm Delivery
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </Tab>

                                {/* Recent Sales Tab */}
                                <Tab eventKey="sales" title={
                                    <span>
                                        <i className="fas fa-chart-line me-2"></i>Recent Sales
                                    </span>
                                }>
                                    <div className="p-4">
                                        {analytics?.recentSales?.length === 0 ? (
                                            <div className="text-center py-5">
                                                <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                                                <p className="text-muted">No sales yet</p>
                                            </div>
                                        ) : (
                                            <ListGroup variant="flush">
                                                {analytics?.recentSales?.map((sale, index) => (
                                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <strong>{sale.description || 'Sale'}</strong>
                                                            <br />
                                                            <small className="text-muted">
                                                                {new Date(sale.createdAt).toLocaleString()}
                                                            </small>
                                                        </div>
                                                        <Badge bg="success" className="fs-6">
                                                            ৳ {sale.amount?.toLocaleString() || 0}
                                                        </Badge>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Set Discounts Modal */}
            <Modal show={showDiscountModal} onHide={() => setShowDiscountModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Set Discount Prices for Old Toys</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedExchange && (
                        <>
                            <div className="mb-3 p-3 bg-light rounded">
                                <p className="mb-1"><strong>Product:</strong> {selectedExchange.product?.name}</p>
                                <p className="mb-1"><strong>Customer:</strong> {selectedExchange.userId}</p>
                                <p className="mb-0"><strong>Original Price:</strong> ৳ {selectedExchange.originalPrice}</p>
                            </div>
                            <hr />
                            <h6 className="mb-3">Set Discount for Each Old Toy:</h6>
                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th>Toy Name</th>
                                        <th>Discount Amount (৳)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedExchange.oldToys?.map((oldToy, index) => (
                                        <tr key={index}>
                                            <td>{oldToy.oldToyName}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    max={selectedExchange.originalPrice}
                                                    value={discounts[oldToy.oldToyId] || 0}
                                                    onChange={(e) => handleDiscountChange(oldToy.oldToyId, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="alert alert-info mt-3">
                                <strong>Total Discount:</strong> ৳ {
                                    Object.values(discounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                                }<br />
                                <strong>Final Price:</strong> ৳ {
                                    Math.max(0, selectedExchange.originalPrice - Object.values(discounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0))
                                }
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDiscountModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSetDiscounts}>
                        <i className="fas fa-paper-plane me-2"></i>Send Offer to Customer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ShopDashboard;
