import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import { useContext, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import PageTitle from '../PageTitle/PageTitle';
import { Toaster, toast } from 'react-hot-toast';
import toyService from '../../services/toyService';
import { getImageUrl } from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

const ToyTable = () => {
  const { myToy, setMyToy, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedOfferPrice, setUpdatedOfferPrice] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [toyId, setToyId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShowModal = (toy) => {
    setToyId(toy._id);
    setUpdatedPrice(toy.price || '');
    setUpdatedOfferPrice(toy.offerPrice || '');
    setUpdatedQuantity(toy.quantity || toy.available_quantity || '');
    setUpdatedDescription(toy.description || toy.detail_description || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdatedPrice('');
    setUpdatedOfferPrice('');
    setUpdatedQuantity('');
    setUpdatedDescription('');
    setToyId('');
  };

  const handleUpdate = async () => {
    if (!toyId) return;

    try {
      setLoading(true);
      // Map frontend field names to backend expected names
      const updateData = {
        price: updatedPrice,
        offerPrice: updatedOfferPrice,
        description: updatedDescription,
        quantity: updatedQuantity,
      };

      await toyService.updateToy(toyId, updateData);

      // Refresh the toys list
      if (user?.email) {
        const updatedToys = await toyService.getUserToys(user.email);
        setMyToy(updatedToys);
      }

      handleCloseModal();
      toast.success('Item has been updated');
    } catch (error) {
      console.error('Error updating toy:', error);
      toast.error(error.message || 'Failed to update toy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyToys = async () => {
      if (user?.email) {
        try {
          const toys = await toyService.getUserToys(user.email);
          setMyToy(toys);
        } catch (error) {
          console.error('Error fetching my toys:', error);
          toast.error('Failed to load your toys');
        }
      }
    };

    fetchMyToys();
  }, [user?.email, setMyToy]);

  const onDelete = async (toyId) => {
    if (!window.confirm('Are you sure you want to delete this toy?')) {
      return;
    }

    try {
      await toyService.deleteToy(toyId);
      // Update the myToy state by removing the deleted toy
      setMyToy((prevMyToy) => prevMyToy.filter((toy) => toy._id !== toyId));
      toast.success('Item has been deleted from database');
    } catch (error) {
      console.error('Error deleting toy:', error);
      toast.error(error.message || 'Failed to delete toy');
    }
  };

  return (
    <div>
      <PageTitle title={"My Toy"}></PageTitle>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Toy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                value={updatedPrice}
                onChange={(e) => setUpdatedPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formOfferPrice">
              <Form.Label>Offer Price (৳)</Form.Label>
              <Form.Control
                type="number"
                value={updatedOfferPrice}
                onChange={(e) => setUpdatedOfferPrice(e.target.value)}
                placeholder="Optional: Set a special offer price"
              />
            </Form.Group>

            <Form.Group controlId="formQuantity">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control
                type="number"
                value={updatedQuantity}
                onChange={(e) => setUpdatedQuantity(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Container className="my-5">
        {myToy.length === 0 ? (
          <div className="text-center my-5">
            <h4>No toys found</h4>
            <p className="text-muted">You haven't listed any toys yet.</p>
          </div>
        ) : (
          <Row>
            {myToy.map((toy) => (
              <Col lg={4} md={6} sm={6} xs={12} key={toy._id} className="mb-4">
                <Card className="h-100" style={{ width: '100%' }}>
                  <Card.Img 
                    variant="top" 
                    src={getImageUrl(toy.picture || toy.pictureUrl || (toy.images && toy.images[0]))} 
                    style={{ height: '300px', objectFit: 'cover' }} 
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{toy.name}</Card.Title>
                    <div className="mb-2">
                      <Badge bg="secondary" className="me-2">
                        {toy.sub_category || toy.subcategory || 'Toy'}
                      </Badge>
                      {toy.status && (
                        <Badge bg={toy.status === 'available' ? 'success' : 'secondary'}>
                          {toy.status}
                        </Badge>
                      )}
                    </div>
                    <div className="mb-2">
                      {toy.offerPrice && toy.offerPrice > 0 ? (
                        <>
                          <span className="text-decoration-line-through text-muted me-2">
                            ৳ {toy.price || 0}
                          </span>
                          <Badge bg="danger" className="fs-6">৳ {toy.offerPrice}</Badge>
                        </>
                      ) : (
                        <Badge bg="success" className="fs-6">৳ {toy.price || 0}</Badge>
                      )}
                    </div>
                    <Card.Text className="text-muted small mb-2">
                      <strong>Quantity:</strong> {toy.available_quantity || toy.quantity || 0}
                    </Card.Text>
                    <Card.Text className="text-muted small flex-grow-1">
                      {toy.detail_description || toy.description || 'No description available.'}
                    </Card.Text>
                    <div className="d-grid gap-2 mt-auto">
                      <Button 
                        variant="primary" 
                        onClick={() => navigate(`/view_details/${toy._id}`)}
                      >
                        View Details
                      </Button>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="warning" 
                          onClick={() => handleShowModal(toy)}
                          className="flex-fill"
                        >
                          Update
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => onDelete(toy._id)}
                          className="flex-fill"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Toaster />
    </div>
  );
};

export default ToyTable;
