import { Container, Row, Col, Card } from 'react-bootstrap';
import './OurGoal.css';

const OurGoal = () => {
    return (
        <Container className="my-5 py-5">
            <Row>
                <Col>
                    <h1 className="display-4 fw-bold mb-5 text-center">Our Goal</h1>
                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="h-100 border-0 shadow-sm our-goal-card">
                                <Card.Body className="text-center p-4">
                                    <div className="mb-3">
                                        <h2 className="mb-0">RECYCLE</h2>
                                    </div>
                                    <h4 className="mb-3">Sustainable Shopping</h4>
                                    <p className="text-muted">
                                        Promote eco-friendly practices by encouraging toy exchange and reducing waste in the toy industry.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 border-0 shadow-sm our-goal-card">
                                <Card.Body className="text-center p-4">
                                    <div className="mb-3">
                                        <h2 className="mb-0">HANDSHAKE</h2>
                                    </div>
                                    <h4 className="mb-3">Support Local Shops</h4>
                                    <p className="text-muted">
                                        Help local toy shop owners grow their business and connect with customers in the community.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 border-0 shadow-sm our-goal-card">
                                <Card.Body className="text-center p-4">
                                    <div className="mb-3">
                                        <h2 className="mb-0">SMILE</h2>
                                    </div>
                                    <h4 className="mb-3">Happy Families</h4>
                                    <p className="text-muted">
                                        Make quality toys accessible to all families through affordable prices and exchange options.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default OurGoal;

