// src/lib/api.ts
// The ONE place the app talks to the backend server.
// Every screen calls small functions (like getExercises) that use `request` below,
// so the server address, login token, and error handling live in just this file.

import { ProblemDetail } from '@/lib/types';

// ---------- Settings ----------

// Where the backend runs. A phone can't use "localhost" (that would mean the phone
// itself), so in goal 8 this becomes your Mac's Wi-Fi address, e.g. http://192.168.1.23:8081
export const API_BASE_URL = 'http://localhost:8081';

// true  = screens get fake data, no server needed (what we use until goal 8)
// false = talk to the real server
export const USE_FAKE_DATA = true;

// ---------- Login token ----------

// After logging in, the server gives us a token. We keep it here and attach it
// to every request so the server knows who we are. (Goal 8 will also save it
// on the phone so you stay logged in after closing the app.)
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
}

// ---------- Errors ----------

// A readable error the screens can show. `message` is the server's "detail" text;
// `fieldErrors` says which form field was wrong, e.g. { name: "must not be blank" }.
export class ApiError extends Error {
    status: number;
    fieldErrors: Record<string, string>;

    constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

// ---------- The request function ----------

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';   // GET if left out
    body?: unknown;                               // turned into JSON for you
};

// Calls the server and returns its JSON reply, typed as T.
// Example: request<Exercise[]>('/api/coach/exercises')
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    let response: Response;
    try {
        response = await fetch(API_BASE_URL + path, {
            method: options.method ?? 'GET',
            headers,
            body: options.body === undefined ? undefined : JSON.stringify(options.body),
        });
    } catch {
        // No reply at all: server not running, wrong address, or no Wi-Fi.
        throw new ApiError(0, "Can't reach the server. Is it running, and is the address right?");
    }

    // Some replies have no body (e.g. 204 No Content).
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const problem = data as Partial<ProblemDetail> | null;
        if (response.status === 401) {
            throw new ApiError(401, 'Your login has expired. Please log in again.');
        }
        throw new ApiError(
            response.status,
            problem?.detail ?? `Something went wrong (error ${response.status}).`,
            problem?.errors ?? {},
        );
    }

    return data as T;
}

// Pretend network delay for fake mode, so loading spinners are visible while testing.
export function fakeDelay(ms = 400): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
