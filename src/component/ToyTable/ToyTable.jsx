import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import { useContext, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import PageTitle from '../PageTitle/PageTitle';
import { Toaster, toast } from 'react-hot-toast';


const ToyTable = () => {
  const { myToy, setMyToy } = useContext(AuthContext);











  const [showModal, setShowModal] = useState(false);
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
















  const [toyId, setToyId] = useState('');




  const handleShowModal = (toyId) => {
    setToyId(toyId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdate = () => {
    // Make an API call to update the toy data in MongoDB
    fetch(`http://localhost:5000/users/${toyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: updatedPrice,
        available_quantity: updatedQuantity,
        detail_description: updatedDescription,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Update the myToy state with the updated toy data
        setMyToy((prevMyToy) =>
          prevMyToy.map((toy) => {
            if (toy._id === toyId) {
              return {
                ...toy,
                price: updatedPrice,
                available_quantity: updatedQuantity,
                detail_description: updatedDescription,
              };
            }
            return toy;
          })
        );
        handleCloseModal();

        // Show the toast message
        toast.success('Item has been updated');
      })
      .catch((error) => {
        console.error('Error updating toy:', error);
      });
  };


























  useEffect(() => {
    fetch('https://carz-server-shafin90.vercel.app/mytoys')
      .then(res => res.json())
      .then(data => setMyToy(data))
  }, [])




  const onDelete = (toyId) => {
    console.log(toyId)
    // Make an API call to delete the toy data from MongoDB
    fetch(`http://localhost:5000/users/${toyId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        // Update the myToy state by removing the deleted toy
        setMyToy((prevMyToy) => prevMyToy.filter((toy) => toy._id !== toyId));
        // Show the toast message
        toast.success('Item has been deleted from database');
      })
      .catch((error) => {
        console.error('Error deleting toy:', error);
      });
  };





  const ascending = ()=>{
    fetch('/ascending-sorted-array')
    .then(res => res.json())
      .then(data => setMyToy(data))
  }

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

            <Form.Group controlId="formQuantity">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control
                type="text"
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>









      <Table responsive>
        <thead>
          <tr>
            <th>Seller</th>
            <th>Toy Name</th>
            <th>Sub-category</th>
            <th>Price</th>
            <th>Available Quantity</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {myToy.map((toy, index) => (
            <tr key={index}>
              <td>{toy.seller_name}</td>
              <td>{toy.name}</td>
              <td>{toy.sub_category}</td>
              <td>{toy.price}</td>
              <td>{toy.available_quantity}</td>
              <td>{toy.detail_description}</td>
              <td>
                <Button variant="danger" onClick={() => onDelete(toy._id)}>
                  Delete
                </Button>{' '}
                {/* {console.log(toy[0]._id)} */}

                <Button variant="primary" onClick={() => handleShowModal(toy._id)}>
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Toaster />
    </div>
  );
};

export default ToyTable;
