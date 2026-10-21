import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// Default colors for error fallback when ThemeProvider is not available
const DEFAULT_COLORS = {
  background: '#ffffff',
  text: '#111827', 
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  primary: '#6366f1',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ hasError: true, error, errorInfo });
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (__DEV__) {
      console.log('Error details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error} 
          onRetry={this.handleRetry} 
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
}

function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  // Use default colors - don't call useTheme to avoid context issues
  const colors = DEFAULT_COLORS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.emoji, { color: colors.text }]}>😞</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Oops! Something went wrong
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          We're sorry, but something unexpected happened. 
          Our team has been notified and is working on a fix.
        </Text>
        
        {__DEV__ && error && (
          <View style={styles.errorDetails}>
            <Text style={[styles.errorTitle, { color: colors.error }]}>
              Error Details (Development Mode):
            </Text>
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>
              {error.message}
            </Text>
            {error.stack && (
              <Text style={[styles.errorStack, { color: colors.textTertiary }]}>
                {error.stack}
              </Text>
            )}
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: '#ffffff' }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorDetails: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('Error handled by useErrorHandler:', error, errorInfo);
    
    if (__DEV__) {
      console.log('Error details:', {
        error: error.message,
        stack: error.stack,
        errorInfo,
      });
    }
  };

  return { handleError };
}