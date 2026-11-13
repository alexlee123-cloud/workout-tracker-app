import { request, USE_FAKE_DATA, fakeDelay } from '@/lib/api';
import { FAKE_EXERCISES } from '@/lib/fake-data';
import { Exercise, ExerciseRequest } from '@/lib/types';

// Gets the coach's exercise library.
export async function getExercises(): Promise<Exercise[]> {
    if (USE_FAKE_DATA) {
        await fakeDelay();      // pretend to wait for the network
        return FAKE_EXERCISES;
    }
    return request<Exercise[]>('/api/coach/exercises');
}

export async function createExercise(exercise: ExerciseRequest): Promise<Exercise> {
  return request<Exercise>('/api/coach/exercises', { method: 'POST', body: exercise });
}