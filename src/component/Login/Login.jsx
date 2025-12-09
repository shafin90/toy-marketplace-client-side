import  { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import authAPI from '../../api/authAPI';
import userAPI from '../../api/userAPI';
import { toast } from 'react-hot-toast';

const Login = () => {
    // Context API======================
    const { setUser, location, setLocation } = useContext(AuthContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(''); // For display purposes
    const [userData, setUserData] = useState(null);


    const fetchUserRole = async (userEmail) => {
        try {
            const data = await userAPI.getUserByEmail(userEmail);
            if (data) {
                setUserData(data);
                setSelectedRole(data.role || 'user');
                return data.role || 'user';
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
        return 'user';
    };


    const handleEmailChange = async (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        
        // Fetch user role when email is entered (optional - for preview)
        if (emailValue && emailValue.includes('@')) {
            try {
                const data = await userAPI.getUserByEmail(emailValue);
                if (data) {
                    setUserData(data);
                    setSelectedRole(data.role || 'user');
                } else {
                    setUserData(null);
                    setSelectedRole('');
                }
            } catch (error) {
                // User doesn't exist yet, that's okay
                setUserData(null);
                setSelectedRole('');
            }
        } else {
            setUserData(null);
            setSelectedRole('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };



    const handleEmailLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }
        
        try {
            const result = await authAPI.login(email, password);
            
            // Store token and user data
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Update context
            setUser(result.user);
            
            // Fetch full user data including role
            let userRole = 'user';
            try {
                const fullUserData = await userAPI.getUserByEmail(result.user.email);
                if (fullUserData) {
                    setUserData(fullUserData);
                    userRole = fullUserData.role || 'user';
                    setSelectedRole(userRole);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
            
            toast.success('Login successful!');
            
            // Redirect shop owners to their shop page immediately
            if (userRole === 'shop_owner') {
                setTimeout(() => {
                    navigate(`/shops/${result.user.email}`);
                }, 500);
                return;
            }
            
            // Validate and navigate to saved location or home for regular users
            if (location && location.startsWith('/')) {
                // Only navigate to valid routes
                const validRoutes = ['/view_details/', '/profile', '/toy_table', '/all_toy', '/list-old-toy', '/list-shop-toy', '/shop-dashboard', '/analytics'];
                const isValidRoute = validRoutes.some(route => location.startsWith(route)) || location === '/';
                
                if (isValidRoute) {
                    navigate(location);
                } else {
                    navigate('/');
                }
                setLocation('');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
        }
    };








    return (
        <Container>
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} sm={8} md={6} lg={5}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Login</h2>

                            {userData && selectedRole && (
                                <div className="mb-3 p-3 bg-light rounded">
                                    <p className="mb-1"><strong>Account Type:</strong></p>
                                    <Badge bg={selectedRole === 'shop_owner' ? 'success' : 'primary'} className="fs-6">
                                        {selectedRole === 'shop_owner' ? 'Shop Owner' : 'Buyer / User'}
                                    </Badge>
                                    {userData.shopName && (
                                        <p className="mt-2 mb-0"><small>Shop: {userData.shopName}</small></p>
                                    )}
                                </div>
                            )}

                            <Form>
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
                                    />
                                </Form.Group>

                                <p className='mt-2 mb-3'>
                                    Don't have an account? <Link className='text-decoration-none' to={'/register'}>Register</Link>
                                </p>

                                <div className="d-grid mb-3">
                                    <Button variant="primary" type="submit" size="lg" onClick={handleEmailLogin}>
                                        Login
                                    </Button>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
