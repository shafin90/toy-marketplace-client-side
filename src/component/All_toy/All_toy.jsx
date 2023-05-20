import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/Provider';
import { Table, Button, Form, FormControl } from 'react-bootstrap';

const AllToy = () => {
  const { data } = useContext(AuthContext);

  const [twentyData, setTwenyData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  setTimeout(() => {
    if (data.length > 20) {
      const newData = data.slice(0, 20);
      setTwenyData(newData);
    }
    else {
      setTwenyData([...data])
    }


  }, 1);


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(twentyData.map(event=>event.name))
    const searchedProduct = twentyData.filter(event => event.name == e.target.name.value);
    console.log(searchedProduct)
    if (searchedProduct.length === 0) {
      setErrorMsg('nothing found')
      setTimeout(() => {
        setErrorMsg('')

      }, 2000)
    }
    // const num = [...setTwenyData]
    setTwenyData(searchedProduct)
    console.log(twentyData)

  }








  const handleClear = (e) => {
    e.target.reset();
    setTwenyData([...data.slice(0, 20)])

  }



  return (
    <div className="table-responsive container">




      <Form onSubmit={handleSubmit} className='container mb-5'>
        <h3>Search by Name</h3>
        <Form.Group className='mb-4' controlId="searchBar">
          <Form.Label>Search:</Form.Label>
          <FormControl type="text" name='name' placeholder="Enter your search query" />
        </Form.Group>
        <p className='text-danger'>{errorMsg}</p>
        <Button variant="primary" className='me-4' type="submit">Search</Button>
        <Button variant="danger" onClick={() => handleClear()} type="submit">Clear</Button>
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
                <Button variant="primary">View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllToy;
