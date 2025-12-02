import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import { Toaster, toast } from 'react-hot-toast';
import authAPI from '../../api/authAPI';


const Register = () => {
    // context Api==========
    const {setPhotoUrl,photoUrl, setUser} = useContext(AuthContext);

    const navigate = useNavigate();
    





  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState('user'); // 'user' or 'shop_owner'
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [phone, setPhone] = useState('');
 

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

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  const handleShopNameChange = (e) => {
    setShopName(e.target.value);
  };

  const handleShopAddressChange = (e) => {
    setShopAddress(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (userRole === 'shop_owner') {
      if (!shopName || !shopAddress || !phone) {
        toast.error('Please fill in all shop owner fields!');
        return;
      }
    }

    try {
      // Prepare user data for registration
      const userData = {
        email: email,
        password: password,
        name: `${firstName} ${lastName}`.trim(),
        photoURL: photoUrl || '',
        role: userRole,
      };

      // Add shop owner specific fields
      if (userRole === 'shop_owner') {
        userData.shopName = shopName;
        userData.shopAddress = shopAddress;
        userData.phone = phone;
      }

      // Register user with JWT
      const result = await authAPI.register(userData);
      
      // Store token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      toast.success('Registration successful!');
      
      // Redirect shop owners to shop setup
      if (userRole === 'shop_owner') {
        setTimeout(() => {
          navigate('/manage-shop');
        }, 1000);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container className='py-5'>
      <h1 className='text-center my-5'>Registration Form</h1>
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUserRole">
                  <Form.Label><strong>Account Type</strong></Form.Label>
                  <Form.Select value={userRole} onChange={handleRoleChange}>
                    <option value="user">Buyer / User</option>
                    <option value="shop_owner">Shop Owner</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {userRole === 'user' 
                      ? 'As a buyer, you can purchase toys and list old toys to earn coins.'
                      : 'As a shop owner, you can list toys for sale and approve old toys from users.'}
                  </Form.Text>
                </Form.Group>

                <hr />

                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your first name" 
                    value={firstName} 
                    onChange={handleFirstNameChange} 
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your last name" 
                    value={lastName} 
                    onChange={handleLastNameChange} 
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={handleEmailChange} 
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                    required
                    minLength={6}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={confirmPassword} 
                    onChange={handleConfirmPasswordChange} 
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhotoUrl">
                  <Form.Label>Photo URL (Optional)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your photo URL" 
                    value={photoUrl} 
                    onChange={handlePhotoUrlChange} 
                  />
                </Form.Group>

                {userRole === 'shop_owner' && (
                  <>
                    <hr />
                    <h5 className="mb-3">Shop Information</h5>
                    <Form.Group className="mb-3" controlId="formShopName">
                      <Form.Label>Shop Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your shop name" 
                        value={shopName} 
                        onChange={handleShopNameChange} 
                        required={userRole === 'shop_owner'}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formShopAddress">
                      <Form.Label>Shop Address <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Enter your shop address" 
                        value={shopAddress} 
                        onChange={handleShopAddressChange} 
                        required={userRole === 'shop_owner'}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        value={phone} 
                        onChange={handlePhoneChange} 
                        required={userRole === 'shop_owner'}
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Group className='my-3' controlId="formTermsAndPolicy">
                  <Form.Check
                    type="checkbox"
                    label="I agree to the terms and policy"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg" disabled={!isChecked}>
                    Register as {userRole === 'user' ? 'Buyer' : 'Shop Owner'}
                  </Button>
                </div>
                <p className='mt-4 text-center'>Already have an account? <Link to={'/login'}>Login</Link></p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster />
    </Container>
  );
};

export default Register;
