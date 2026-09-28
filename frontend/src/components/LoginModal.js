import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { COLORS } from '../theme/colors';
import {
  loginWithAuthApi,
  registerUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../config/api';

export const LoginModal = ({ visible, onLoginSuccess, onClose }) => {
  // Modes: 'LOGIN' | 'REGISTER' | 'FORGOT' | 'RESET'
  const [mode, setMode] = useState('LOGIN');

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Email or Mobile Number
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Reset Fields
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [demoOtp, setDemoOtp] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetFormState = () => {
    setError('');
    setSuccessMsg('');
    setDemoOtp('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetFormState();
  };

  // 1. Handle Login (Mobile Number or Email + Password)
  const handleLoginSubmit = async () => {
    if (!identifier.trim()) {
      setError('Please enter your Mobile Number or Email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await loginWithAuthApi(identifier.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Register / Sign Up
  const handleRegisterSubmit = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please provide an Email or Mobile Number');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newUser = await registerUserApi({
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password
      });
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password (Request OTP)
  const handleForgotPasswordSubmit = async () => {
    if (!identifier.trim()) {
      setError('Please enter your registered Email or Mobile Number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await forgotPasswordApi(identifier.trim());
      setDemoOtp(res.otp); // Demo code display
      setSuccessMsg(`OTP sent successfully! Demo Code: ${res.otp}`);
      setMode('RESET');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Forgot password request failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Reset Password with OTP
  const handleResetPasswordSubmit = async () => {
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setError('New password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPasswordApi({
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword
      });
      setSuccessMsg('Password reset successful! Please log in with your new password.');
      setTimeout(() => {
        switchMode('LOGIN');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header Title */}
            <Text style={styles.title}>
              {mode === 'LOGIN' && 'Sign In to Chat'}
              {mode === 'REGISTER' && 'Create Account'}
              {mode === 'FORGOT' && 'Forgot Password'}
              {mode === 'RESET' && 'Reset Password'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'LOGIN' && 'Enter your Mobile Number or Email and Password'}
              {mode === 'REGISTER' && 'Fill in details below to create your account'}
              {mode === 'FORGOT' && 'Enter your registered Mobile Number or Email to receive OTP'}
              {mode === 'RESET' && 'Enter the OTP code and your new password'}
            </Text>

            {/* Error & Success Banners */}
            {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
            {successMsg ? <Text style={styles.successText}>✅ {successMsg}</Text> : null}

            {/* Mode 1: LOGIN FORM */}
            {mode === 'LOGIN' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mobile Number or Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +123456789 or user@email.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter password"
                    placeholderTextColor={COLORS.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeText}>{showPassword ? '👁️' : '🔒'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.forgotLink}
                  onPress={() => switchMode('FORGOT')}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleLoginSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Log In</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => switchMode('REGISTER')}>
                    <Text style={styles.switchText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Mode 2: REGISTER FORM */}
            {mode === 'REGISTER' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name / Username *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. John Doe"
                  placeholderTextColor={COLORS.textMuted}
                  value={username}
                  onChangeText={setUsername}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1234567890"
                  placeholderTextColor={COLORS.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="At least 4 characters"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />

                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleRegisterSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => switchMode('LOGIN')}>
                    <Text style={styles.switchText}>Log In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Mode 3: FORGOT PASSWORD FORM */}
            {mode === 'FORGOT' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Registered Mobile Number or Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email or phone"
                  placeholderTextColor={COLORS.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleForgotPasswordSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Send Reset OTP</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => switchMode('LOGIN')}>
                  <Text style={styles.backButtonText}>← Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Mode 4: RESET PASSWORD FORM */}
            {mode === 'RESET' && (
              <View style={styles.formGroup}>
                {demoOtp ? (
                  <View style={styles.otpBox}>
                    <Text style={styles.otpLabel}>DEMO OTP CODE:</Text>
                    <Text style={styles.otpCode}>{demoOtp}</Text>
                  </View>
                ) : null}

                <Text style={styles.label}>Enter 6-Digit OTP Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 123456"
                  placeholderTextColor={COLORS.textMuted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor={COLORS.textMuted}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                />

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleResetPasswordSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => switchMode('LOGIN')}>
                  <Text style={styles.backButtonText}>← Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  formGroup: {
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  eyeText: {
    fontSize: 16,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 6,
    marginBottom: 14,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
  },
  successText: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  switchLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  switchText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 14,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  otpBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
    letterSpacing: 1,
  },
  otpCode: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 4,
    marginTop: 2,
  }
});
