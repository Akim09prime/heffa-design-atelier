
export const adminThemeColors = {
  // Background colors
  background: {
    primary: '#0f172a', // Dark blue background
    secondary: '#1e293b', // Slightly lighter blue
    tertiary: '#334155', // Medium blue for accents
    highlight: '#475569', // Highlight color
  },
  
  // Text colors
  text: {
    primary: '#f8fafc', // Almost white
    secondary: '#cbd5e1', // Light gray
    muted: '#94a3b8', // Muted text
    link: '#38bdf8', // Bright blue for links
  },
  
  // Button colors
  button: {
    primary: {
      background: '#38bdf8', // Bright blue
      hover: '#0ea5e9', // Darker blue on hover
      text: '#f8fafc', // Almost white
    },
    secondary: {
      background: '#334155', // Medium blue
      hover: '#475569', // Darker blue on hover
      text: '#f8fafc', // Almost white
    },
    destructive: {
      background: '#ef4444', // Red
      hover: '#dc2626', // Darker red on hover
      text: '#f8fafc', // Almost white
    },
  },
  
  // Border colors
  border: {
    light: '#334155', // Medium blue
    mid: '#1e293b', // Slightly lighter blue
    dark: '#0f172a', // Dark blue
  },
  
  // Status colors
  status: {
    success: '#10b981', // Green
    error: '#ef4444', // Red
    warning: '#f59e0b', // Orange
    info: '#3b82f6', // Blue
  },
  
  // Accent colors
  accent: {
    blue: '#38bdf8', // Bright blue
    purple: '#8b5cf6', // Purple
    pink: '#ec4899', // Pink
    orange: '#f97316', // Orange
    green: '#10b981', // Green
  },
  
  // Gradient colors
  gradient: {
    primary: 'linear-gradient(to right, #38bdf8, #0ea5e9)',
    secondary: 'linear-gradient(to right, #8b5cf6, #6366f1)',
    accent: 'linear-gradient(to right, #ec4899, #8b5cf6)',
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
  'admin-accent-blue': adminThemeColors.accent.blue,
  'admin-accent-purple': adminThemeColors.accent.purple,
  'admin-accent-pink': adminThemeColors.accent.pink,
  'admin-accent-orange': adminThemeColors.accent.orange,
  'admin-accent-green': adminThemeColors.accent.green,
};
