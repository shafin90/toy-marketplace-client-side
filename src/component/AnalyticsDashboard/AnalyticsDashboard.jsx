import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import analyticsAPI from '../../api/analyticsAPI';
import { toast } from 'react-hot-toast';

const AnalyticsDashboard = () => {
    const { user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email && user?.role === 'shop_owner') {
            fetchAnalytics();
        }
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await analyticsAPI.getShopAnalytics(user.email);
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'shop_owner') {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <p className="text-danger">Access denied. Shop owner access required.</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container>
                <p>Loading analytics...</p>
            </Container>
        );
    }

    if (!analytics) {
        return (
            <Container>
                <p>No analytics data available.</p>
            </Container>
        );
    }

    return (
        <Container>
            <PageTitle title="Analytics Dashboard" />
            
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h3 className="text-primary">{analytics.totalToysListed}</h3>
                            <p className="text-muted mb-0">Total Toys Listed</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h3 className="text-success">{analytics.soldToys}</h3>
                            <p className="text-muted mb-0">Sold Toys</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h3 className="text-info">{analytics.availableToys}</h3>
                            <p className="text-muted mb-0">Available Toys</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h3 className="text-warning">{analytics.averageRating.toFixed(1)}</h3>
                            <p className="text-muted mb-0">Average Rating ({analytics.totalReviews} reviews)</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h5>Revenue Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Coin Revenue:</strong> {analytics.totalCoinRevenue} coins</p>
                            <p><strong>Money Revenue:</strong> ৳ {analytics.totalMoneyRevenue}</p>
                            <hr />
                            <h4 className="text-success">Total: ৳ {analytics.totalRevenue}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h5>Popular Toys</h5>
                        </Card.Header>
                        <Card.Body>
                            {analytics.popularToys && analytics.popularToys.length > 0 ? (
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Toy Name</th>
                                            <th>Sales Count</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.popularToys.map((toy, idx) => (
                                            <tr key={idx}>
                                                <td>{toy.name}</td>
                                                <td><Badge bg="success">{toy.salesCount}</Badge></td>
                                                <td>৳ {toy.price || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted">No sales data yet.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h5>Recent Sales</h5>
                        </Card.Header>
                        <Card.Body>
                            {analytics.recentSales && analytics.recentSales.length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Amount</th>
                                            <th>Currency</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.recentSales.map((sale, idx) => (
                                            <tr key={idx}>
                                                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                                                <td>{sale.description}</td>
                                                <td>{sale.amount}</td>
                                                <td>
                                                    <Badge bg={sale.currency === 'coins' ? 'info' : 'success'}>
                                                        {sale.currency === 'coins' ? 'Coins' : '৳ Money'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted">No recent sales.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AnalyticsDashboard;

