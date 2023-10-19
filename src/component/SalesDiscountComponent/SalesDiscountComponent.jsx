import React from 'react';
import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';

const SalesDiscountComponent = ({ items }) => {
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <Carousel>
        {items.map((item, index) => (
          <Carousel.Item key={index}>
            <div
              style={{ backgroundImage: `url(${item.backgroundImage})`, backgroundSize: 'cover', filter: 'brightness(0.6)', height: '30vw' }}
            >
              <Container>
                <Row>
                  <Col sm={6}>
                    <Image src={item.productImage} fluid />
                  </Col>
                  <Col sm={6} className=' d-flex flex-column   justify-content-center align-content-center '>
                    <h2>{item.productName}</h2>
                    <p className=' display-2 fw-bold  '>{item.offer}</p>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default SalesDiscountComponent;
