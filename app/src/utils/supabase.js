import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const ExpoSecureStoreAdapter = {
    getItem: (key) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: (key, value) => {
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key) => {
        return SecureStore.deleteItemAsync(key);
    },
};

const supabaseUrl = "https://irgdihkmgeksjemzwhpq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZ2RpaGttZ2Vrc2plbXp3aHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODI0OTksImV4cCI6MjA3MTc1ODQ5OX0.IDzpkFWMToqHG7hZTWUcH-dKARbtdjesammeNGOOHF0";

const storage = Platform.OS === 'web' ? AsyncStorage : ExpoSecureStoreAdapter;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
