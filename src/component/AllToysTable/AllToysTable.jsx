import { Table, Button } from 'react-bootstrap';

const AllToysTable = ({ toys }) => {

  console.log(toys)
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Seller</th>
          <th>Toy Name</th>
          <th>Sub-category</th>
          <th>Price</th>
          <th>Available Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {toys.map((toy, index) => (
          <tr key={index}>
            <td>{toy.seller ? toy.seller : '-'}</td>
            <td>{toy.name}</td>
            <td>{toy.subCategory}</td>
            <td>{toy.price}</td>
            <td>{toy.quantity}</td>
            <td>
              <Button variant="primary">View Details</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AllToysTable;
