import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MMKV } from 'react-native-mmkv';
import { useAuth } from '@/store/AuthProvider';
import { useTheme } from '@/styles/ThemeProvider';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { DrawerContent } from '@/components/navigation/DrawerContent';

// Import screens
import { SplashScreen } from '@/screens/SplashScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { SignInScreen } from '@/screens/auth/SignInScreen';
import { SignUpScreen } from '@/screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { OTPVerificationScreen } from '@/screens/auth/OTPVerificationScreen';
import { BiometricSetupScreen } from '@/screens/auth/BiometricSetupScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { NotificationCenterScreen } from '@/screens/NotificationCenterScreen';
import { WishlistScreen } from '@/screens/WishlistScreen';
import { CategoriesScreen } from '@/screens/CategoriesScreen';
import { CartScreen } from '@/screens/cart/CartScreen';
import { OrdersScreen } from '@/screens/orders/OrdersScreen';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';
import { LanguageSelectorScreen } from '@/screens/profile/LanguageSelectorScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { PaymentMethodsScreen } from '@/screens/profile/PaymentMethodsScreen';
import { ProductDetailsScreen } from '@/screens/ProductDetailsScreen';
import { ProductComparisonScreen } from '@/screens/ProductComparisonScreen';
import { ProductReviewsScreen } from '@/screens/ProductReviewsScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { VisualSearchScreen } from '@/screens/VisualSearchScreen';
import { CameraScreen } from '@/screens/CameraScreen';
import { ARViewerScreen } from '@/screens/ARViewerScreen';
import { CheckoutScreen } from '@/screens/checkout/CheckoutScreen';
import { OrderDetailsScreen } from '@/screens/orders/OrderDetailsScreen';
import { OrderTrackingScreen } from '@/screens/orders/OrderTrackingScreen';
import { AddressBookScreen } from '@/screens/profile/AddressBookScreen';

const storage = new MMKV({ id: 'app-storage' });

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon route={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'ShopSphere' }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main Drawer Navigator
function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        header: ({ navigation, route, options }) => (
          <CustomHeader
            title={options.title}
            onMenuPress={() => navigation.openDrawer()}
            showMenu={true}
          />
        ),
      }}
    >
      <Drawer.Screen name="Main" component={MainTabs} />
    </Drawer.Navigator>
  );
}

// Root Stack Navigator
function RootStack() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkInitialScreen = async () => {
      try {
        // Simulate splash screen duration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const hasSeenOnboarding = storage.getBoolean('hasSeenOnboarding');
        
        setShowSplash(false);
        
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking initial screen:', error);
        setShowSplash(false);
      }
    };

    checkInitialScreen();
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainDrawer} />
          <Stack.Screen 
            name="ProductDetails" 
            component={ProductDetailsScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Product Details"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Search"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Camera"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="ARViewer" 
            component={ARViewerScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="AR Viewer"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Checkout"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="OrderDetails" 
            component={OrderDetailsScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Order Details"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="OrderTracking" 
            component={OrderTrackingScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Track Order"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="Wishlist" 
            component={WishlistScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Wishlist"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
          <Stack.Screen 
            name="ProductReviews" 
            component={ProductReviewsScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="NotificationCenter" 
            component={NotificationCenterScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="AddressBook" 
            component={AddressBookScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="PaymentMethods" 
            component={PaymentMethodsScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="ProductComparison" 
            component={ProductComparisonScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="LanguageSelector" 
            component={LanguageSelectorScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="VisualSearch" 
            component={VisualSearchScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ 
              headerShown: true,
              header: ({ navigation }: any) => (
                <CustomHeader
                  title="Settings"
                  onBackPress={() => navigation.goBack()}
                  showBack={true}
                />
              ),
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { colors } = useTheme();

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
          primary: colors.primary,
        },
        dark: colors.background === '#111827',
      }}
    >
      <RootStack />
    </NavigationContainer>
  );
}
