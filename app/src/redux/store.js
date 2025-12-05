import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        location: locationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Potentially needed for Supabase session objects
        }),
});
