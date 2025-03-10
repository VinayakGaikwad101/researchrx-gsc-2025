# ResearchRx Mobile & Web App

## Project Structure

```
app/
├── src/
│   ├── screens/           # Screen components
│   │   ├── Welcome/      # Welcome & Info screens
│   │   ├── Auth/         # Authentication screens
│   │   │   ├── Researcher/
│   │   │   └── Patient/
│   │   ├── Patient/      # Patient-specific screens
│   │   └── Researcher/   # Researcher-specific screens
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components (buttons, inputs, etc.)
│   │   └── common/      # Common components used across screens
│   ├── styles/          # Global styles and theme configuration
│   ├── navigation/      # Navigation configuration
│   ├── assets/         # Images, fonts, and other static files
│   ├── constants/      # App constants and configuration
│   └── utils/         # Utility functions and helpers
```

## Initial Screens Flow

1. Welcome Screen
   - App information about ResearchRx
   - Continue button

2. User Type Selection
   - Choose between Researcher or Patient

3. Authentication Flow
   - Login Screen (separate for Researcher/Patient)
   - Signup Screen (separate for Researcher/Patient)
   - Forgot Password Screen

## Screen Organization

### Welcome Screens
- Welcome/Welcome.js
- Welcome/Welcome.style.js
- Welcome/UserType.js
- Welcome/UserType.style.js

### Auth Screens
- Auth/Researcher/Login.js
- Auth/Researcher/Login.style.js
- Auth/Researcher/Signup.js
- Auth/Researcher/Signup.style.js
- Auth/Patient/Login.js
- Auth/Patient/Login.style.js
- Auth/Patient/Signup.js
- Auth/Patient/Signup.style.js
- Auth/ForgotPassword.js
- Auth/ForgotPassword.style.js

## Style Guidelines

- Each component and screen has its own style file
- Style files are named `[ComponentName].style.js`
- Use React Native's StyleSheet for mobile and CSS for web
- Follow consistent naming conventions
- Use theme constants for colors, fonts, and sizes

## Getting Started

1. Install dependencies:
```bash
cd app
npm install
```

2. Required dependencies:
```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# Web support
npx expo install react-native-web react-dom @expo/webpack-config
```

3. Start the development server:
```bash
# For mobile
npx expo start

# For web
npx expo start --web
```

4. Run on your device:
- Press 'a' for Android
- Press 'i' for iOS
- Press 'w' for Web
- Scan QR code with Expo Go app for mobile testing

## Development Guidelines

1. Component Creation:
   - Create a new directory for each component/screen
   - Include both .js and .style.js files
   - Use platform-specific styles when needed (mobile vs web)
   - Use .web.js extension for web-specific components

2. Navigation:
   - Use React Navigation for mobile
   - Use proper web routing for browser
   - Organize routes in separate navigation files
   - Implement proper navigation guards

3. Styling:
   - Use theme constants for consistent styling
   - Keep styles modular and reusable
   - Use platform-specific styles when needed:
     ```javascript
     import { Platform, StyleSheet } from 'react-native';
     
     const styles = StyleSheet.create({
       container: {
         ...Platform.select({
           web: {
             // web-specific styles
           },
           default: {
             // mobile styles
           },
         }),
       },
     });
     ```

4. Web-Specific Considerations:
   - Use responsive design principles
   - Implement proper SEO practices
   - Handle browser history and deep linking
   - Optimize for different screen sizes
   - Use web-specific features when available

5. Cross-Platform Testing:
   - Test on both mobile and web platforms
   - Ensure consistent behavior across platforms
   - Use platform-specific fallbacks when needed
