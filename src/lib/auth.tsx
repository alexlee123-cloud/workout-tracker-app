// src/lib/auth.tsx
// Keeps track of whether someone is logged in, and shares that with every screen.
//
// How it fits together:
//   1. AuthProvider wraps the whole app (see src/app/_layout.tsx).
//   2. Any screen can call useAuth() to get { isLoggedIn, signIn, signOut }.
//   3. The root layout shows the login screen when isLoggedIn is false,
//      and the tabs when it's true. It switches automatically.

import { createContext, ReactNode, useContext, useState } from 'react';

import { setAuthToken } from '@/lib/api';

type AuthState = {
    isLoggedIn: boolean;
    signIn: (accessToken: string) => void;   // call after a successful login
    signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    function signIn(accessToken: string) {
        setAuthToken(accessToken);   // api.ts now attaches it to every request
        setToken(accessToken);       // flips isLoggedIn, so the app shows the tabs
    }

    function signOut() {
        setAuthToken(null);
        setToken(null);              // flips back to the login screen
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn: token !== null, signIn, signOut }}>
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

// NOTE: the token lives only in memory for now, so you log in again each time the
// app restarts. Saving it on the phone (expo-secure-store) is a later step.
