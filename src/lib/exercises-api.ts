import { request, USE_FAKE_DATA, fakeDelay } from '@/lib/api';
import { FAKE_EXERCISES } from '@/lib/fake-data';
import { Exercise } from '@/lib/types';

// Gets the coach's exercise library.
export async function getExercises(): Promise<Exercise[]> {
    if (USE_FAKE_DATA) {
        await fakeDelay();      // pretend to wait for the network
        return FAKE_EXERCISES;
    }
    return request<Exercise[]>('/api/coach/exercises');
}