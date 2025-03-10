import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Platform } from 'react-native';
import { styles } from './Welcome.style';

const Welcome = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          accessibilityLabel="ResearchRx Logo"
        />
        
        <Text style={styles.title}>Welcome to ResearchRx</Text>
        
        <Text style={styles.description}>
          ResearchRx is a platform connecting medical researchers with patients 
          to advance healthcare research and improve patient outcomes. Join us 
          in making a difference in medical research.
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('UserType')}
          {...(Platform.OS === 'web' && {
            role: 'button',
            tabIndex: 0,
            onClick: () => navigation.navigate('UserType'),
            onKeyPress: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigation.navigate('UserType');
              }
            }
          })}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
