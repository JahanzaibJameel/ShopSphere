import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import { User, LoginCredentials, SignupData } from '@/types';

const storage = new MMKV({ id: 'auth-storage' });

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  phoneLogin: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, code: string) => Promise<void>;
  setupBiometric: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Load auth state from storage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedToken = storage.getString('token');
        const savedRefreshToken = storage.getString('refreshToken');
        const savedUser = storage.getString('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setRefreshToken(savedRefreshToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const saveAuthState = (user: User, token: string, refreshToken: string) => {
    setUser(user);
    setToken(token);
    setRefreshToken(refreshToken);
    
    storage.set('user', JSON.stringify(user));
    storage.set('token', token);
    storage.set('refreshToken', refreshToken);
  };

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    
    storage.delete('user');
    storage.delete('token');
    storage.delete('refreshToken');
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        preferences: {
          theme: 'system',
          language: 'en',
          currency: 'USD',
          notifications: {
            push: true,
            email: true,
            sms: false,
            orderUpdates: true,
            promotions: false,
          },
          privacy: {
            shareData: false,
            analytics: true,
            marketing: false,
          },
        },
        addresses: [],
        paymentMethods: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token';
      const mockRefreshToken = 'mock-refresh-token';

      saveAuthState(mockUser, mockToken, mockRefreshToken);
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        preferences: {
          theme: 'system',
          language: 'en',
          currency: 'USD',
          notifications: {
            push: true,
            email: true,
            sms: false,
            orderUpdates: true,
            promotions: false,
          },
          privacy: {
            shareData: false,
            analytics: true,
            marketing: false,
          },
        },
        addresses: [],
        paymentMethods: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token';
      const mockRefreshToken = 'mock-refresh-token';

      saveAuthState(mockUser, mockToken, mockRefreshToken);
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthState();
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setIsLoading(true);
      
      // Mock social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        firstName: 'Social',
        lastName: 'User',
        preferences: {
          theme: 'system',
          language: 'en',
          currency: 'USD',
          notifications: {
            push: true,
            email: true,
            sms: false,
            orderUpdates: true,
            promotions: false,
          },
          privacy: {
            shareData: false,
            analytics: true,
            marketing: false,
          },
        },
        addresses: [],
        paymentMethods: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-social-token';
      const mockRefreshToken = 'mock-refresh-token';

      saveAuthState(mockUser, mockToken, mockRefreshToken);
    } catch (error) {
      throw new Error(`${provider} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const phoneLogin = async (phone: string) => {
    try {
      setIsLoading(true);
      
      // Mock phone login - send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send an OTP to the phone number
      console.log(`OTP sent to ${phone}`);
    } catch (error) {
      throw new Error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, code: string) => {
    try {
      setIsLoading(true);
      
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code !== '123456') {
        throw new Error('Invalid OTP code');
      }

      const mockUser: User = {
        id: '1',
        email: 'phone@example.com',
        firstName: 'Phone',
        lastName: 'User',
        phone,
        preferences: {
          theme: 'system',
          language: 'en',
          currency: 'USD',
          notifications: {
            push: true,
            email: true,
            sms: true,
            orderUpdates: true,
            promotions: false,
          },
          privacy: {
            shareData: false,
            analytics: true,
            marketing: false,
          },
        },
        addresses: [],
        paymentMethods: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-phone-token';
      const mockRefreshToken = 'mock-refresh-token';

      saveAuthState(mockUser, mockToken, mockRefreshToken);
    } catch (error) {
      throw new Error('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupBiometric = async () => {
    try {
      setIsLoading(true);
      
      // Mock biometric setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would check for biometric availability and prompt user
      console.log('Biometric authentication set up successfully');
    } catch (error) {
      throw new Error('Biometric setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Mock profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...data, updatedAt: new Date().toISOString() };
        setUser(updatedUser);
        storage.set('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw new Error('Profile update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuthToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Mock token refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newToken = 'mock-refreshed-token';
      const newRefreshToken = 'mock-new-refresh-token';
      
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      storage.set('token', newToken);
      storage.set('refreshToken', newRefreshToken);
    } catch (error) {
      clearAuthState();
      throw new Error('Session expired. Please login again.');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    socialLogin,
    phoneLogin,
    verifyOTP,
    setupBiometric,
    updateProfile,
    refreshAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
