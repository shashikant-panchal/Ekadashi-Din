import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../utils/supabase';

WebBrowser.maybeCompleteAuthSession();

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

export const signInWithGoogle = createAsyncThunk(
    'user/signInWithGoogle',
    async (_, { rejectWithValue }) => {
        try {
            const redirectUrl = makeRedirectUri({
                scheme: 'ekadashidin',
                path: 'auth/callback',
            });

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) return rejectWithValue(error.message);
            if (!data?.url) return rejectWithValue('No OAuth URL returned');

            const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

            if (result.type === 'success') {
                const { url } = result;
                // Extract params from hash (#) or query (?)
                // Supabase implicitly returns access_token & refresh_token in the URL.
                // We need to parse them.

                // However, since we are using Supabase, we can just let Supabase helper parse it if we had one.
                // Or we can manually parse.
                // Format usually: ekadashidin://auth/callback#access_token=...&refresh_token=...&...

                const params = {};
                const queryString = url.split('#')[1] || url.split('?')[1];
                if (queryString) {
                    queryString.split('&').forEach(param => {
                        const [key, value] = param.split('=');
                        params[key] = decodeURIComponent(value);
                    });
                }

                if (params.access_token && params.refresh_token) {
                    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                        access_token: params.access_token,
                        refresh_token: params.refresh_token,
                    });
                    if (sessionError) return rejectWithValue(sessionError.message);
                    return sessionData;
                } else {
                    // Sometimes error details are in the URL
                    if (params.error_description) return rejectWithValue(params.error_description);
                    return rejectWithValue('Authentication failed or cancelled');
                }
            } else {
                return rejectWithValue('Login cancelled');
            }
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
            // Google SignIn
            .addCase(signInWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.session) {
                    state.session = action.payload.session;
                    state.user = action.payload.user;
                }
            })
            .addCase(signInWithGoogle.rejected, (state, action) => {
                state.loading = false;
                if (action.payload !== 'Login cancelled') {
                    state.error = action.payload;
                }
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
