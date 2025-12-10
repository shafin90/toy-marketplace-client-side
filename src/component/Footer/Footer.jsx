import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-custom py-5">
            <Container>
                <Row className="pt-4 pb-3">
                    <Col xs={12} md={4} className="text-center text-md-left mb-4">
                        <div className="footer-logo">
                            <h5>Toy Swap Circle</h5>
                        </div>
                        <p className="footer-tagline">
                            Swap toys, save money, help the planet.
                        </p>
                    </Col>

                    <Col xs={6} md={4} className="text-center mb-4">
                        <h5>Contact Us</h5>
                        <p>Email: hello@toyswap.com</p>
                        <p>Phone: +1 (555) TOY-SWAP</p>
                        <p>Mon-Fri: 9AM - 6PM</p>
                    </Col>

                    <Col xs={6} md={4} className="text-center text-md-right">
                        <h5>Follow Us</h5>
                        <div className="social-links mb-3">
                            <a href="#facebook" className="social-icon facebook">
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="#twitter" className="social-icon twitter">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#instagram" className="social-icon instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                        <p>Join our community!</p>
                    </Col>
                </Row>

                <hr className="footer-divider" />

                <Row>
                    <Col className="text-center">
                        <p className="copyright">
                            &copy; 2024 Toy Swap Circle. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
