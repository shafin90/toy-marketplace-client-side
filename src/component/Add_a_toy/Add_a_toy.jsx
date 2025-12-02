import { useContext, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import { Toaster, toast } from 'react-hot-toast';
import toyService from '../../services/toyService';



const Add_a_toy = () => {

    const { setMyToy, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);




    console.log(user)









    const [formData, setFormData] = useState({
        picture: '',
        name: '',
        seller_name: '',
        seller_email: '',
        sub_category: '',
        creditCost: '',
        ratings: '',
        available_quantity: '',
        detail_description: '',
    });


    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user?.email) {
            toast.error('Please login to add a toy');
            return;
        }

        try {
            setLoading(true);

            // Map frontend field names to backend expected format
            // Backend accepts any fields, but we'll use sellerEmail as required
            const toyData = {
                name: formData.name,
                picture: formData.picture,
                pictureUrl: formData.picture, // Support both field names
                sellerName: formData.seller_name,
                seller_name: formData.seller_name, // Support both
                sellerEmail: formData.seller_email || user.email,
                seller_email: formData.seller_email || user.email, // Support both
                subcategory: formData.sub_category,
                sub_category: formData.sub_category, // Support both
                creditCost: parseInt(formData.creditCost) || 10,
                ratings: formData.ratings,
                quantity: parseInt(formData.available_quantity) || 1,
                available_quantity: parseInt(formData.available_quantity) || 1, // Support both
                description: formData.detail_description,
                detail_description: formData.detail_description, // Support both
            };

            await toyService.addToy(toyData);

            // Clear the form fields
            setFormData({
                picture: '',
                name: '',
                seller_name: '',
                seller_email: '',
                sub_category: '',
                creditCost: '',
                ratings: '',
                available_quantity: '',
                detail_description: '',
            });

            // Refresh my toys list
            if (user?.email) {
                const updatedToys = await toyService.getUserToys(user.email);
                setMyToy(updatedToys);
            }

            toast.success('Item has been added to database');
        } catch (error) {
            console.error('Error adding toy:', error);
            toast.error(error.message || 'Failed to add toy. Please try again.');
        } finally {
            setLoading(false);
        }










    };

    return (
        <Form className='container mb-5' onSubmit={handleSubmit}>
            <PageTitle title={"Add a toy"}></PageTitle>
            <h1 className='h1 my-4 text-center'>List a Toy for Swap</h1>
            <Row>
                <Col xs={12} md={6}>
                    <Form.Group controlId="picture">
                        <Form.Label>Picture URL of the toy</Form.Label>
                        <Form.Control required type="text" placeholder="Enter picture URL" value={formData.picture} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type="text" placeholder="Enter name" value={formData.name} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="seller_name">
                        <Form.Label>Seller Name</Form.Label>
                        <Form.Control required type="text" placeholder="Enter seller name" value={formData.seller_name} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="seller_email">
                        <Form.Label>Seller Email</Form.Label>
                        <Form.Control required type="email" placeholder="Enter seller email" value={formData.seller_email} onChange={handleInputChange} />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group controlId="sub_category">
                        <Form.Label>Sub-category</Form.Label>
                        <Form.Control required as="select" value={formData.sub_category} onChange={handleInputChange}>
                            <option value="">Select sub-category</option>
                            <option value="Regular Car">Reguler Car</option>
                            <option value="Truck">Truck</option>
                            <option value="Sports Car">Sports Car</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="creditCost">
                        <Form.Label>Credit Cost (💎)</Form.Label>
                        <Form.Control required type="number" placeholder="e.g. 20" value={formData.creditCost} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="ratings">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control required type="number" step="0.1" placeholder="Enter rating" value={formData.ratings} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="available_quantity">
                        <Form.Label>Available Quantity</Form.Label>
                        <Form.Control required type="number" placeholder="Enter available quantity" value={formData.available_quantity} onChange={handleInputChange} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="detail_description">
                <Form.Label>Detail Description</Form.Label>
                <Form.Control required as="textarea" rows={5} placeholder="Enter detail description" value={formData.detail_description} onChange={handleInputChange} />
            </Form.Group>
            <Button className='my-3' variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Submit'}
            </Button>
            <Toaster />
        </Form>
    );
};

export default Add_a_toy;
