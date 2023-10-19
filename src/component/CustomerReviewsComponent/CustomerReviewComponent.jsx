import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import './CustomerReviewsComponent.css'; // Import custom CSS

const CustomerReviewsComponent = ({ reviews }) => {
  return (
    <Container fluid >
      <Carousel interval={5000}  >
        {reviews.map((review, index) => (
          <Carousel.Item key={index}  >
            <Row className="review-container justify-content-center align-items-center">
              <Col md={6}>
                <p className="review-text">{review.text}</p>
                <p className="customer-name">{review.name}</p>
                <div className="rating mb-5 ">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <span  key={i} className={i < review.rating ? 'star-filled' : 'star-empty'}>
                        &#9733; {/* Unicode star character */}
                      </span>
                    ))}
                </div>
              </Col>
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default CustomerReviewsComponent;
