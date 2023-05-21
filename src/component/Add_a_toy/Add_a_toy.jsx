import { useContext, useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';

const Add_a_toy = () => {

    const { setMyToy, myToy, data } = useContext(AuthContext);




    const [formData, setFormData] = useState({
        picture: '',
        name: '',
        seller_name: '',
        seller_email: '',
        sub_category: '',
        price: '',
        ratings: '',
        available_quantity: '',
        detail_description: ''
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        // Send the form data to the backend using the POST method
        fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(datas => {
                // Handle the response from the backend as needed
                console.log(datas.insertedId);
                // Clear the form fields
                setFormData({
                    picture: '',
                    name: '',
                    seller_name: '',
                    seller_email: '',
                    sub_category: '',
                    price: '',
                    ratings: '',
                    available_quantity: '',
                    detail_description: ''
                });
                

            })
            .catch(error => {
                // Handle any errors that occur during the POST request
                console.error(error);
            });










    };

    return (
        <Form className='container mb-5' onSubmit={handleSubmit}>
             <PageTitle title={"Add a toy"}></PageTitle>
            <h1 className='h1 my-4 text-center'>Add an item</h1>
            <Row>
                <Col xs={12} md={6}>
                    <Form.Group controlId="picture">
                        <Form.Label>Picture URL of the toy</Form.Label>
                        <Form.Control type="text" placeholder="Enter picture URL" value={formData.picture} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={formData.name} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="seller_name">
                        <Form.Label>Seller Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter seller name" value={formData.seller_name} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="seller_email">
                        <Form.Label>Seller Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter seller email" value={formData.seller_email} onChange={handleInputChange} />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group controlId="sub_category">
                        <Form.Label>Sub-category</Form.Label>
                        <Form.Control as="select" value={formData.sub_category} onChange={handleInputChange}>
                            <option value="">Select sub-category</option>
                            <option value="Regular Car">Reguler Car</option>
                            <option value="Truck">Truck</option>
                            <option value="Sports Car">Sports Car</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter price" value={formData.price} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="ratings">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="number" step="0.1" placeholder="Enter rating" value={formData.ratings} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="available_quantity">
                        <Form.Label>Available Quantity</Form.Label>
                        <Form.Control type="number" placeholder="Enter available quantity" value={formData.available_quantity} onChange={handleInputChange} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="detail_description">
                <Form.Label>Detail Description</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Enter detail description" value={formData.detail_description} onChange={handleInputChange} />
            </Form.Group>
            <Button className='my-3' variant="primary" type="submit">Submit</Button>
        </Form>
    );
};

export default Add_a_toy;