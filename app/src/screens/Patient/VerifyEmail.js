import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { styles } from './Patient.style';
import { ENDPOINTS, apiCall } from '../../config/api.config';

const VerifyEmail = ({ route, navigation }) => {
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiCall(ENDPOINTS.PATIENT_VERIFY_EMAIL, 'POST', {
        code: verificationCode
      });

      if (response.success) {
        Alert.alert(
          'Success',
          'Email verification successful! Please login to continue.',
          [{ 
            text: 'OK', 
            onPress: () => navigation.navigate('PatientLogin')
          }]
        );
      } else {
        Alert.alert('Error', response.message || 'Verification failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall(`${ENDPOINTS.PATIENT_VERIFY_EMAIL}/regenerate-otp`, 'POST', {
        email
      });

      if (response.success) {
        Alert.alert('Success', 'New verification code sent to your email');
      } else {
        Alert.alert('Error', response.message || 'Failed to resend code');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Email</Text>
        
        <Text style={styles.subtitle}>
          Please enter the verification code sent to {email}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
            maxLength={6}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleVerification}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={handleResendCode}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Resend Verification Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;
