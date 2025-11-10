import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when a component throws an error
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Here you could log to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Reload the page to reset the app state
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <Alert variant="danger">
              <Alert.Heading>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Something went wrong
              </Alert.Heading>
              <p>
                The application encountered an unexpected error. This has been logged and we'll look into it.
              </p>
              {this.state.error && import.meta.env.DEV && (
                <details style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                    Error Details (Development Mode)
                  </summary>
                  <pre style={{ 
                    marginTop: '0.5rem', 
                    padding: '1rem', 
                    backgroundColor: '#1f2937', 
                    color: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'auto'
                  }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              <div className="mt-3">
                <Button variant="primary" onClick={this.handleReset}>
                  Reload Application
                </Button>
              </div>
            </Alert>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
