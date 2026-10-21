import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import { Product } from '@/types';

interface WishlistContextType {
  items: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const storage = new MMKV({ id: 'wishlist-storage' });
const STORAGE_KEY = 'wishlist_items';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = storage.getString(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, []);

  useEffect(() => {
    try {
      storage.set(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }, [items]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const addToWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [product, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [product, ...prev];
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const value: WishlistContextType = {
    items,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    count: items.length,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
