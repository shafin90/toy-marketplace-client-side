import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/Provider';
import { Table, Button, Form, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AllToy = () => {
  const { data, user, setLocation } = useContext(AuthContext);

  const [twentyData, setTwentyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    if (data.length > 20) {
      setTwentyData(data.slice(0, 20));
    } else {
      setTwentyData([...data]);
    }
  }, [data]);

  useEffect(() => {
    if (searchQuery) {
      const filteredData = data.filter((toy) =>
        toy.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTwentyData(filteredData.slice(0, 20));
    } else {
      setTwentyData([...data.slice(0, 20)]);
    }
  }, [searchQuery, data]);

  const handleClear = () => {
    setSearchQuery('');
    setTwentyData(data.slice(0, 20));
  };



  const navigate = useNavigate();
  const navigate_view = (id) => {

    if (user) {
      navigate(`/${id}`)
    }
    else{
      setLocation(`/${id}`)
      navigate('/login');
      
    }


  }

  return (
    <div className="container">
      <h3 className="mt-5">Search by Name</h3>
      <Form className="mb-4">
        <Form.Group className='mb-3' controlId="searchBar">
          <FormControl
            type="text"
            name="name"
            placeholder="Enter your search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" className="me-2" type="submit">
          Search
        </Button>
        <Button variant="danger" onClick={handleClear}>
          Clear
        </Button>
      </Form>

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
          {twentyData.map((toy, index) => (
            <tr key={index}>
              <td>{toy.seller_name ? toy.seller_name : '-'}</td>
              <td>{toy.name}</td>
              <td>{toy.sub_category}</td>
              <td>{toy.prices.original}$</td>
              <td>{toy.available_quantity}</td>
              <td>
                {console.log(toy._id)}
                <Button onClick={() => navigate_view(toy._id)} variant="primary">View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllToy;
