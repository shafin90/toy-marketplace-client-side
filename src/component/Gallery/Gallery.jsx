import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal, Image } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Gallery.css';

const Gallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const galleryRef = useRef(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            AOS.refresh();
          }
        });
      },
      { rootMargin: '0px', threshold: 0.2 } // Adjust the threshold value as needed
    );

    observer.observe(galleryRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="gallery my-5 border-bottom" ref={galleryRef}>
      <Container>
        <h1 className="h1 my-4 text-center">CarCarnival</h1>
        <Row>
          {images.map((image, index) => (
            <Col key={index} xs={6} md={3} className="gallery-item" data-aos="fade-up">
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
  '../../../public/image/602_5188.webp',
  '../../../public/image/classic-toy-cars-2.jpg',
  '../../../public/image/frictionRacingCarRed3.jpg',
  '../../../public/image/maxresdefault (1).jpg',
  '../../../public/image/toy-car-99.jpg',
  '../../../public/image/602_5188.webp',
  '../../../public/image/classic-toy-cars-2.jpg',
  '../../../public/image/frictionRacingCarRed3.jpg',
  '../../../public/image/maxresdefault (1).jpg',
  '../../../public/image/toy-car-99.jpg',
  '../../../public/image/602_5188.webp',
  '../../../public/image/classic-toy-cars-2.jpg',
  '../../../public/image/frictionRacingCarRed3.jpg',
  '../../../public/image/maxresdefault (1).jpg',
  '../../../public/image/toy-car-99.jpg'
  // Add more image URLs here
];
