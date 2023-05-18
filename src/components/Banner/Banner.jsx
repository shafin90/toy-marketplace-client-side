
import { Container, Row, Col } from 'react-bootstrap';

const Banner = () => {
  return (
    <section className="banner my-5">
      <Container>
        <Row>
          <Col xs={12} md={6} className="text-center text-md-start mb-4 mb-md-0">
            <div className="banner-text">
              <h1>Welcome to Carz </h1>
              <p>Find your dream car at affordable prices. Explore a wide range of sports cars, trucks, sedans, and more. We make car shopping easy and enjoyable.</p>
              <button className="btn btn-primary">Browse Cars</button>
            </div>
          </Col>
          <Col xs={12} md={6} className="text-center">
            <img src="https://purepng.com/public/uploads/large/purepng.com-yellow-audi-caraudicars-961524670899johme.png" alt="Banner Image" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Banner;
