// src/lib/auth.tsx
// Keeps track of whether someone is logged in, and shares that with every screen.
//
// How it fits together:
//   1. AuthProvider wraps the whole app (see src/app/_layout.tsx).
//   2. Any screen can call useAuth() to get { isLoggedIn, signIn, signOut }.
//   3. The root layout shows the login screen when isLoggedIn is false,
//      and the tabs when it's true. It switches automatically.
//   4. The token is saved on the device (token-storage.ts), so reopening the
//      app keeps you logged in until the token expires (60 minutes).

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { setAuthToken, setOnUnauthorized } from '@/lib/api';
import { clearToken, isTokenExpired, loadToken, saveToken } from '@/lib/token-storage';

type AuthState = {
    isLoggedIn: boolean;
    isLoading: boolean;                      // true while checking for a saved token
    signIn: (accessToken: string) => void;   // call after a successful login
    signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    function signIn(accessToken: string) {
        setAuthToken(accessToken);   // api.ts now attaches it to every request
        setToken(accessToken);       // flips isLoggedIn, so the app shows the tabs
        saveToken(accessToken).catch(() => {});   // remember it for next time
    }

    function signOut() {
        setAuthToken(null);
        setToken(null);              // flips back to the login screen
        clearToken().catch(() => {});
    }

    // When the app starts: look for a saved token that hasn't expired yet.
    useEffect(() => {
        loadToken()
            .then((saved) => {
                if (saved && !isTokenExpired(saved)) {
                    setAuthToken(saved);
                    setToken(saved);
                }
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    // If any request finds the token expired, log out (back to the login screen).
    useEffect(() => {
        setOnUnauthorized(() => signOut());
        return () => setOnUnauthorized(null);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn: token !== null, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthState {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return auth;
}
