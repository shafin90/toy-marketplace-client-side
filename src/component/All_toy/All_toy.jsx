import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/Provider';
import { Container, Row, Col } from 'react-bootstrap';
import PageTitle from '../PageTitle/PageTitle';
import SearchFilter from '../SearchFilter/SearchFilter';
import toyService from '../../services/toyService';
import MyCard from '../MyCard/MyCard';

const AllToy = () => {
  const { user } = useContext(AuthContext);

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async (filters = {}) => {
    try {
      setLoading(true);
      const toys = await toyService.getAllToys(filters);
      setFilteredData(toys);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(toys.map(t => t.sub_category || t.subcategory).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching toys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    // Build query params
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    fetchToys(Object.fromEntries(params));
  };

  return (
    <Container className="my-5">
      <PageTitle title={"All Toys"}></PageTitle>
      
      <Row>
        {/* Left Side - Filter Options */}
        <Col lg={3} md={4} className="mb-4">
          <div className="sticky-top" style={{ top: '20px' }}>
            <SearchFilter onFilterChange={handleFilterChange} categories={categories} />
          </div>
        </Col>

        {/* Right Side - Cards */}
        <Col lg={9} md={8}>
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center my-5">
              <h4>No toys found</h4>
              <p className="text-muted">Try adjusting your search filters.</p>
            </div>
          ) : (
            <Row>
              {filteredData.map((toy) => (
                <Col lg={6} md={6} sm={12} xs={12} key={toy._id} className="mb-4">
                  <div style={{ maxWidth: '100%' }}>
                    <MyCard info={toy} />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AllToy;
