import { Exercise } from '@/lib/types';

export const FAKE_EXERCISES: Exercise[] = [
    {
        id: 1,
        name: 'Back Squat',
        description: 'Heavy squat day',
        barbellExercise: true,
        measureType: 'REPS',
        sets: [
            { id: 1, setNumber: 1, weight: 225, reps: 5, distance: null, timeSeconds: null, notes: null },
            { id: 2, setNumber: 2, weight: 225, reps: 5, distance: null, timeSeconds: null, notes: null },
        ],
    },

    {
        id: 2,
        name: "400m Run",
        description: "Running time!",
        barbellExercise: false,
        measureType: 'DISTANCE',
        sets: [
            {id: 3, setNumber: 1, weight: 0, reps: null, distance: 1312, timeSeconds: null, notes: null}
        ],
    },

    {
        id: 3,
        name: "Plank",
        description: "Plank O Clock!",
        barbellExercise: false,
        measureType: 'TIME',
        sets: [
            {id: 4, setNumber: 1, weight: 0, reps: null, distance: null, timeSeconds: 60, notes: null}
        ]
    },
];