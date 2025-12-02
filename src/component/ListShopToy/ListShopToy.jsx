import { useContext, useState } from 'react';
import { Form, Row, Col, Button, Card, Container } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import { Toaster, toast } from 'react-hot-toast';
import toyAPI from '../../api/toyAPI';
import { useNavigate } from 'react-router-dom';
import './ListShopToy.css';

const ListShopToy = () => {
    const { user, setMyToy, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        subcategory: '',
        price: '',
        offerPrice: '',
        allowOldToyExchange: false,
        quantity: '1',
        ratings: '5',
        detail_description: '',
        picture: null,
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                picture: file
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user?.email) {
            toast.error('Please login to list a toy');
            return;
        }

        if (userRole !== 'shop_owner') {
            toast.error('Only shop owners can list shop toys');
            return;
        }

        if (!formData.picture) {
            toast.error('Please upload a photo');
            return;
        }

        // Validation: Must have price
        if (!formData.price || formData.price <= 0) {
            toast.error('Please set a valid price');
            return;
        }

        try {
            setLoading(true);

            const toyData = {
                ...formData,
                listedBy: user.email,
                sub_category: formData.subcategory,
                allowOldToyExchange: formData.allowOldToyExchange,
            };

            await toyAPI.addShopToy(toyData);

            // Clear form
            setFormData({
                name: '',
                subcategory: '',
                price: '',
                offerPrice: '',
                allowOldToyExchange: false,
                quantity: '1',
                ratings: '5',
                detail_description: '',
                picture: null,
            });
            setPreview(null);

            // Refresh my toys - will be handled by Provider context

            toast.success('Shop toy listed successfully!');
            setTimeout(() => {
                navigate('/toy_table');
            }, 1500);
        } catch (error) {
            console.error('Error listing shop toy:', error);
            toast.error(error.message || 'Failed to list toy. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user || userRole !== 'shop_owner') {
        return (
            <Container className="my-5">
                <PageTitle title="List Shop Toy" />
                <Card>
                    <Card.Body>
                        <h3>Access Denied</h3>
                        <p>Only shop owners can list shop toys.</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mb-5">
            <PageTitle title="List Shop Toy" />
            <Card className="p-4">
                <h1 className="h2 my-4 text-center">List Toy for Sale</h1>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} md={6}>
                            <Form.Group controlId="picture" className="mb-3">
                                <Form.Label>Photo of the Toy *</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                {preview && (
                                    <div className="mt-2">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}
                            </Form.Group>

                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Toy Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter toy name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="subcategory" className="mb-3">
                                <Form.Label>Sub-category *</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.subcategory}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select sub-category</option>
                                    <option value="Regular Car">Regular Car</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Sports Car">Sports Car</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="quantity" className="mb-3">
                                <Form.Label>Available Quantity *</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group controlId="price" className="mb-3">
                                <Form.Label>Regular Price (৳) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Set the regular price in Bangladeshi Taka
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="offerPrice" className="mb-3">
                                <Form.Label>Offer Price (৳) <small className="text-muted">(Optional)</small></Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g. 400"
                                    value={formData.offerPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                                <Form.Text className="text-muted">
                                    Set a discounted offer price (leave empty if no offer)
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="allowOldToyExchange" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Allow old toy exchange"
                                    checked={formData.allowOldToyExchange}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            allowOldToyExchange: e.target.checked
                                        }));
                                    }}
                                />
                                <Form.Text className="text-muted">
                                    Check this if buyers can exchange old toys for this product
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="ratings" className="mb-3">
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g. 4.5"
                                    value={formData.ratings}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="5"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="detail_description" className="mb-3">
                        <Form.Label>Detail Description *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Describe your toy in detail..."
                            value={formData.detail_description}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg" disabled={loading}>
                            {loading ? 'Listing...' : 'List Toy for Sale'}
                        </Button>
                    </div>
                </Form>
            </Card>
            <Toaster />
        </Container>
    );
};

export default ListShopToy;

