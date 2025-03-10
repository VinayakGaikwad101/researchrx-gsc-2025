import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

// Import screens
import Welcome from './src/screens/Welcome/Welcome';
import UserType from './src/screens/Welcome/UserType';
import PatientLogin from './src/screens/Patient/PatientLogin';
import PatientRegister from './src/screens/Patient/PatientRegister';
import ResearcherLogin from './src/screens/Researcher/ResearcherLogin';
import ResearcherRegister from './src/screens/Researcher/ResearcherRegister';

const Stack = createNativeStackNavigator();
const WelcomeStack = createNativeStackNavigator();
const PatientStack = createNativeStackNavigator();
const ResearcherStack = createNativeStackNavigator();

const PatientAuthNavigator = () => (
  <PatientStack.Navigator>
    <PatientStack.Screen 
      name="Login" 
      component={PatientLogin}
      options={{ headerShown: false }}
    />
    <PatientStack.Screen 
      name="Register" 
      component={PatientRegister}
      options={{
        title: 'Patient Registration',
        headerTintColor: '#007AFF',
      }}
    />
  </PatientStack.Navigator>
);

const ResearcherAuthNavigator = () => (
  <ResearcherStack.Navigator>
    <ResearcherStack.Screen 
      name="Login" 
      component={ResearcherLogin}
      options={{ headerShown: false }}
    />
    <ResearcherStack.Screen 
      name="Register" 
      component={ResearcherRegister}
      options={{
        title: 'Researcher Registration',
        headerTintColor: '#007AFF',
      }}
    />
  </ResearcherStack.Navigator>
);

const WelcomeNavigator = () => (
  <WelcomeStack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animation: Platform.OS === 'web' ? 'none' : 'default',
    }}
  >
    <WelcomeStack.Screen name="WelcomeScreen" component={Welcome} />
    <WelcomeStack.Screen name="UserType" component={UserType} />
    <WelcomeStack.Screen name="PatientAuth" component={PatientAuthNavigator} />
    <WelcomeStack.Screen name="ResearcherAuth" component={ResearcherAuthNavigator} />
  </WelcomeStack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer
      {...(Platform.OS === 'web' && {
        linking: {
          prefixes: ['http://localhost:19006', 'https://researchrx.com'],
          config: {
            screens: {
              Welcome: {
                screens: {
                  WelcomeScreen: '',
                  UserType: 'choose-role',
                  PatientAuth: {
                    screens: {
                      Login: 'patient/login',
                      Register: 'patient/register',
                    },
                  },
                  ResearcherAuth: {
                    screens: {
                      Login: 'researcher/login',
                      Register: 'researcher/register',
                    },
                  },
                },
              },
            },
          },
        },
      })}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
