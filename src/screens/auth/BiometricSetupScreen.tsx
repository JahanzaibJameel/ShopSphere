import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { MMKV } from 'react-native-mmkv';

const { width } = Dimensions.get('window');
const storage = new MMKV({ id: 'biometric-storage' });

interface BiometricState {
  isAvailable: boolean;
  isEnabled: boolean;
  biometricType: string;
}

export function useBiometric() {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    isEnabled: false,
    biometricType: 'Biometrics',
  });

  useEffect(() => {
    // Check availability (mock - in real app use expo-local-authentication)
    const available = Platform.OS !== 'web';
    const enabled = storage.getBoolean('biometricEnabled') || false;
    const type = Platform.OS === 'ios' ? 'Face ID / Touch ID' : 'Fingerprint';

    setState({
      isAvailable: available,
      isEnabled: enabled,
      biometricType: type,
    });
  }, []);

  const toggle = useCallback(async (enable: boolean) => {
    if (enable) {
      // Mock biometric prompt
      Alert.alert(
        'Biometric Authentication',
        `Use ${state.biometricType} to enable biometric login?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              storage.set('biometricEnabled', true);
              setState((prev) => ({ ...prev, isEnabled: true }));
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Disable Biometric Login',
        'Are you sure you want to disable biometric login?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              storage.set('biometricEnabled', false);
              setState((prev) => ({ ...prev, isEnabled: false }));
            },
          },
        ]
      );
    }
  }, [state.biometricType]);

  return { ...state, toggle };
}

interface BiometricSetupScreenProps {
  navigation: any;
}

export function BiometricSetupScreen({ navigation }: BiometricSetupScreenProps) {
  const { colors } = useTheme();
  const { isAvailable, isEnabled, biometricType, toggle } = useBiometric();

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
        <Text style={[styles.title, { color: colors.text }]}>Biometric Login</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.icon}>🔐</Text>
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          {isAvailable ? 'Biometric Authentication' : 'Not Available'}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {isAvailable
            ? `Use ${biometricType} for quick and secure access to your account.`
            : 'Biometric authentication is not available on this device.'}
        </Text>

        {isAvailable && (
          <View style={[styles.toggleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>
                  Enable {biometricType}
                </Text>
                <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={toggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
                accessibilityLabel={`Toggle ${biometricType}`}
              />
            </View>
          </View>
        )}

        {isAvailable && isEnabled && (
          <View style={[styles.infoCard, { backgroundColor: colors.success + '10', borderColor: colors.success }]}>
            <Text style={[styles.infoTitle, { color: colors.success }]}>✓ Biometric login is active</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              You can now use {biometricType} to sign in quickly and securely.
            </Text>
          </View>
        )}

        <View style={styles.benefits}>
          <Text style={[styles.benefitsTitle, { color: colors.text }]}>Benefits</Text>
          {[
            'Faster login without typing passwords',
            'Enhanced security with biometric verification',
            'Works offline - no internet required',
          ].map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <Text style={[styles.benefitBullet, { color: colors.primary }]}>•</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
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
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 40 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  description: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  toggleCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '600' },
  toggleSubtitle: { fontSize: 13, marginTop: 2 },
  infoCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  infoText: { fontSize: 13, lineHeight: 18 },
  benefits: { width: '100%', marginTop: 8 },
  benefitsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, gap: 8 },
  benefitBullet: { fontSize: 16, fontWeight: 'bold' },
  benefitText: { fontSize: 14, flex: 1, lineHeight: 20 },
});
