import { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';

const ShopOwnerHome = () => {
    const { user, userRole } = useContext(AuthContext);
    const navigate = useNavigate();

    if (userRole !== 'shop_owner') {
        return null; // This component is only for shop owners
    }

    return (
        <Container className="py-5">
            <PageTitle title="Shop Owner Dashboard" />
            
            <Row className="mb-4">
                <Col>
                    <Card className="text-center bg-primary text-white">
                        <Card.Body>
                            <h2>Welcome, {user?.name || 'Shop Owner'}</h2>
                            <p className="lead">Manage your toy shop and grow your business</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>List New Toys</h5>
                            <p className="text-muted">Add toys to your shop inventory</p>
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/list-shop-toy')}
                                className="w-100"
                            >
                                List Shop Toy
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>Manage Shop</h5>
                            <p className="text-muted">Set up your shop name, location, and details</p>
                            <Button 
                                variant="info" 
                                onClick={() => navigate('/manage-shop')}
                                className="w-100"
                            >
                                Manage Shop
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>Shop Dashboard</h5>
                            <p className="text-muted">View products, sales, and exchange requests</p>
                            <Button 
                                variant="success" 
                                onClick={() => navigate('/shop-dashboard')}
                                className="w-100"
                            >
                                Go to Dashboard
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5>Quick Stats</h5>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Account Type:</strong> Shop Owner</p>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => navigate('/profile')}
                                className="mt-2"
                            >
                                View Full Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5>Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button 
                                    variant="outline-primary" 
                                    onClick={() => navigate('/toy_table')}
                                >
                                    View My Toys
                                </Button>
                                <Button 
                                    variant="outline-success" 
                                    onClick={() => navigate('/all_toy')}
                                >
                                    Browse Marketplace
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ShopOwnerHome;

