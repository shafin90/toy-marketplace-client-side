import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../Provider/Provider';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import PageTitle from '../PageTitle/PageTitle';
import SearchFilter from '../SearchFilter/SearchFilter';
import toyService from '../../services/toyService';
import MyCard from '../MyCard/MyCard';
import CardSkeleton from '../../components/LoadingSkeleton/CardSkeleton';
import { useQuery } from '@tanstack/react-query';

const AllToy = () => {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({});
  const [visibleCount, setVisibleCount] = useState(20);
  const [categories, setCategories] = useState([]);
  const loadMoreRef = useRef(null);

  const { data: toys = [], isLoading, isFetching } = useQuery(['toys', filters], () => toyService.getAllToys(filters), {
    keepPreviousData: true
  });

  useEffect(() => {
    const uniqueCategories = [...new Set(toys.map(t => t.sub_category || t.subcategory).filter(Boolean))];
    setCategories(uniqueCategories);
  }, [toys]);

  useEffect(() => {
    setVisibleCount(20);
  }, [filters]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 20, toys.length));
        }
      });
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [toys.length]);

  const isLoadingState = isLoading && toys.length === 0;
  const visibleToys = useMemo(() => toys.slice(0, visibleCount), [toys, visibleCount]);

  const handleFilterChange = (filters) => {
    // Build query params
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    setFilters(Object.fromEntries(params));
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
          {isLoadingState ? (
            <Row>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Col lg={6} md={6} sm={12} xs={12} key={idx} className="mb-4">
                  <CardSkeleton />
                </Col>
              ))}
            </Row>
          ) : toys.length === 0 ? (
            <div className="text-center my-5">
              <h4>No toys found</h4>
              <p className="text-muted">Try adjusting your search filters.</p>
            </div>
          ) : (
            <Row>
              {visibleToys.map((toy) => (
                <Col lg={6} md={6} sm={12} xs={12} key={toy._id} className="mb-4">
                  <div style={{ maxWidth: '100%' }}>
                    <MyCard info={toy} />
                  </div>
                </Col>
              ))}
              <div ref={loadMoreRef} className="w-100 text-center my-3">
                {isFetching && <Spinner animation="border" size="sm" />}
                {visibleToys.length < toys.length && !isFetching && (
                  <span className="text-muted">Scroll to load more...</span>
                )}
              </div>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AllToy;
