import React, { useContext } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import { Toaster, toast } from 'react-hot-toast';
import authAPI from '../../api/authAPI';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const Register = () => {
    // context Api==========
  const {setPhotoUrl,photoUrl, setUser} = useContext(AuthContext);

    const navigate = useNavigate();
  const registerSchema = z.object({
    userRole: z.enum(['user','shop_owner']),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password'),
    photoUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    shopName: z.string().optional(),
    shopAddress: z.string().optional(),
    phone: z.string().optional(),
    terms: z.boolean().refine(val => val === true, { message: 'You must accept terms' })
  }).superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match' });
    }
    if (values.userRole === 'shop_owner') {
      if (!values.shopName) ctx.addIssue({ code: 'custom', path: ['shopName'], message: 'Shop name is required' });
      if (!values.shopAddress) ctx.addIssue({ code: 'custom', path: ['shopAddress'], message: 'Shop address is required' });
      if (!values.phone) ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Phone is required' });
    }
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userRole: 'user',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      photoUrl: '',
      shopName: '',
      shopAddress: '',
      phone: '',
      terms: false
    }
  });

  const userRole = watch('userRole');

  const handleSubmitForm = async (values) => {
    try {
      // Prepare user data for registration
      const userData = {
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`.trim(),
        photoURL: values.photoUrl || '',
        role: values.userRole,
      };

      // Add shop owner specific fields
      if (values.userRole === 'shop_owner') {
        userData.shopName = values.shopName;
        userData.shopAddress = values.shopAddress;
        userData.phone = values.phone;
      }

      // Register user with JWT
      const result = await authAPI.register(userData);
      
      // Store token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      toast.success('Registration successful!');
      
      // Redirect shop owners to shop setup
      if (values.userRole === 'shop_owner') {
        setTimeout(() => {
          navigate('/manage-shop');
        }, 1000);
      } else {
        navigate('/');
      }
      reset();
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
              <Form onSubmit={handleSubmit(handleSubmitForm)}>
                <Form.Group className="mb-3" controlId="formUserRole">
                  <Form.Label><strong>Account Type</strong></Form.Label>
                  <Form.Select {...register('userRole')}>
                    <option value="user">Buyer / User</option>
                    <option value="shop_owner">Shop Owner</option>
                  </Form.Select>
                  {errors.userRole && <div className="text-danger small mt-1">{errors.userRole.message}</div>}
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
                    {...register('firstName')}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your last name" 
                    {...register('lastName')}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email" 
                    {...register('email')}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter your password" 
                    {...register('password')}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirm your password" 
                    {...register('confirmPassword')}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhotoUrl">
                  <Form.Label>Photo URL (Optional)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your photo URL" 
                    {...register('photoUrl')}
                    isInvalid={!!errors.photoUrl}
                  />
                  <Form.Control.Feedback type="invalid">{errors.photoUrl?.message}</Form.Control.Feedback>
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
                      {...register('shopName')}
                      isInvalid={!!errors.shopName}
                      />
                    <Form.Control.Feedback type="invalid">{errors.shopName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formShopAddress">
                      <Form.Label>Shop Address <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Enter your shop address" 
                      {...register('shopAddress')}
                      isInvalid={!!errors.shopAddress}
                      />
                    <Form.Control.Feedback type="invalid">{errors.shopAddress?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="Enter your phone number" 
                      {...register('phone')}
                      isInvalid={!!errors.phone}
                      />
                    <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}

                <Form.Group className='my-3' controlId="formTermsAndPolicy">
                  <Form.Check
                    type="checkbox"
                    label="I agree to the terms and policy"
                    {...register('terms')}
                    isInvalid={!!errors.terms}
                  />
                  {errors.terms && <div className="text-danger small mt-1">{errors.terms.message}</div>}
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
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
