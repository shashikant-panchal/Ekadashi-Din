import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

const THEME_STORAGE_KEY = 'ekadashi-theme';

// Async thunk to load theme from AsyncStorage
export const loadTheme = createAsyncThunk(
    'theme/loadTheme',
    async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme) {
                return savedTheme;
            }
            // Default to system preference
            return 'system';
        } catch (error) {
            console.error('Error loading theme:', error);
            return 'system';
        }
    }
);

// Async thunk to save theme to AsyncStorage
export const saveTheme = createAsyncThunk(
    'theme/saveTheme',
    async (theme, { dispatch }) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
            return theme;
        } catch (error) {
            console.error('Error saving theme:', error);
            throw error;
        }
    }
);

// Helper to get resolved theme (converts 'system' to actual theme)
const getResolvedTheme = (theme) => {
    if (theme === 'system') {
        const colorScheme = Appearance.getColorScheme();
        return colorScheme === 'dark' ? 'dark' : 'light';
    }
    return theme;
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: 'light', // 'light' | 'dark' | 'system'
        resolvedTheme: 'light', // The actual applied theme ('light' | 'dark')
        loading: true,
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            state.resolvedTheme = getResolvedTheme(action.payload);
        },
        toggleTheme: (state) => {
            const newTheme = state.resolvedTheme === 'light' ? 'dark' : 'light';
            state.theme = newTheme;
            state.resolvedTheme = newTheme;
        },
        updateSystemTheme: (state) => {
            // Called when system theme changes (only affects if theme is 'system')
            if (state.theme === 'system') {
                state.resolvedTheme = getResolvedTheme('system');
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTheme.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadTheme.fulfilled, (state, action) => {
                state.theme = action.payload;
                state.resolvedTheme = getResolvedTheme(action.payload);
                state.loading = false;
            })
            .addCase(loadTheme.rejected, (state) => {
                state.loading = false;
            })
            .addCase(saveTheme.fulfilled, (state, action) => {
                state.theme = action.payload;
                state.resolvedTheme = getResolvedTheme(action.payload);
            });
    },
});

export const { setTheme, toggleTheme, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
