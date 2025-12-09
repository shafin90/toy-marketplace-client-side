import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import { AuthContext } from '../Provider/Provider';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../config/apiConfig';
import './MyCard.css'

const MyCard = ({ info }) => {
  const { name, picture, pictureUrl, images, detail_description, detailDescription, _id } = info;
  
  // Get image from various possible field names
  const imageUrl = getImageUrl(picture || pictureUrl || (images && images[0]) || '');
  
  // Get description from various possible field names
  const description = detail_description || detailDescription || '';

  const { user, setLocation } = useContext(AuthContext)
  const navigation = useNavigate()





  const handleNavigate = (id) => {

    if (user) {
      navigation(`/view_details/${id}`)
    }
    else {
      setLocation(`/view_details/${id}`)
      navigation('/login');

    }


  }

  return (
    <Card className="h-100" style={{ width: '100%', maxWidth: '100%' }}>
      <Card.Img className='card_img' variant="top" src={imageUrl} style={{ height: '300px', objectFit: 'cover', width: '100%' }} />
      <Card.Body className='d-flex flex-column justify-content-between card-body align-items-start'>
        <Card.Title>{name}</Card.Title>
        <div className="mb-2">
          {info.offerPrice && info.offerPrice > 0 ? (
            <>
              <span className="text-decoration-line-through text-muted me-2">
                ৳ {info.price || 0}
              </span>
              <span className="badge bg-dark fs-6">৳ {info.offerPrice}</span>
            </>
          ) : (
            <span className="badge bg-success fs-6">
              ৳ {info.price || 0}
            </span>
          )}
        </div>
        <Card.Text className="text-muted small">
          {description ? description.slice(0, 50) + '...' : 'No description available.'}
        </Card.Text>
        <Button onClick={() => handleNavigate(_id)} variant="primary" className="w-100 mt-2">
          Swap Now
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MyCard;
