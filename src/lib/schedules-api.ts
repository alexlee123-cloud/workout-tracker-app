import { request } from '@/lib/api';
import { Schedule, ScheduleRequest } from '@/lib/types';

// Gets the coach's weekly schedules.
export async function getSchedules(): Promise<Schedule[]> {
    return request<Schedule[]>('/api/coach/schedules');
}

// Gets one schedule by its id.
export async function getSchedule(id: number): Promise<Schedule> {
    return request<Schedule>(`/api/coach/schedules/${id}`);
}

// Saves a new schedule: one routine id per weekday (leave a day out for rest).
export async function createSchedule(schedule: ScheduleRequest): Promise<Schedule> {
    return request<Schedule>('/api/coach/schedules', { method: 'POST', body: schedule });
}
