// src/lib/token-storage.ts
// Saves the login token on the device, so you stay logged in after closing the app.
// Phones: the encrypted keychain (expo-secure-store). Web: the browser's localStorage,
// since secure-store doesn't exist in browsers.

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'accessToken';

export async function saveToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
        localStorage.setItem(KEY, token);
        return;
    }
    await SecureStore.setItemAsync(KEY, token);
}

export async function loadToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
        return localStorage.getItem(KEY);
    }
    return SecureStore.getItemAsync(KEY);
}

export async function clearToken(): Promise<void> {
    if (Platform.OS === 'web') {
        localStorage.removeItem(KEY);
        return;
    }
    await SecureStore.deleteItemAsync(KEY);
}

// A JWT's middle part holds its expiry time ("exp", in seconds).
// Returns true if the token is expired or can't be read.
export function isTokenExpired(token: string): boolean {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const { exp } = JSON.parse(atob(payload));
        return typeof exp !== 'number' || exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}
