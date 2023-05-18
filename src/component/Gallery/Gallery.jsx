
import { useState } from 'react';
import { Container, Row, Col, Modal, Image } from 'react-bootstrap';
import './Gallery.css'

const Gallery = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage('');
    };

    return (
        <div className="gallery  ">
            <Container>
                <h1 className='h1 my-4 text-center'>CarCarnival</h1>
                <Row>
                    {images.map((image, index) => (
                        <Col key={index} xs={6} md={3} className="gallery-item ">
                            <img
                                src={image}
                                alt={`Gallery Image ${index + 1}`}
                                className="img-fluid rounded mb-3"
                                onClick={() => handleImageClick(image)}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body>
                    <Image src={selectedImage} alt="Selected Image" fluid />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Gallery;

// Array of images
const images = [
    '../../../public/image/rim-protector-rim-ringz-03.jpg',
    '../../.././public/image/1861_original.jpg',
    '../../../public/image/alloy-asphalt-auto-241316.jpg',
    '../../../public/image/rim-protector-rim-ringz-03.jpg',
    '../../.././public/image/1861_original.jpg',
    '../../../public/image/alloy-asphalt-auto-241316.jpg', '../../../public/image/rim-protector-rim-ringz-03.jpg',
    '../../.././public/image/1861_original.jpg',
    '../../../public/image/alloy-asphalt-auto-241316.jpg', '../../../public/image/rim-protector-rim-ringz-03.jpg',
    '../../.././public/image/1861_original.jpg',
    '../../../public/image/alloy-asphalt-auto-241316.jpg',
    // Add more image URLs here
];
