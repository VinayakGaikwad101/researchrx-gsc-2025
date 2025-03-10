import { Platform } from 'react-native';

export const COLORS = {
  // Brand colors
  primary: '#007AFF',
  secondary: '#5856D6',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#F0F9FF',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FFCC00',
  info: '#5856D6',
  
  // Border colors
  border: '#E5E5EA',
  borderFocus: '#007AFF',
  
  // Common colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  weights: Platform.select({
    web: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    default: {
      regular: 'normal',
      medium: '500',
      semibold: '600',
      bold: 'bold',
    },
  }),
  families: Platform.select({
    web: {
      regular: 'system-ui, -apple-system, sans-serif',
      heading: 'system-ui, -apple-system, sans-serif',
    },
    ios: {
      regular: 'System',
      heading: 'System',
    },
    android: {
      regular: 'Roboto',
      heading: 'Roboto',
    },
  }),
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const LAYOUT = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  padding: {
    screen: Platform.select({
      web: 40,
      default: 20,
    }),
  },
  maxWidth: Platform.select({
    web: 1200,
    default: '100%',
  }),
};

export const SHADOWS = Platform.select({
  web: {
    small: {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    medium: {
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
  },
  default: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
  },
});

export const BREAKPOINTS = {
  sm: 640,  // Small devices (phones)
  md: 768,  // Medium devices (tablets)
  lg: 1024, // Large devices (laptops)
  xl: 1280, // Extra large devices (large laptops, desktops)
};

// Helper function for responsive web design
export const getResponsiveValue = (value, breakpoint) => {
  if (Platform.OS === 'web') {
    return `@media (min-width: ${BREAKPOINTS[breakpoint]}px) { ${value} }`;
  }
  return value;
};

// Helper function for platform-specific styles
export const getPlatformStyles = (webStyles, mobileStyles) => {
  return Platform.select({
    web: webStyles,
    default: mobileStyles,
  });
};
