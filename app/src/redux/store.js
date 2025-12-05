import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';
import themeReducer from './themeSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        location: locationReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Potentially needed for Supabase session objects
        }),
});

