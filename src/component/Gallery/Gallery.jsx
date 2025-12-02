import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal, Image } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Gallery.css';
import { useLocation } from 'react-router-dom';

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
    <div className="gallery my-5 " ref={galleryRef}>
      <Container className='mb-5 pb-5 border-bottom'>
        <h1 className="h1 my-4 text-center">Toy Gallery 📸</h1>
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
  'https://eskipaper.com/images/toy-car-background-1.jpg',
  'https://i.pinimg.com/originals/9c/a1/fb/9ca1fb0500d5fc850490249f12b6aa28.jpg',
  'https://live.staticflickr.com/8255/8626655877_198e52cd6d.jpg',
  'http://1.bp.blogspot.com/-xpMkiS08tBg/UIv6BgN35II/AAAAAAAAAqM/f7joxUZDMTk/s1600/jada+beetle+cream+4.jpg',
  'https://expertphotography.com/wp-content/uploads/2018/11/Toy-Photography-car.jpg',
  'https://i.ytimg.com/vi/Xa_z_LDfFxA/hqdefault.jpg',
  'https://www.sott.net/image/s28/575885/full/toy_truck.jpg',
  'https://i.ytimg.com/vi/WMNlWwYIoz8/maxresdefault.jpg',
  'https://wallpapercave.com/wp/wp7309378.jpg',
  'https://steamcommunity.com/economy/profilebackground/items/310560/611289d052b62c80f3f7bedd0b966a70fedea3f1.jpg',
  'https://i.ytimg.com/vi/-dg7ZC1VShs/maxresdefault.jpg',
  'https://wallup.net/wp-content/uploads/2019/09/298923-vintage-cars-toy-car.jpg',
  'https://www.zastavki.com/pictures/1920x1200/2012/Photoshop_Vintage_Toy_Car_034755_.jpg',
  'https://i.ytimg.com/vi/Xa_z_LDfFxA/hqdefault.jpg',
  'https://live.staticflickr.com/65535/50617544931_47ccde4b37_z.jpg'
  // Add more image URLs here
];
