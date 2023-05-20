import {  Button, Container, Row, Col, Image } from 'react-bootstrap';
import { useLoaderData, useNavigate } from 'react-router-dom';

const ViewDetails = () => {
    
    const carData = useLoaderData();


    const navigate = useNavigate();

    const handleGoBack = () => {
      navigate(-1);
    };
  
    
    const { picture, name, seller_name, seller_email, price, ratings, available_quantity, detail_description, sub_category } = carData;
  


    
    return (
        <Container>
        <Row className="my-4">
          <Col sm={6}>
            <Image src={picture} fluid />
          </Col>
          <Col sm={6}>
            <h2>{name}</h2>
            <p className="text-muted">Category: {sub_category}</p>
            <p>{detail_description}</p>
            <p>
              <strong>Seller: </strong>
              {seller_name}
            </p>
            <p>
              <strong>Seller Email: </strong>
              {seller_email}
            </p>
            <p>
              <strong>Ratings: </strong>
              {ratings}
            </p>
            <p>
              <strong>Available Quantity: </strong>
              {available_quantity}
            </p>
            <p>
              <strong>Price: </strong>
              <del className="text-muted">${price}</del>
            </p>
            <Button onClick={handleGoBack} variant="primary">Go Back</Button>
          </Col>
        </Row>
      </Container>
    );
  };

export default ViewDetails;