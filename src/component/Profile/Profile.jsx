import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Button } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import userAPI from '../../api/userAPI';
import transactionAPI from '../../api/transactionAPI';
import { toast } from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const { user, userCredits } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.email) {
                try {
                    setLoading(true);
                    const profile = await userAPI.getUserByEmail(user.email);
                    setUserProfile(profile);

                    const txns = await transactionAPI.getUserTransactions(user.email);
                    setTransactions(txns);
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    toast.error('Failed to load profile');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <Container className="my-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!userProfile) {
        return (
            <Container className="my-5">
                <PageTitle title="Profile" />
                <Card>
                    <Card.Body>
                        <p>Profile not found</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <PageTitle title="My Profile" />
            
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body className="text-center">
                            <img
                                src={user?.photoURL || userProfile.photoURL || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="rounded-circle mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h3>{userProfile.name || user?.displayName}</h3>
                            <Badge bg={userProfile.role === 'shop_owner' ? 'success' : 'primary'} className="mb-3">
                                {userProfile.role === 'shop_owner' ? '🏪 Shop Owner' : '👤 User'}
                            </Badge>
                            {userProfile.role === 'shop_owner' && (
                                <div className="mt-3">
                                    <h6>Shop Information</h6>
                                    {userProfile.shopName && (
                                        <p className="mb-1"><strong>Shop Name:</strong> {userProfile.shopName}</p>
                                    )}
                                    {userProfile.shopAddress && (
                                        <p className="mb-1"><strong>Address:</strong> {userProfile.shopAddress}</p>
                                    )}
                                    {userProfile.phone && (
                                        <p className="mb-1"><strong>Phone:</strong> {userProfile.phone}</p>
                                    )}
                                    {userProfile.rating > 0 && (
                                        <p className="mb-0"><strong>Shop Rating:</strong> ⭐ {userProfile.rating?.toFixed(1)} / 5.0 ({userProfile.totalRatings || 0} reviews)</p>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <h5>Statistics</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <strong>💎 Coins:</strong> {userProfile.coins || userCredits || 0}
                            </div>
                            <div className="mb-3">
                                <strong>Total Earned:</strong> {userProfile.totalEarned || 0} coins
                            </div>
                            <div className="mb-3">
                                <strong>Total Spent:</strong> {userProfile.totalSpent || 0} coins
                            </div>
                            {userProfile.rating > 0 && (
                                <div>
                                    <strong>Rating:</strong> ⭐ {userProfile.rating?.toFixed(1)} / 5.0
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h5>Transaction History</h5>
                        </Card.Header>
                        <Card.Body>
                            {transactions.length === 0 ? (
                                <p className="text-muted">No transactions yet</p>
                            ) : (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((txn, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {new Date(txn.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <Badge bg={
                                                        txn.type === 'coin_earned' ? 'success' :
                                                        txn.type === 'coin_spent' ? 'danger' :
                                                        'info'
                                                    }>
                                                        {txn.type}
                                                    </Badge>
                                                </td>
                                                <td>{txn.description}</td>
                                                <td>
                                                    {txn.amount > 0 ? '+' : ''}
                                                    {txn.amount} {txn.currency === 'coins' ? '💎' : '৳'}
                                                </td>
                                                <td>
                                                    <Badge bg={txn.status === 'completed' ? 'success' : 'warning'}>
                                                        {txn.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;

