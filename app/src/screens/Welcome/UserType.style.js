import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, LAYOUT, SHADOWS, getPlatformStyles } from '../../constants/theme';

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
      { maxWidth: LAYOUT.maxWidth },
      {}
    ),
  },
  header: {
    marginBottom: SPACING.xxl,
    ...getPlatformStyles(
      { maxWidth: 600, marginHorizontal: 'auto' },
      {}
    ),
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    color: COLORS.primary,
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      ios: 'System',
      android: 'Roboto'
    })
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
    ...getPlatformStyles(
      { maxWidth: 600 },
      {}
    ),
  },
  option: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.surface,
    ...getPlatformStyles(
      { 
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ...SHADOWS.small
      },
      {}
    ),
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceVariant,
  },
  optionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    marginBottom: SPACING.xs,
    color: COLORS.textPrimary,
  },
  optionDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: LAYOUT.borderRadius.md,
    width: '100%',
    opacity: 0.5,
    ...getPlatformStyles(
      { maxWidth: 400, cursor: 'not-allowed' },
      {}
    ),
  },
  continueButtonActive: {
    opacity: 1,
    ...getPlatformStyles(
      { cursor: 'pointer' },
      {}
    ),
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
  },
});
