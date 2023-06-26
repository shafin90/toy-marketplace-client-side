import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../Provider/Provider';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import './MyCard.css'

const MyCard = ({ info }) => {
  const { name, picture, detail_description, _id } = info;

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
    <Card style={{ width: '18rem' }}>
      <Card.Img className='card_img' variant="top" src={picture} />
      <Card.Body className='d-flex flex-column justify-content-between card-body align-items-start'>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          {/* Some quick example text to build on the card title and make up the bulk of the card's content. */}
          {detail_description}
        </Card.Text>
        <Button onClick={() => handleNavigate(_id)} variant="primary">View Details</Button>
      </Card.Body>
    </Card>
  );
};

export default MyCard;
