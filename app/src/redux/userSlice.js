import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../utils/supabase';

export const signUp = createAsyncThunk(
    'user/signUp',
    async ({ email, password, displayName }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName,
                    },
                },
            });

            if (error) {
                return rejectWithValue(error.message);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signIn = createAsyncThunk(
    'user/signIn',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return rejectWithValue(error.message);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signOut = createAsyncThunk(
    'user/signOut',
    async (_, { rejectWithValue }) => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                return rejectWithValue(error.message);
            }
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        session: null,
        loading: false,
        error: null,
        registrationSuccess: false,
    },
    reducers: {
        setSession: (state, action) => {
            state.session = action.payload;
            state.user = action.payload?.user || null;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetRegistrationSuccess: (state) => {
            state.registrationSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // SignUp
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registrationSuccess = false;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                // Depending on Supabase settings, user might be signed in immediately or require confirmation.
                // We'll update session if data.session is present.
                if (action.payload?.session) {
                    state.session = action.payload.session;
                    state.user = action.payload.user;
                }
                state.registrationSuccess = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // SignIn
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload.session;
                state.user = action.payload.user;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // SignOut
            .addCase(signOut.fulfilled, (state) => {
                state.user = null;
                state.session = null;
            })
            .addCase(signOut.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { setSession, clearError, resetRegistrationSuccess } = userSlice.actions;
export default userSlice.reducer;
