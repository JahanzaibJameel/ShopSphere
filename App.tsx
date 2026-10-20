import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/styles/ThemeProvider';
import { AuthProvider } from '@/store/AuthProvider';
import { WishlistProvider } from '@/store/WishlistProvider';
import { InAppNotificationProvider } from '@/store/InAppNotificationProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppNavigator } from '@/navigation/AppNavigator';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <WishlistProvider>
                <InAppNotificationProvider>
                  <NotificationProvider>
                    <AppNavigator />
                    <StatusBar style="auto" />
                  </NotificationProvider>
                </InAppNotificationProvider>
              </WishlistProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
