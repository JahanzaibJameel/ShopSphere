import React from 'react';
import { Text } from 'react-native';

interface TabBarIconProps {
  route: string;
  focused: boolean;
  color: string;
  size: number;
}

export function TabBarIcon({ route, focused, color, size }: TabBarIconProps) {
  const getIcon = () => {
    switch (route) {
      case 'Home':
        return focused ? '🏠' : '🏡';
      case 'Categories':
        return focused ? '📂' : '📁';
      case 'Cart':
        return focused ? '🛒' : '🛍️';
      case 'Orders':
        return focused ? '📦' : '📮';
      case 'Profile':
        return focused ? '👤' : '👥';
      default:
        return '📱';
    }
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {getIcon()}
    </Text>
  );
}
