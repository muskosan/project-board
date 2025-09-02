export const tokens = {
  colors: {
    // Practical UI inspired color palette
    background: {
      primary: '#FFFFFF', // Pure white
      secondary: '#FAFBFC', // Subtle gray background
      elevated: '#FFFFFF', // White for elevated surfaces
      overlay: 'rgba(0, 0, 0, 0.05)', // Light overlay
    },
    text: {
      primary: '#0F172A', // Rich dark slate
      secondary: '#475569', // Medium slate
      muted: '#94A3B8', // Light slate
      inverse: '#FFFFFF', // White text for dark backgrounds
    },
    accent: {
      primary: '#2563EB', // Professional blue
      secondary: '#7C3AED', // Rich purple
      tertiary: '#059669', // Emerald green
    },
    status: {
      success: '#059669', // Emerald
      warning: '#D97706', // Amber
      error: '#DC2626', // Red
      info: '#0284C7', // Sky blue
    },
    border: {
      light: '#F1F5F9', // Very light slate
      medium: '#E2E8F0', // Light slate
      dark: '#CBD5E1', // Medium slate
      focus: '#2563EB', // Blue for focus states
    },
    surface: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    // Interactive states
    interactive: {
      primary: '#2563EB',
      primaryHover: '#1D4ED8',
      primaryActive: '#1E40AF',
      secondary: '#F8FAFC',
      secondaryHover: '#F1F5F9',
      secondaryActive: '#E2E8F0',
    },
    // Soft blue palette for projects and accents
    project: {
      50: '#E3F2FD', // Very light blue
      100: '#BBDEFB', // Light blue
      200: '#90CAF9', // Medium light blue
      300: '#64B5F6', // Medium blue
      400: '#42A5F5', // Medium blue
      500: '#2196F3', // Primary blue
      600: '#1E88E5', // Medium dark blue
      700: '#1976D2', // Dark blue
      800: '#1565C0', // Darker blue
      900: '#0D47A1', // Very dark blue
      accent1: '#81C784', // Soft green (complementary)
      accent2: '#AED581', // Light green (complementary)
    },
  },
  typography: {
    fonts: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
    },
    sizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  spacing: {
    // Numeric scale (new system)
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
    // Legacy named scale (for backward compatibility)
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    focus: '0 0 0 3px rgb(37 99 235 / 0.1)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  touch: {
    minTarget: '44px', // Minimum touch target size
    spacing: '12px', // Minimum spacing between touch targets
  },
  transitions: {
    none: 'none',
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Animation curves
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export type Theme = typeof tokens;
