import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can log the error to an error reporting service
        console.error("Error caught by error boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render a fallback UI or redirect here
            return (
                <div>
                    <h1>Something went wrong.</h1>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
