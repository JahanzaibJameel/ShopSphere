import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/store/AuthProvider';
import { useTheme } from '@/styles/ThemeProvider';

export function SignInScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { login, socialLogin, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await socialLogin(provider);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : `${provider} login failed`);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const navigateToPhoneLogin = () => {
    navigation.navigate('OTPVerification', { phone: '' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to continue shopping
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.surface,
                borderColor: errors.email ? colors.error : colors.border,
                color: colors.text,
              }
            ]}
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.email}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.surface,
                borderColor: errors.password ? colors.error : colors.border,
                color: colors.text,
              }
            ]}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
          />
          {errors.password && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.password}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={navigateToForgotPassword}
        >
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signInButton, { backgroundColor: colors.primary }]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={[styles.signInText, { color: '#ffffff' }]}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: colors.surface, borderColor: colors.border }
          ]}
          onPress={() => handleSocialLogin('google')}
        >
          <Text style={styles.socialButtonText}>🔗 Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: colors.surface, borderColor: colors.border }
          ]}
          onPress={() => handleSocialLogin('facebook')}
        >
          <Text style={styles.socialButtonText}>📘 Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: colors.surface, borderColor: colors.border }
          ]}
          onPress={() => handleSocialLogin('apple')}
        >
          <Text style={styles.socialButtonText}>🍎 Apple</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.phoneButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={navigateToPhoneLogin}
      >
        <Text style={[styles.phoneButtonText, { color: colors.primary }]}>
          📱 Sign in with Phone
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={navigateToSignUp}>
          <Text style={[styles.signUpText, { color: colors.primary }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    marginBottom: 20,
  },
  socialButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  phoneButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  phoneButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
