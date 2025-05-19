
export const adminThemeColors = {
  // Background colors
  background: {
    primary: '#131620',
    secondary: '#1A1F2C',
    tertiary: '#272d3d',
    highlight: '#2d3748',
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#c8c8c9',
    muted: '#8E9196',
    link: '#9b87f5',
  },
  
  // Button colors
  button: {
    primary: {
      background: '#9b87f5',
      hover: '#7E69AB',
      text: '#FFFFFF',
    },
    secondary: {
      background: '#1E293B',
      hover: '#334155',
      text: '#F1F0FB',
    },
    destructive: {
      background: '#991B1B',
      hover: '#B91C1C',
      text: '#FFFFFF',
    },
  },
  
  // Border colors
  border: {
    light: '#2d3748',
    mid: '#1f2937',
    dark: '#111827',
  },
  
  // Status colors
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  
  // Accent colors
  accent: {
    blue: '#0EA5E9',
    purple: '#9b87f5',
    pink: '#D946EF',
    orange: '#F97316',
    green: '#10B981',
  },
  
  // Gradient colors
  gradient: {
    primary: 'linear-gradient(to right, #9b87f5, #7E69AB)',
    secondary: 'linear-gradient(to right, #0EA5E9, #3B82F6)',
    accent: 'linear-gradient(to right, #D946EF, #9b87f5)',
  }
};

export const createAdminThemeClass = () => {
  return {
    '.admin-theme': {
      // Set CSS variables
      '--admin-bg-primary': adminThemeColors.background.primary,
      '--admin-bg-secondary': adminThemeColors.background.secondary,
      '--admin-bg-tertiary': adminThemeColors.background.tertiary,
      '--admin-bg-highlight': adminThemeColors.background.highlight,
      '--admin-text-primary': adminThemeColors.text.primary,
      '--admin-text-secondary': adminThemeColors.text.secondary,
      '--admin-text-muted': adminThemeColors.text.muted,
      '--admin-text-link': adminThemeColors.text.link,
      '--admin-border-light': adminThemeColors.border.light,
      '--admin-border-mid': adminThemeColors.border.mid,
      '--admin-border-dark': adminThemeColors.border.dark,
      '--admin-status-success': adminThemeColors.status.success,
      '--admin-status-error': adminThemeColors.status.error,
      '--admin-status-warning': adminThemeColors.status.warning,
      '--admin-status-info': adminThemeColors.status.info,
      '--admin-accent-blue': adminThemeColors.accent.blue,
      '--admin-accent-purple': adminThemeColors.accent.purple,
      '--admin-accent-pink': adminThemeColors.accent.pink,
      '--admin-accent-orange': adminThemeColors.accent.orange,
      '--admin-accent-green': adminThemeColors.accent.green,
      '--admin-gradient-primary': adminThemeColors.gradient.primary,
      '--admin-gradient-secondary': adminThemeColors.gradient.secondary,
      '--admin-gradient-accent': adminThemeColors.gradient.accent,
      
      // Apply base styles
      'background-color': adminThemeColors.background.primary,
      'color': adminThemeColors.text.primary,
    }
  };
};

// Export the color values directly for use in Tailwind config
export const adminColors = {
  'admin-bg-primary': adminThemeColors.background.primary,
  'admin-bg-secondary': adminThemeColors.background.secondary,
  'admin-bg-tertiary': adminThemeColors.background.tertiary,
  'admin-bg-highlight': adminThemeColors.background.highlight,
  'admin-text-primary': adminThemeColors.text.primary,
  'admin-text-secondary': adminThemeColors.text.secondary,
  'admin-text-muted': adminThemeColors.text.muted,
  'admin-text-link': adminThemeColors.text.link,
  'admin-border-light': adminThemeColors.border.light,
  'admin-border-mid': adminThemeColors.border.mid,
  'admin-border-dark': adminThemeColors.border.dark,
  'admin-accent-purple': adminThemeColors.accent.purple,
};
