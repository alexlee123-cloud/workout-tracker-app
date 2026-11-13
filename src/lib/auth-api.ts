import { request } from '@/lib/api';
import { LoginRequest, TokenResponse } from '@/lib/types';

export async function login(email: string, password: string): Promise<TokenResponse> {
    const body: LoginRequest = { email, password };
    return request<TokenResponse>('/api/auth/login', { method: 'POST', body });
}