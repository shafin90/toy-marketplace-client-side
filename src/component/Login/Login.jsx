import  { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();

const Login = () => {
    // Context API======================
    const { auth, setUser,location,setLocation } = useContext(AuthContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleGoogleLogin = () => {
        // Perform Google login logic here
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result)
                if(location){
                    navigate(location);
                    setLocation('');


                }
                else{
                    navigate('/');
                }
            }).catch((error) => {
                console.log(error)
            });

    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);

    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };



    const handleEmailLogin = (e) => {
        e.preventDefault();
        // Perform email login logic here
        // sign in by google==================================================================

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                console.log('sign-in by email-pass done');
                setUser(userCredential)
                if(location){
                    navigate(location);
                    setLocation('');


                }
                else{
                    navigate('/');
                }
                // ...
            })
            .catch((error) => {
                console.log(error)
            });





    };








    return (
        <Container>
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Form>
                        <h2 className="text-center mb-4">Login</h2>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} />
                        </Form.Group>
                        <p className='mt-2'>Dont have an account? <Link   className='text-decoration-none' to={'/register'}>Register</Link></p>

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

export default Login;
