import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Banner = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="banner my-5">
      <Container className='py-5 border-bottom'>
        <Row>
          {/* Left part with text */}
          <Col md={6} className="text-start text-md-left">
            <div className="banner-text">
              <h1 data-aos="fade-right">Find Your Perfect Ride</h1>
              <p data-aos="fade-right">Discover a wide selection of high-quality cars at competitive prices. Whether you're searching for a luxury sedan, a reliable SUV, or a sporty convertible, our car marketplace has the right vehicle for you.</p>
             
            </div>
          </Col>

          {/* Right part with image */}
          <Col md={6} className="text-center">
            <img src="https://pluspng.com/img-png/png-toy-car-img-830.png" alt="Banner Image" className="img-fluid" data-aos="fade-left" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Banner;
