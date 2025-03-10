import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { styles } from './Patient.style';
import { ENDPOINTS, apiCall } from '../../config/api.config';

const PatientRegister = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiCall(ENDPOINTS.PATIENT_REGISTER, 'POST', {
        email,
        password,
      });
      
      console.log('Registration successful:', response);
      Alert.alert(
        'Success',
        'Registration successful! Please check your email for verification.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      
    } catch (error) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Patient Registration</Text>
        
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
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PatientRegister;
