import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, LAYOUT, getPlatformStyles } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: LAYOUT.padding.screen,
    justifyContent: 'center',
    alignItems: 'center',
    ...getPlatformStyles(
      { maxWidth: LAYOUT.maxWidth }, // web styles
      {} // mobile styles
    ),
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: SPACING.xl,
    resizeMode: 'contain',
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.primary,
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      ios: 'System',
      android: 'Roboto'
    })
  },
  description: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.textSecondary,
    lineHeight: 24,
    ...getPlatformStyles(
      { maxWidth: 600, marginHorizontal: 'auto' },
      {}
    ),
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: LAYOUT.borderRadius.md,
    width: '100%',
    ...getPlatformStyles(
      { maxWidth: 400, cursor: 'pointer' },
      {}
    ),
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
  },
  version: {
    position: 'absolute',
    bottom: SPACING.lg,
    color: COLORS.textTertiary,
    fontSize: FONTS.sizes.xs,
  },
});
