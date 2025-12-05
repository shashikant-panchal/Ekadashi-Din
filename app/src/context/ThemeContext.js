import { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DarkTheme, LightTheme } from '../constants/Colors';

// Create the Theme Context
const ThemeContext = createContext({
    colors: LightTheme,
    isDark: false,
    theme: 'light',
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const { resolvedTheme, theme } = useSelector((state) => state.theme);

    const value = useMemo(() => ({
        colors: resolvedTheme === 'dark' ? DarkTheme : LightTheme,
        isDark: resolvedTheme === 'dark',
        theme: theme,
    }), [resolvedTheme, theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
