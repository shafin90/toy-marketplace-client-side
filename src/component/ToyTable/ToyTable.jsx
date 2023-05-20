import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import { useContext } from 'react';

const ToyTable = () => {
  const { myToy, setMyToy } = useContext(AuthContext);
  console.log(myToy)

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
      })
      .catch((error) => {
        console.error('Error deleting toy:', error);
      });
  };

  const onUpdate = (toyId) => {
    // Handle update functionality here
  };

  return (
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
              {console.log(toy._id)}
              
              <Button variant="primary" onClick={() => onUpdate(toy._id)}>
                Update
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ToyTable;
