import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Animated } from 'react-native';
import { styles } from './Researcher.style';
import { ENDPOINTS, apiCall, clearAuthData, getAuthUser } from '../../config/api.config';

const ResearcherHome = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnimation = useState(new Animated.Value(-300))[0]; // Start off-screen

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await getAuthUser();
    setUserData(user);
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -300 : 0;
    Animated.spring(sidebarAnimation, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await apiCall(ENDPOINTS.RESEARCHER_LOGOUT, 'POST');
      
      if (response.success) {
        await clearAuthData();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      } else {
        Alert.alert('Error', response.message || 'Logout failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Logout failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={toggleSidebar}
          >
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Welcome, {userData?.firstName || 'Researcher'}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Research Tools</Text>
            {/* Placeholder for research tools */}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Studies</Text>
            {/* Placeholder for recent studies */}
          </View>
        </View>

        {/* Overlay when sidebar is open */}
        {isSidebarOpen && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <Animated.View 
          style={[
            styles.sidebar,
            {
              left: sidebarAnimation,
            },
          ]}
        >
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarHeaderText}>Menu</Text>
          </View>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              // Add navigation to profile or other screens here
            }}
          >
            <Text style={styles.sidebarItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              // Add navigation to research tools or other screens here
            }}
          >
            <Text style={styles.sidebarItemText}>Research Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              // Add navigation to studies or other screens here
            }}
          >
            <Text style={styles.sidebarItemText}>My Studies</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sidebarItem, styles.logoutItem]}
            onPress={() => {
              toggleSidebar();
              handleLogout();
            }}
          >
            <Text style={[styles.sidebarItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ResearcherHome;
