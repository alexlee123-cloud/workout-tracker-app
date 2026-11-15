import { request } from '@/lib/api';
import { LoginRequest, RegisterAthleteRequest, RegisterCoachRequest, TokenResponse } from '@/lib/types';

export async function login(email: string, password: string): Promise<TokenResponse> {
    const body: LoginRequest = { email, password };
    return request<TokenResponse>('/api/auth/login', { method: 'POST', body });
}

// Creates a coach account. Log in afterwards to get a token.
export async function registerCoach(body: RegisterCoachRequest): Promise<void> {
    await request<unknown>('/api/auth/coach/register', { method: 'POST', body });
}

// Creates an athlete account in the group that owns the invite code.
export async function registerAthlete(body: RegisterAthleteRequest): Promise<void> {
    await request<unknown>('/api/auth/athlete/register', { method: 'POST', body });
}
