import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import { ThemeProvider } from '@/styles/ThemeProvider';
import { AuthProvider } from '@/store/AuthProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppNavigator } from '@/navigation/AppNavigator';

// Initialize MMKV storage
const storage = new MMKV();

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
              <NotificationProvider>
                <AppNavigator />
                <StatusBar style="auto" />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
