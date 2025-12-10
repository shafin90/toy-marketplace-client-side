import { Spinner } from 'react-bootstrap';

/**
 * Loading Spinner Component
 * Used as fallback for Suspense boundaries
 */
const LoadingSpinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
};

export default LoadingSpinner;

