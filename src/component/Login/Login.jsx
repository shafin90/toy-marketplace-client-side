import React, { useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';

const LoginComponent = () => {
    // context Api===============
    const {handleGoogle} = useContext(AuthContext);




  const handleEmailLogin = (e) => {
    e.preventDefault();
    // Perform email login logic here
  };

  const handleGoogleLogin = () => {
    // Perform Google login logic here
    handleGoogle();
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form>
            <h2 className="text-center mb-4">Login</h2>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" />
            </Form.Group>
            <p>Dont have account? <Link to={'/register'}>Register</Link></p>

            <Button variant="primary" type="submit" block onClick={handleEmailLogin}>
              Login
            </Button>

            <div className="text-center my-4">OR</div>

            <GoogleButton onClick={handleGoogleLogin} />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComponent;
