import { useNavigate } from 'react-router-dom';
import { Button, Container, Image } from 'react-bootstrap';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container className="not-found-container text-center my-5">
      <Image
        src="https://rcsdigital.com.au/wp-content/uploads/2017/12/404-errors.png" // Replace with the actual path to your image
        alt="404 Not Found"
        className="not-found-image img-fluid"
      />
      <h2 className="my-4">Oops! Page Not Found</h2>
      <p className="mb-4">The page you're looking for does not exist.</p>
      <Button variant="primary" onClick={handleBackToHome}>
        Back to Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
