import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const HowItWorks = () => {
    const steps = [
        {
            icon: "fa-box-open",
            title: "1. List Your Toys",
            description: "Upload photos of toys you don't play with anymore. It's easy and fast!"
        },
        {
            icon: "fa-coins",
            title: "2. Earn Credits",
            description: "Get virtual credits when someone swaps for your toy. No cash needed!"
        },
        {
            icon: "fa-sync-alt",
            title: "3. Swap for New Fun",
            description: "Use your credits to get 'new' toys from other kids. Keep the fun going!"
        }
    ];

    return (
        <Container className="my-5 py-5">
            <div className="text-center mb-5">
                <h2 className="display-5 fw-bold text-primary">How Toy Swap Works 🔄</h2>
                <p className="lead text-muted">Join the circle in 3 simple steps</p>
            </div>
            <Row>
                {steps.map((step, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card className="h-100 text-center border-0 shadow-sm py-4" style={{ borderRadius: '30px', backgroundColor: '#fff' }}>
                            <Card.Body>
                                <div className="mb-4">
                                    <i className={`fas ${step.icon} fa-4x text-secondary`}></i>
                                </div>
                                <h3 className="h4 fw-bold mb-3">{step.title}</h3>
                                <p className="text-muted">{step.description}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HowItWorks;
