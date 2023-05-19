import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const MyCard = ({info}) => {
  const {name,picture,detail_description} = info;
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={picture} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          {/* Some quick example text to build on the card title and make up the bulk of the card's content. */}
        {detail_description}
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
};

export default MyCard;
