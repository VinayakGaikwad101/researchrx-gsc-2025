import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";

// Import screens
import Welcome from "./src/screens/Welcome/Welcome";
import UserType from "./src/screens/Welcome/UserType";
import PatientLogin from "./src/screens/Patient/PatientLogin";
import PatientRegister from "./src/screens/Patient/PatientRegister";
import PatientForgotPassword from "./src/screens/Patient/PatientForgotPassword";
import PatientHome from "./src/screens/Patient/PatientHome";
import ResearcherLogin from "./src/screens/Researcher/ResearcherLogin";
import ResearcherRegister from "./src/screens/Researcher/ResearcherRegister";
import ResearcherForgotPassword from "./src/screens/Researcher/ResearcherForgotPassword";
import ResearcherHome from "./src/screens/Researcher/ResearcherHome";

const Stack = createNativeStackNavigator();
const WelcomeStack = createNativeStackNavigator();
const PatientAuthStack = createNativeStackNavigator();
const ResearcherAuthStack = createNativeStackNavigator();

const PatientAuthNavigator = () => (
  <PatientAuthStack.Navigator>
    <PatientAuthStack.Screen
      name="PatientLogin"
      component={PatientLogin}
      options={{ headerShown: false }}
    />
    <PatientAuthStack.Screen
      name="PatientRegister"
      component={PatientRegister}
      options={{
        title: "Patient Registration",
        headerTintColor: "#007AFF",
      }}
    />
    <PatientAuthStack.Screen
      name="PatientForgotPassword"
      component={PatientForgotPassword}
      options={{
        title: "Forgot Password",
        headerTintColor: "#007AFF",
      }}
    />
  </PatientAuthStack.Navigator>
);

const ResearcherAuthNavigator = () => (
  <ResearcherAuthStack.Navigator>
    <ResearcherAuthStack.Screen
      name="ResearcherLogin"
      component={ResearcherLogin}
      options={{ headerShown: false }}
    />
    <ResearcherAuthStack.Screen
      name="ResearcherRegister"
      component={ResearcherRegister}
      options={{
        title: "Researcher Registration",
        headerTintColor: "#007AFF",
      }}
    />
    <ResearcherAuthStack.Screen
      name="ResearcherForgotPassword"
      component={ResearcherForgotPassword}
      options={{
        title: "Forgot Password",
        headerTintColor: "#007AFF",
      }}
    />
  </ResearcherAuthStack.Navigator>
);

const WelcomeNavigator = () => (
  <WelcomeStack.Navigator
    screenOptions={{
      headerShown: false,
      animation: Platform.OS === "web" ? "none" : "default",
    }}
  >
    <WelcomeStack.Screen name="WelcomeScreen" component={Welcome} />
    <WelcomeStack.Screen name="UserType" component={UserType} />
    <WelcomeStack.Screen name="PatientAuth" component={PatientAuthNavigator} />
    <WelcomeStack.Screen
      name="ResearcherAuth"
      component={ResearcherAuthNavigator}
    />
  </WelcomeStack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer
      {...(Platform.OS === "web" && {
        linking: {
          prefixes: ["http://localhost:19006", "https://researchrx.com"],
          config: {
            screens: {
              Welcome: {
                screens: {
                  WelcomeScreen: "",
                  UserType: "choose-role",
                  PatientAuth: {
                    screens: {
                      Login: "patient/login",
                      Register: "patient/register",
                      ForgotPassword: "patient/forgot-password",
                    },
                  },
                  ResearcherAuth: {
                    screens: {
                      Login: "researcher/login",
                      Register: "researcher/register",
                      ForgotPassword: "researcher/forgot-password",
                    },
                  },
                },
              },
              PatientHome: "patient/home",
              ResearcherHome: "researcher/home",
            },
          },
        },
      })}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeNavigator} />
        <Stack.Screen name="PatientHome" component={PatientHome} />
        <Stack.Screen name="ResearcherHome" component={ResearcherHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
