// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

export interface OTPData {
  phone: string;
  code: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences: UserPreferences;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  isDefault: boolean;
  card?: {
    last4: string;
    brand: string;
    expiryMonth: string;
    expiryYear: string;
  };
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  brand: Brand;
  categories: Category[];
  price: Price;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  inventory: Inventory;
  ratings: Rating;
  seo: SEO;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  children?: Category[];
}

export interface Price {
  current: number;
  original?: number;
  currency: string;
  discount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  type: 'main' | 'gallery' | 'thumbnail';
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: Price;
  image?: string;
  attributes: Record<string, string>;
  inventory: {
    quantity: number;
    isInStock: boolean;
  };
}

export interface ProductAttribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  value: string | number | boolean;
  required: boolean;
}

export interface Inventory {
  quantity: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  isInStock: boolean;
  reserved: number;
}

export interface Rating {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
}

// Cart Types
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  coupon?: Coupon;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: Price;
  addedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  applicableProducts?: string[];
  expiresAt?: string;
  isActive: boolean;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  tracking?: TrackingInfo;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: Price;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  helpful: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface SearchFilters {
  query?: string;
  categories?: string[];
  brands?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
  inStock?: boolean;
  freeShipping?: boolean;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  facets: SearchFacet[];
}

export interface SearchFacet {
  name: string;
  type: 'category' | 'brand' | 'price_range' | 'rating';
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
  isSelected: boolean;
}

// API Types
export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
  Profile: undefined;
  Settings: undefined;
  Search: undefined;
  Camera: undefined;
  ARViewer: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTPVerification: { phone: string };
  BiometricSetup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface SharedValueConfig {
  value: number | string | boolean;
  config?: AnimationConfig;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  type: 'order' | 'promotion' | 'delivery' | 'system';
  timestamp: string;
  isRead: boolean;
}

export interface PushNotificationData {
  orderId?: string;
  productId?: string;
  promotionId?: string;
  type: string;
  action?: string;
}

// AI/ML Types
export interface AIRecommendation {
  id: string;
  type: 'product' | 'category' | 'search';
  confidence: number;
  product?: Product;
  category?: Category;
  query?: string;
  reason: string;
}

export interface VisualSearchResult {
  product?: Product;
  similarProducts: Product[];
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  timestamp: string;
}

export interface UserBehavior {
  pageViews: string[];
  searchQueries: string[];
  productViews: string[];
  cartAdditions: string[];
  purchases: string[];
  sessionDuration: number;
  deviceInfo: {
    platform: string;
    version: string;
    model: string;
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    white: string;
    black: string;
    backgroundSecondary: string;
  };
  spacing: Record<string, number>;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';

// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}
