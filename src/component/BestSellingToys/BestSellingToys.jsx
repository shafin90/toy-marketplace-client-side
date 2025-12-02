import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toyAPI from '../../api/toyAPI';
import { toast } from 'react-hot-toast';
import MyCard from '../MyCard/MyCard';

const BestSellingToys = () => {
    const [bestSellingToys, setBestSellingToys] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBestSellingToys();
    }, []);

    const fetchBestSellingToys = async () => {
        try {
            setLoading(true);
            const toysData = await toyAPI.getAllToys({ sortBy: 'newest' });
            
            // Get best selling toys (by ratings or most recent with high ratings)
            const sortedToys = toysData
                .filter(toy => toy.status === 'available')
                .sort((a, b) => {
                    const ratingA = a.ratings || 0;
                    const ratingB = b.ratings || 0;
                    if (ratingB !== ratingA) {
                        return ratingB - ratingA;
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .slice(0, 9); // Show top 9 for carousel (3 per slide)
            
            setBestSellingToys(sortedToys);
        } catch (error) {
            console.error('Error fetching best selling toys:', error);
            toast.error('Failed to load toys');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    if (bestSellingToys.length === 0) {
        return null;
    }

    return (
        <Container className="my-5 py-5 border-bottom">
            <h1 className="display-4 fw-bold mb-4">Best Selling Toys</h1>
            <Row>
                {bestSellingToys.map((toy) => (
                    <Col md={4} sm={6} xs={12} key={toy._id} className="mb-4">
                        <MyCard info={toy} />
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-4">
                <Button 
                    variant="outline-primary" 
                    size="lg"
                    onClick={() => navigate('/all_toy')}
                >
                    View All Toys
                </Button>
            </div>
        </Container>
    );
};

export default BestSellingToys;

