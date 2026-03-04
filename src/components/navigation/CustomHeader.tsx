import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

interface CustomHeaderProps {
  title?: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  showBack?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  rightComponent?: React.ReactNode;
}

export function CustomHeader({
  title,
  onBackPress,
  onMenuPress,
  onSearchPress,
  onCartPress,
  showBack = false,
  showMenu = false,
  showSearch = false,
  showCart = false,
  rightComponent,
}: CustomHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
            <Text style={[styles.icon, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
            <Text style={[styles.icon, { color: colors.text }]}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {title && (
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {showSearch && (
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <Text style={[styles.icon, { color: colors.text }]}>🔍</Text>
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity style={styles.iconButton} onPress={onCartPress}>
            <Text style={[styles.icon, { color: colors.text }]}>🛒</Text>
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
