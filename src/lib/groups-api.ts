import { request } from '@/lib/api';
import { AthleteGroup, AthleteGroupRequest } from '@/lib/types';

// Gets the coach's athlete groups (each has an invite code).
export async function getGroups(): Promise<AthleteGroup[]> {
    return request<AthleteGroup[]>('/api/coach/athlete-groups');
}

// Gets one group by its id.
export async function getGroup(id: number): Promise<AthleteGroup> {
    return request<AthleteGroup>(`/api/coach/athlete-groups/${id}`);
}

// Creates a group. scheduleId is optional (pick a schedule later).
export async function createGroup(group: AthleteGroupRequest): Promise<AthleteGroup> {
    return request<AthleteGroup>('/api/coach/athlete-groups', { method: 'POST', body: group });
}
