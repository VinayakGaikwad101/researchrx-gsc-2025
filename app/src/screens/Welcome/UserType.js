import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { styles } from './UserType.style';

const UserType = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState(null);

  const handleOptionPress = (type) => {
    setSelectedType(type);
    if (type === 'Patient') {
      navigation.navigate('PatientAuth', { screen: 'Login' });
    } else {
      navigation.navigate('ResearcherAuth', { screen: 'Login' });
    }
  };

  const renderOption = (type, title, description) => {
    const isSelected = selectedType === type;
    const optionStyles = [
      styles.option,
      isSelected && styles.optionSelected
    ];

    return (
      <TouchableOpacity 
        style={optionStyles}
        onPress={() => handleOptionPress(type)}
        {...(Platform.OS === 'web' && {
          role: 'radio',
          'aria-checked': isSelected,
          tabIndex: 0,
          onClick: () => handleOptionPress(type),
          onKeyPress: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleOptionPress(type);
            }
          }
        })}
      >
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you would like to use ResearchRx
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {renderOption(
            'Researcher',
            "I'm a Researcher",
            'Conduct research, recruit participants, and manage studies'
          )}

          {renderOption(
            'Patient',
            "I'm a Patient",
            'Participate in studies and contribute to medical research'
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserType;
