import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { styles } from './Patient.style';
import { ENDPOINTS, apiCall } from '../../config/api.config';

const PatientForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiCall(ENDPOINTS.PATIENT_FORGOT_PASSWORD, 'POST', {
        email
      });

      if (response.success) {
        Alert.alert(
          'Success',
          'Password reset instructions have been sent to your email.',
          [{ 
            text: 'OK', 
            onPress: () => navigation.navigate('PatientLogin')
          }]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to process request');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PatientForgotPassword;
