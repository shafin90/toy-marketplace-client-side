import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
    return (
        <section className="hero-section">
            <Container>
                <Row className="align-items-center min-vh-70">
                    {/* Left Content */}
                    <Col lg={6} className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-icon">🎉</span>
                            <span className="badge-text">Join the Swap Circle</span>
                        </div>

                        <h1 className="hero-title">
                            Give a Toy,<br />
                            <span className="highlight">Get a Toy</span>
                        </h1>

                        <p className="hero-subtitle">
                            Stop buying. Start swapping. Save money, reduce waste, and give your kids endless joy with our credit-based toy exchange.
                        </p>

                        <div className="hero-features">
                            <div className="feature-item">
                                <span className="feature-icon">💎</span>
                                <div className="feature-text">
                                    <strong>Earn Credits</strong>
                                    <p>List your toys to earn swap credits</p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <span className="feature-icon">🔄</span>
                                <div className="feature-text">
                                    <strong>Swap Freely</strong>
                                    <p>Use credits to get new toys for your kids</p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <span className="feature-icon">🌍</span>
                                <div className="feature-text">
                                    <strong>Save Planet</strong>
                                    <p>Reduce waste and help the environment</p>
                                </div>
                            </div>
                        </div>

                        <div className="hero-actions">
                            <Link to="/all-toys">
                                <Button className="btn btn-primary btn-lg">
                                    Browse Toys 🚗
                                </Button>
                            </Link>
                            <Link to="/add-toy">
                                <Button className="btn btn-outline-primary btn-lg">
                                    List Your Toy
                                </Button>
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Toys Available</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">200+</div>
                                <div className="stat-label">Happy Families</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">1000+</div>
                                <div className="stat-label">Swaps Made</div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Image */}
                    <Col lg={6} className="hero-image-col">
                        <div className="hero-image-wrapper">
                            <div className="image-decoration decoration-1"></div>
                            <div className="image-decoration decoration-2"></div>
                            <img
                                src="https://clipartmag.com/images/cartoon-images-of-cars-39.png"
                                alt="Toy Car"
                                className="hero-image"
                            />
                            <div className="floating-badge badge-1">
                                <span className="emoji">🎈</span>
                            </div>
                            <div className="floating-badge badge-2">
                                <span className="emoji">⭐</span>
                            </div>
                            <div className="floating-badge badge-3">
                                <span className="emoji">🎁</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Banner;
