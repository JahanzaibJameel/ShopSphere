import { Platform, AccessibilityInfo } from 'react-native';

// Minimum touch target size per WCAG 2.1 guidelines
export const MIN_TOUCH_TARGET = 44;

// Common accessibility roles
export const AccessibilityRoles = {
  button: 'button' as const,
  link: 'link' as const,
  image: 'image' as const,
  text: 'text' as const,
  header: 'header' as const,
  search: 'search' as const,
  adjustable: 'adjustable' as const,
  checkbox: 'checkbox' as const,
  radio: 'radio' as const,
  switch: 'switch' as const,
  tab: 'tab' as const,
  tablist: 'tablist' as const,
  timer: 'timer' as const,
  progressbar: 'progressbar' as const,
};

// Helper to create accessible touch target styles
export function accessibleTouchTarget(minSize: number = MIN_TOUCH_TARGET) {
  return {
    minWidth: minSize,
    minHeight: minSize,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };
}

// Helper to announce to screen reader
export function announceForAccessibility(message: string) {
  if (Platform.OS !== 'web') {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

// Helper to set accessibility focus
export function setAccessibilityFocus(ref: any) {
  if (ref?.current) {
    AccessibilityInfo.setAccessibilityFocus(ref.current);
  }
}

// Common accessibility props for interactive elements
export function getButtonAccessibilityProps(label: string, hint?: string, disabled?: boolean) {
  return {
    accessible: true,
    accessibilityRole: 'button' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: { disabled: disabled || false },
  };
}

// Common accessibility props for images
export function getImageAccessibilityProps(label: string, isDecorative: boolean = false) {
  if (isDecorative) {
    return {
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no' as const,
    };
  }
  return {
    accessible: true,
    accessibilityRole: 'image' as const,
    accessibilityLabel: label,
  };
}

// Common accessibility props for text inputs
export function getInputAccessibilityProps(label: string, hint?: string, error?: string) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: { disabled: false },
    ...(error && { accessibilityLiveRegion: 'polite' as const }),
  };
}

// Reduce motion preference check
export function useReduceMotion() {
  // In a real app, check AccessibilityInfo.isReduceMotionEnabled()
  return false;
}

// High contrast check
export function useHighContrast() {
  // In a real app, check AccessibilityInfo.isHighTextContrastEnabled()
  return false;
}

// Screen reader enabled check
export async function isScreenReaderEnabled(): Promise<boolean> {
  return AccessibilityInfo.isScreenReaderEnabled();
}

// Font scaling helper
export function getScaledFontSize(baseSize: number, scale: number = 1): number {
  return Math.round(baseSize * scale);
}
