import { request } from '@/lib/api';
import { Routine, RoutineRequest } from '@/lib/types';

// Gets the coach's routines.
export async function getRoutines(): Promise<Routine[]> {
    return request<Routine[]>('/api/coach/routines');
}

// Gets one routine by its id.
export async function getRoutine(id: number): Promise<Routine> {
    return request<Routine>(`/api/coach/routines/${id}`);
}

// Saves a new routine. exerciseIds are in the order the athlete does them.
export async function createRoutine(routine: RoutineRequest): Promise<Routine> {
    return request<Routine>('/api/coach/routines', { method: 'POST', body: routine });
}
