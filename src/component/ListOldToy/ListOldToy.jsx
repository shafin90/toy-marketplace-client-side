import { useContext, useState } from 'react';
import { Form, Row, Col, Button, Card, Container } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import { Toaster, toast } from 'react-hot-toast';
import oldToyAPI from '../../api/oldToyAPI';
import { useNavigate } from 'react-router-dom';
import './ListOldToy.css';

const ListOldToy = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([null, null, null, null]);

    const [formData, setFormData] = useState({
        name: '',
        details: '',
        purchaseDate: '',
        purchaseLocation: '',
        images: [null, null, null, null] // 4 images
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...formData.images];
            newImages[index] = file;
            setFormData(prevState => ({
                ...prevState,
                images: newImages
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...previews];
                newPreviews[index] = reader.result;
                setPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages[index] = null;
        setFormData(prevState => ({
            ...prevState,
            images: newImages
        }));
        
        const newPreviews = [...previews];
        newPreviews[index] = null;
        setPreviews(newPreviews);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user?.email) {
            toast.error('Please login to list a toy');
            return;
        }

        // Check if at least one image is uploaded
        const hasImage = formData.images.some(img => img !== null);
        if (!hasImage) {
            toast.error('Please upload at least one photo');
            return;
        }

        if (!formData.name || !formData.details) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // Create FormData for multipart/form-data
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('details', formData.details);
            formDataToSend.append('purchaseDate', formData.purchaseDate || new Date().toISOString());
            formDataToSend.append('purchaseLocation', formData.purchaseLocation);
            formDataToSend.append('listedBy', user.email);

            // Append images (only non-null ones)
            formData.images.forEach((image, index) => {
                if (image !== null) {
                    formDataToSend.append('images', image);
                }
            });

            await oldToyAPI.createOldToy(formDataToSend);

            // Clear form
            setFormData({
                name: '',
                details: '',
                purchaseDate: '',
                purchaseLocation: '',
                images: [null, null, null, null]
            });
            setPreviews([null, null, null, null]);

            toast.success('Old toy listed successfully!');
            setTimeout(() => {
                navigate('/toy_table');
            }, 1500);
        } catch (error) {
            console.error('Error listing old toy:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to list toy. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mb-5">
            <PageTitle title="List Old Toy" />
            <Card className="p-4">
                <h1 className="h2 my-4 text-center">List Your Old Toy</h1>
                <p className="text-center text-muted mb-4">
                    Add your old toys with details. Shop owners can purchase them for exchange.
                </p>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} md={6}>
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

                            <Form.Group controlId="details" className="mb-3">
                                <Form.Label>Details *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Describe your toy in detail..."
                                    value={formData.details}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="purchaseDate" className="mb-3">
                                <Form.Label>Purchase Date *</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.purchaseDate}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    When did you purchase this toy?
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="purchaseLocation" className="mb-3">
                                <Form.Label>Purchase Location *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Dhaka, Mirpur"
                                    value={formData.purchaseLocation}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Where did you purchase this toy from?
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Images (Up to 4) *</Form.Label>
                                <Row>
                                    {[0, 1, 2, 3].map((index) => (
                                        <Col xs={6} key={index} className="mb-3">
                                            <div className="border rounded p-2">
                                                {previews[index] ? (
                                                    <div className="position-relative">
                                                        <img
                                                            src={previews[index]}
                                                            alt={`Preview ${index + 1}`}
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '150px', 
                                                                objectFit: 'cover',
                                                                borderRadius: '4px'
                                                            }}
                                                        />
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0 m-1"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, index)}
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                )}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                                <Form.Text className="text-muted">
                                    Upload at least 1 image (maximum 4 images)
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg" disabled={loading}>
                            {loading ? 'Submitting...' : 'List Old Toy'}
                        </Button>
                    </div>
                </Form>
            </Card>
            <Toaster />
        </Container>
    );
};

export default ListOldToy;
