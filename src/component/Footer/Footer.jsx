
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';


const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row className="pt-4 pb-3">
          <Col xs={12} md={4} className="text-center text-md-left mb-4">
            <img src="http://clipart-library.com/images_k/car-transparent-background/car-transparent-background-22.png" alt="Website Logo" height="40" className="mb-3" />
            <p>&copy; {new Date().getFullYear()} Website Name. All rights reserved.</p>
          </Col>
          <Col xs={6} md={4} className="text-center mb-4">
            <h5>Contact Information</h5>
            <p>Email: info@example.com</p>
            <p>Phone: 123-456-7890</p>
          </Col>
          <Col xs={6} md={4} className="text-center text-md-right">
            <h5>Follow Us</h5>
            <div className="social-media-links">
              <a href="#facebook" className="social-media-link"><i className="fab fa-facebook me-3"></i></a>
              <a href="#twitter" className="social-media-link"><i className="fab fa-twitter me-3"></i></a>
              <a href="#instagram" className="social-media-link"><i className="fab fa-instagram"></i></a>
            </div>
            <p>123 Main St, City, Country</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
