
import {  useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();



  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <img
        src="/path/to/404-image.jpg" // Replace with the actual path to your image
        alt="404 Not Found"
        className="not-found-image"
      />
      <button className="back-to-home-button" onClick={handleBackToHome}>
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
