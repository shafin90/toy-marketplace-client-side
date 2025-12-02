import { useContext, useState } from 'react';
import { Button, Container, Row, Col, Image, Badge } from 'react-bootstrap';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../config/apiConfig';
import Reviews from '../Reviews/Reviews';
import StripePayment from '../StripePayment/StripePayment';
import ExchangeModal from '../ExchangeModal/ExchangeModal';

const ViewDetails = () => {
  const carData = useLoaderData();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const { picture, name, seller_name, seller_email, price, offerPrice, ratings, available_quantity, quantity, detail_description, sub_category, _id, type, status, allowOldToyExchange } = carData;

  // Determine pricing based on toy type
  const moneyPrice = price || 0;
  const offer = offerPrice || null;
  const displayPrice = offer && offer > 0 ? offer : moneyPrice;
  const sellerEmail = seller_email || carData.sellerEmail || carData.listedBy;
  const isShopToy = type === 'shop_toy';
  const currentQuantity = available_quantity || quantity || 0;
  const isAvailable = status === 'available' && currentQuantity > 0;
  const canPurchaseWithMoney = moneyPrice > 0;
  const canExchange = user && user.email !== sellerEmail && isShopToy && allowOldToyExchange && isAvailable;

  const handlePurchase = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.email === sellerEmail) {
      toast.error("You cannot purchase your own toy!");
      return;
    }

    if (!isAvailable || currentQuantity <= 0) {
      toast.error("This toy is out of stock or not available for purchase");
      return;
    }

    setShowStripeModal(true);
  };


  return (
    <Container>
      <Row className="my-4">
        <Col sm={6}>
          <Image src={getImageUrl(picture || pictureUrl)} fluid className="rounded shadow-sm" />
        </Col>
        <Col sm={6}>
          <h2 className="display-5 fw-bold text-primary">{name}</h2>
          <p className="text-muted badge bg-light text-dark border">Category: {sub_category}</p>
          <p className="lead">{detail_description}</p>

          <div className="p-3 bg-light rounded mb-3">
            <p className="mb-1"><strong>Seller: </strong> {seller_name}</p>
            <p className="mb-1"><strong>Seller Email: </strong> {seller_email}</p>
            <p className="mb-1"><strong>Ratings: </strong> ⭐ {ratings || 'N/A'}</p>
            <p className="mb-0">
              <strong>Available Quantity: </strong> 
              {currentQuantity > 0 ? (
                <span className="text-success">{currentQuantity}</span>
              ) : (
                <span className="text-danger">Out of Stock</span>
              )}
            </p>
          </div>

          <div className="p-3 bg-light rounded mb-3">
            {moneyPrice > 0 ? (
              <div className="mb-2">
                {offer && offer > 0 ? (
                  <>
                    <div>
                      <strong>Regular Price:</strong> <span className="text-decoration-line-through text-muted me-2">৳ {moneyPrice}</span>
                    </div>
                    <div>
                      <strong>Offer Price:</strong> <span className="badge bg-danger fs-6">৳ {offer}</span>
                      <Badge bg="success" className="ms-2">Save ৳ {moneyPrice - offer}</Badge>
                    </div>
                  </>
                ) : (
                  <div>
                    <strong>Price:</strong> <span className="badge bg-success fs-6">৳ {moneyPrice}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <strong>Price:</strong> <span className="text-muted">Not set</span>
              </div>
            )}
            {allowOldToyExchange && (
              <div className="mt-2">
                <Badge bg="warning" text="dark">Exchangeable with Old Toys</Badge>
              </div>
            )}
          </div>

          {!isAvailable && (
            <Badge bg="danger" className="mb-3">Not Available</Badge>
          )}

          <div className="d-flex gap-3 flex-wrap">
            {isAvailable && (
              <>
                {canPurchaseWithMoney && (
                  <Button 
                    onClick={handlePurchase} 
                    variant="primary" 
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Buy Now ৳ ${displayPrice}`}
                  </Button>
                )}
                {canExchange && (
                  <Button 
                    onClick={() => {
                      setShowExchangeModal(true);
                    }} 
                    variant="warning" 
                    size="lg" 
                    disabled={loading}
                  >
                    Exchange with Old Toy
                  </Button>
                )}
                {!canPurchaseWithMoney && !canExchange && user && (
                  <Button variant="secondary" size="lg" disabled>
                    Purchase Not Available
                  </Button>
                )}
                {!user && (
                  <Button 
                    onClick={() => navigate('/login')} 
                    variant="primary" 
                    size="lg"
                  >
                    Login to Purchase
                  </Button>
                )}
              </>
            )}
            <Button onClick={handleGoBack} variant="outline-secondary" size="lg">Go Back</Button>
          </div>
        </Col>
      </Row>

      <Row className="my-5">
        <Col>
          <Reviews toyId={_id} shopOwnerEmail={sellerEmail} />
        </Col>
      </Row>

      {/* Stripe Payment Modal */}
      <StripePayment
        show={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        toyId={_id}
        buyerEmail={user?.email}
        amount={displayPrice}
        toyName={name}
        onSuccess={() => {
          setShowStripeModal(false);
          setTimeout(() => {
            navigate('/toy_table');
          }, 1500);
        }}
      />

      {/* Exchange Modal */}
      <ExchangeModal
        show={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        productId={_id}
        userId={user?.email}
        onSuccess={() => {
          // Refresh or navigate
          setTimeout(() => {
            navigate('/toy_table');
          }, 1500);
        }}
      />
    </Container>
  );
};

export default ViewDetails;