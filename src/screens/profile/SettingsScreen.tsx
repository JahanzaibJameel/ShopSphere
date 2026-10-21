import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemeMode } from '@/types';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  navigation: any;
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'light', label: 'Light', icon: '☀️' },
    { mode: 'dark', label: 'Dark', icon: '🌙' },
    { mode: 'system', label: 'System', icon: '⚙️' },
  ];

  const renderSettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={title}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Theme</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Choose how the app looks
            </Text>
            <View style={styles.themeOptions}>
              {themeOptions.map(({ mode, label, icon }) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themeOption,
                    { borderColor: colors.border },
                    themeMode === mode && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setThemeMode(mode)}
                  accessibilityRole="button"
                  accessibilityLabel={`Set theme to ${label}`}
                  accessibilityState={{ selected: themeMode === mode }}
                >
                  <Text style={styles.themeIcon}>{icon}</Text>
                  <Text
                    style={[
                      styles.themeLabel,
                      { color: themeMode === mode ? '#ffffff' : colors.text },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {renderSettingItem({
              icon: '🌙',
              title: 'Dark Mode',
              subtitle: isDark ? 'Currently dark' : 'Currently light',
              rightElement: (
                <Switch
                  value={isDark}
                  onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#ffffff"
                  accessibilityLabel="Toggle dark mode"
                />
              ),
            })}
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>GENERAL</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {renderSettingItem({
              icon: '🌐',
              title: 'Language',
              subtitle: 'English',
              onPress: () => navigation.navigate('LanguageSelector'),
            })}
            {renderSettingItem({
              icon: '🔔',
              title: 'Notifications',
              subtitle: 'Manage notification preferences',
              onPress: () => navigation.navigate('NotificationCenter'),
            })}
            {renderSettingItem({
              icon: '📍',
              title: 'Addresses',
              subtitle: 'Manage shipping addresses',
              onPress: () => navigation.navigate('AddressBook'),
            })}
            {renderSettingItem({
              icon: '💳',
              title: 'Payment Methods',
              subtitle: 'Manage saved cards',
              onPress: () => navigation.navigate('PaymentMethods'),
            })}
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SECURITY</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {renderSettingItem({
              icon: '🔐',
              title: 'Biometric Login',
              subtitle: 'Use fingerprint or face ID',
              rightElement: (
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#ffffff"
                  accessibilityLabel="Toggle biometric login"
                />
              ),
            })}
            {renderSettingItem({
              icon: '🔒',
              title: 'Change Password',
              subtitle: 'Update your password',
              onPress: () => {},
            })}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {renderSettingItem({
              icon: 'ℹ️',
              title: 'App Version',
              subtitle: '1.0.0',
            })}
            {renderSettingItem({
              icon: '📄',
              title: 'Terms of Service',
              onPress: () => {},
            })}
            {renderSettingItem({
              icon: '🛡️',
              title: 'Privacy Policy',
              onPress: () => {},
            })}
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: { fontSize: 16, fontWeight: '600', marginRight: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', padding: 16, paddingBottom: 4 },
  cardSubtitle: { fontSize: 13, paddingHorizontal: 16, paddingBottom: 12 },
  themeOptions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  themeIcon: { fontSize: 20 },
  themeLabel: { fontSize: 13, fontWeight: '500' },
  divider: { height: 1, marginHorizontal: 16 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  settingIcon: { fontSize: 20 },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '500' },
  settingSubtitle: { fontSize: 12, marginTop: 2 },
  settingRight: { marginLeft: 8 },
  spacer: { height: 40 },
});
