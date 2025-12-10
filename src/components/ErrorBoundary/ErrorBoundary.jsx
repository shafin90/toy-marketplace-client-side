import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

/**
 * Error Boundary Component
 * Catches React component errors and displays a fallback UI
 * 
 * Layer: Presentation Layer (Error Handling)
 */
class ErrorBoundaryClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (in production, send to error tracking service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo
        });

        // In production, you would send this to an error tracking service
        // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null 
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            return (
                <ErrorFallback 
                    error={this.state.error}
                    onReset={this.handleReset}
                    onGoHome={() => {
                        this.handleReset();
                        window.location.href = '/';
                    }}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * Error Fallback UI Component
 */
const ErrorFallback = ({ error, onReset, onGoHome }) => {
    return (
        <Container className="my-5">
            <Card className="text-center">
                <Card.Body className="py-5">
                    <h1 className="display-1 mb-4">⚠️</h1>
                    <h2 className="mb-3">Something went wrong</h2>
                    <p className="text-muted mb-4">
                        We're sorry, but something unexpected happened. 
                        Please try refreshing the page or go back to the home page.
                    </p>
                    
                    {process.env.NODE_ENV === 'development' && error && (
                        <details className="text-start mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <summary className="mb-2" style={{ cursor: 'pointer' }}>
                                <strong>Error Details (Development Only)</strong>
                            </summary>
                            <pre className="bg-light p-3 rounded" style={{ fontSize: '12px', overflow: 'auto' }}>
                                {error.toString()}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        </details>
                    )}
                    
                    <div className="d-flex gap-2 justify-content-center">
                        <Button variant="primary" onClick={onReset}>
                            Try Again
                        </Button>
                        <Button variant="outline-secondary" onClick={onGoHome}>
                            Go Home
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

/**
 * Error Boundary with Router Navigation
 * Wraps the class component with router navigation
 */
const ErrorBoundary = ({ children }) => (
    <ErrorBoundaryClass>
        {children}
    </ErrorBoundaryClass>
);

export default ErrorBoundary;

