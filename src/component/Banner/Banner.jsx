import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
    return (
        <section className="hero-section">
            <Container>
                <Row className="align-items-center min-vh-70">
                    <Col lg={12} className="hero-content">
                        {/* Tagline */}
                        <div className="hero-tagline">
                            <span className="tagline-text">CREDIT-BASED TOY EXCHANGE</span>
                        </div>

                        {/* Main Headline */}
                        <div className="hero-headline-wrapper">
                            <h1 className="hero-headline">
                                <span className="headline-line">STOP</span>
                                <span className="headline-line highlight-line">BUYING</span>
                                <span className="headline-line">START</span>
                                <span className="headline-line highlight-line">SWAPPING</span>
                            </h1>
                        </div>

                        {/* Core Value Proposition */}
                        <div className="hero-motto">
                            <p className="motto-main">Give Your Old Toy</p>
                            <p className="motto-arrow">→</p>
                            <p className="motto-main">Get Credits</p>
                            <p className="motto-arrow">→</p>
                            <p className="motto-main">Take New Toy</p>
                        </div>

                        {/* Description */}
                        <p className="hero-description">
                            A sustainable marketplace where toys find new homes. 
                            Shop owners list products. Users purchase with cash or exchange old toys for discounts. 
                            Every swap reduces waste and saves money.
                        </p>

                        {/* Key Benefits Grid */}
                        <div className="hero-benefits">
                            <div className="benefit-item">
                                <div className="benefit-number">01</div>
                                <div className="benefit-content">
                                    <h3 className="benefit-title">LIST OLD TOYS</h3>
                                    <p className="benefit-text">Earn virtual credits by listing toys you no longer need</p>
                                </div>
                            </div>
                            <div className="benefit-divider"></div>
                            <div className="benefit-item">
                                <div className="benefit-number">02</div>
                                <div className="benefit-content">
                                    <h3 className="benefit-title">SHOP VIRTUALLY</h3>
                                    <p className="benefit-text">Browse toys from local shop owners or community members</p>
                                </div>
                            </div>
                            <div className="benefit-divider"></div>
                            <div className="benefit-item">
                                <div className="benefit-number">03</div>
                                <div className="benefit-content">
                                    <h3 className="benefit-title">EXCHANGE OR BUY</h3>
                                    <p className="benefit-text">Use credits to swap or pay with cash. Get discounts with old toy exchange</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="hero-actions">
                            <Link to="/all_toy">
                                <Button className="btn btn-primary btn-lg hero-cta-primary">
                                    EXPLORE TOYS
                                </Button>
                            </Link>
                            <Link to="/list-old-toy">
                                <Button className="btn btn-outline-primary btn-lg hero-cta-secondary">
                                    LIST YOUR TOY
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">TOYS AVAILABLE</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">200+</div>
                                <div className="stat-label">ACTIVE SHOPS</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">1000+</div>
                                <div className="stat-label">SUCCESSFUL SWAPS</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Banner;
