import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';

const Banner = () => {
  
  
  return (
    
    <div className="banner my-5">
      <Container className='py-5 border-bottom'>
        <Row>
          {/* Left part with text */}
          <Col md={6} className="text-start text-md-left">
            <div className="banner-text">
              <h1>Find Your Perfect Ride</h1>
              <p>Discover a wide selection of high-quality cars at competitive prices. Whether you're searching for a luxury sedan, a reliable SUV, or a sporty convertible, our car marketplace has the right vehicle for you.</p>
              <button className="btn btn-primary">Learn More</button>
            </div>
          </Col>

          {/* Right part with image */}
          <Col md={6} className="text-center">
            <img src="https://pluspng.com/img-png/png-toy-car-img-830.png" alt="Banner Image" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Banner;
