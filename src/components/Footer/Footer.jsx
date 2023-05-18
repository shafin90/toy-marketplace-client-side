import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';
import logo from '../../../public/image/car_logo_PNG1646-1024x544.png'

const Footer = () => {
    return (
        <footer className="bg-dark text-light px-3 py-5">
            <Container fluid>
                <Container>
                    <Row>
                        <Col xs={12} md={4} className="text-center text-md-start mb-4 mb-md-0">
                            <img src={logo} alt="Website Logo" height="50" />
                            <h5 className="mt-3">Carz</h5>
                            <p>&copy; {new Date().getFullYear()} All rights reserved</p>
                        </Col>
                        <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
                            <h5>Contact Information</h5>
                            <p>Email: info@carztoys.com</p>
                            <p>Phone: +1 123-456-7890</p>
                        </Col>
                        <Col xs={12} md={4} className="text-center text-md-end">
                            <h5 className='mb-2'>Follow Us</h5>
                            <div className='mb-2'>
                                <a href="https://facebook.com/carztoys" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook-f me-3"></i>
                                </a>
                                <a href="https://twitter.com/carztoys" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter me-3"></i>
                                </a>
                                <a href="https://instagram.com/carztoys" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram "></i>
                                </a>
                            </div>
                            <p>123 Street, City, State, Country</p>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </footer>
    );
}

export default Footer;
