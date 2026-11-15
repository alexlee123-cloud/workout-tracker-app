import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/auth';

// The "front door" ("/"). It shows nothing itself; it sends each person to their start screen:
// logged out -> login, coach -> coach Home, athlete -> Today.
export default function Index() {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn) {
        return <Redirect href="/login" />;
    }
    return <Redirect href={role === 'COACH' ? '/home' : '/today'} />;
}
