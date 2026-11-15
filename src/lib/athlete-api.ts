import { request } from '@/lib/api';
import { CompletedRoutine, CompletedRoutineRequest, DayOfWeek, Routine, Schedule } from '@/lib/types';
import { DAYS } from '@/lib/days';

// The athlete's group schedule (the whole week).
export async function getMySchedule(): Promise<Schedule> {
    return request<Schedule>('/api/athlete/schedule');
}

// The routine for one weekday. Fails (with a message) on a rest day.
export async function getRoutineForDay(day: DayOfWeek): Promise<Routine> {
    return request<Routine>(`/api/athlete/routines/${day}`);
}

// Today's weekday, spelled the way the server wants ("MONDAY", ...).
export function today(): DayOfWeek {
    // getDay(): 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const index = (new Date().getDay() + 6) % 7;   // shift so Monday = 0
    return DAYS[index];
}

// The phone's time zone, like "America/Chicago", so the server knows what "today" is.
function timeZone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago';
    } catch {
        return 'America/Chicago';
    }
}

// Logs today's workout. The server allows one per day.
export async function completeRoutine(body: CompletedRoutineRequest): Promise<CompletedRoutine> {
    return request<CompletedRoutine>('/api/athlete/routines/complete', {
        method: 'POST',
        body,
        headers: { 'X-Time-Zone': timeZone() },
    });
}
