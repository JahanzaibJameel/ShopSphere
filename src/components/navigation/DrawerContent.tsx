import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { useAuth } from '@/store/AuthProvider';

interface DrawerContentProps {
  navigation: any;
}

export function DrawerContent({ navigation }: DrawerContentProps) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: '1', title: 'Home', icon: '🏠', screen: 'Main' },
    { id: '2', title: 'Categories', icon: '📂', screen: 'Categories' },
    { id: '3', title: 'Orders', icon: '📦', screen: 'Orders' },
    { id: '4', title: 'Wishlist', icon: '❤️', screen: 'Wishlist' },
    { id: '5', title: 'Settings', icon: '⚙️', screen: 'Settings' },
    { id: '6', title: 'Help & Support', icon: '💬', screen: 'Support' },
    { id: '7', title: 'About', icon: 'ℹ️', screen: 'About' },
  ];

  const handleMenuItemPress = (screen: string) => {
    navigation.navigate(screen);
    navigation.closeDrawer();
  };

  const handleLogout = async () => {
    await logout();
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.profileContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.white }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.firstName?.[0] || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.white }]}>
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : 'Guest User'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.white, opacity: 0.8 }]}>
              {user?.email || 'guest@example.com'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }
              ]}
              onPress={() => handleMenuItemPress(item.screen)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuTitle, { color: colors.text }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[
            styles.menuItem,
            styles.logoutItem,
            { backgroundColor: colors.error + '20', borderColor: colors.error }
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuTitle, { color: colors.error }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          ShopSphere v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
          Made with ❤️ for shoppers
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuSection: {
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  logoutItem: {
    marginTop: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
