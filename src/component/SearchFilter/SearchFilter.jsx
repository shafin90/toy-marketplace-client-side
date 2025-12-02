import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const SearchFilter = ({ onFilterChange, categories = [] }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: ''
    });

    const handleChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClear = () => {
        const clearedFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            sortBy: ''
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0">Search & Filter Toys</h5>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Search</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by name..."
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={filters.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sort By</Form.Label>
                        <Form.Select
                            value={filters.sortBy}
                            onChange={(e) => handleChange('sortBy', e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Min Price (৳)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="0"
                            value={filters.minPrice}
                            onChange={(e) => handleChange('minPrice', e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Max Price (৳)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="10000"
                            value={filters.maxPrice}
                            onChange={(e) => handleChange('maxPrice', e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="danger" onClick={handleClear} className="w-100">
                        Clear All Filters
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default SearchFilter;

