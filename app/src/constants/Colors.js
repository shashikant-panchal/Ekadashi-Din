// Light Theme Colors (matching web default theme)
export const LightTheme = {
    // Primary Colors
    primary: '#052962',           // Deep blue (--primary in web)
    primaryForeground: '#FFFFFF',

    // Secondary Colors  
    secondary: '#FBDF14',         // Bright yellow (--secondary in web)
    secondaryForeground: '#052962',

    // Accent Colors
    accent: '#4071bf',            // Light blue accent
    accentForeground: '#FFFFFF',

    // Background Colors
    background: '#F8F9FA',        // Soft sage-tinted white
    foreground: '#052962',        // Deep blue text

    // Card Colors
    card: '#FFFFFF',
    cardForeground: '#052962',

    // Muted Colors
    muted: '#E6EAF5',
    mutedForeground: '#4071bf',

    // Border Colors
    border: '#CED9E3',
    input: '#CED9E3',

    // Status Colors
    destructive: '#EF4443',
    destructiveForeground: '#FFFFFF',

    // Special Colors
    grey: '#CED9E3',
    lightBlueBg: '#E9F0F8',

    // Gradient Colors
    gradientStart: 'rgb(233, 237, 241)',
    gradientEnd: '#F4F5F0',

    // Tab Bar Colors
    tabBarBackground: '#FAFBFA',
    tabBarBorder: '#CED9E4',
    tabActiveColor: '#16366B',
    tabInactiveColor: '#4071BF',
    tabActiveText: '#FFFFFF',
    tabInactiveText: '#4071BF',

    // Status Bar
    statusBarStyle: 'dark-content',
};

// Dark Theme Colors (matching web .dark theme)
export const DarkTheme = {
    // Primary Colors
    primary: '#5b9dff',           // Blue primary for dark mode
    primaryForeground: '#FFFFFF',

    // Secondary Colors
    secondary: '#FFD93D',         // Bright yellow for dark mode
    secondaryForeground: '#0f1729',

    // Accent Colors
    accent: '#5b9dff',            // Blue accent for dark mode
    accentForeground: '#FFFFFF',

    // Background Colors
    background: '#0f1729',        // Dark spiritual blue (--background dark)
    foreground: '#E8F4FF',        // Light blue-tinted white

    // Card Colors
    card: '#132142',              // Darker blue (--card dark)
    cardForeground: '#E8F4FF',

    // Muted Colors
    muted: '#1a2d52',
    mutedForeground: '#8ab4f8',

    // Border Colors
    border: '#2a4a7a',
    input: '#2a4a7a',

    // Status Colors
    destructive: '#f87171',
    destructiveForeground: '#FFFFFF',

    // Special Colors
    grey: '#3a5a8a',
    lightBlueBg: '#1a2d52',

    // Gradient Colors
    gradientStart: '#0f1729',
    gradientEnd: '#132142',

    // Tab Bar Colors
    tabBarBackground: '#0f1729',
    tabBarBorder: '#2a4a7a',
    tabActiveColor: '#5b9dff',
    tabInactiveColor: '#6b8ab8',
    tabActiveText: '#FFFFFF',
    tabInactiveText: '#8ab4f8',

    // Status Bar
    statusBarStyle: 'light-content',
};

// Legacy exports for backward compatibility during migration
export const DarkBlue = LightTheme.primary;
export const LightBlue = LightTheme.accent;
export const BackgroundGrey = LightTheme.muted;
export const AppYellow = LightTheme.secondary;
export const GRADIENT_START = LightTheme.gradientStart;
export const GRADIENT_END = LightTheme.gradientEnd;
export const LIGHTBLUEBG = LightTheme.lightBlueBg;
export const Grey = LightTheme.grey;

// Helper function to get theme colors
export const getThemeColors = (isDark) => {
    return isDark ? DarkTheme : LightTheme;
};
