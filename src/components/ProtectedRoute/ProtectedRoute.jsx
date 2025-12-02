import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Provider';

/**
 * Protected Route Component
 * Protects routes based on user role
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, userRole } = useContext(AuthContext);

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If role is required and user doesn't have it, redirect to home
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

