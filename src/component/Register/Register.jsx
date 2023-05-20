import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handlePhotoUrlChange = (e) => {
    setPhotoUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform registration logic here
  };

  return (
    <Container className='py-5'>
      <h1 className='text-center my-5'>Registration Form</h1>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your first name" value={firstName} onChange={handleFirstNameChange} />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your last name" value={lastName} onChange={handleLastNameChange} />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm your password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            </Form.Group>

            <Form.Group controlId="formPhotoUrl">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control type="text" placeholder="Enter your photo URL" value={photoUrl} onChange={handlePhotoUrlChange} />
            </Form.Group>

            <Form.Group className='my-2' controlId="formTermsAndPolicy">
              <Form.Check
                type="checkbox"
                label="I agree to the terms and policy"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={!isChecked}>
              Register
            </Button>
            <p className='mt-4'>Already have an account? <Link to={'/login'}>Login</Link></p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
