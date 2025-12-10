import { Card, Placeholder } from 'react-bootstrap';

const CardSkeleton = () => (
  <Card className="mb-3 shadow-sm">
    <Placeholder as={Card.Img} variant="top" style={{ height: '180px' }} animation="wave" />
    <Card.Body>
      <Placeholder as={Card.Title} animation="wave">
        <Placeholder xs={7} />
      </Placeholder>
      <Placeholder as={Card.Text} animation="wave">
        <Placeholder xs={5} /> <Placeholder xs={4} />
      </Placeholder>
      <Placeholder.Button variant="secondary" xs={6} />
    </Card.Body>
  </Card>
);

export default CardSkeleton;

