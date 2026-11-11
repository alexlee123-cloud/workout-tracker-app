export type UserType = 'COACH' | 'ATHLETE';

export type User = {
    id: number;
    email: string;
    displayName: string;
    userType: UserType;
};

export type ExerciseSet = {
    id: number;                  // Long id
    setNumber: number;           // int setNumber
    weight: number;              // BigDecimal weight   (always there; 0 if no weight)
    reps: number | null;         // Integer reps        (empty for distance/time exercises)
    distance: number | null;     // Integer distance    (feet; empty unless DISTANCE)
    timeSeconds: number | null;  // Integer timeSeconds (empty unless TIME)
    notes: string | null;        // String notes        (optional)
};

export type MeasureType = 'REPS' | 'DISTANCE' | 'TIME';

export type Exercise = {
    id: number;
    name: string;
    description: string;
    barbellExercise: boolean;
    measureType: MeasureType;
    sets: ExerciseSet[];         // List<ExerciseSet> becomes ExerciseSet[]
};

export type Routine = {
    id: number;
    name: string;
    description: string;
    exercises: Exercise[];       // in the order the athlete does them
};

// Java's DayOfWeek enum. The server spells days in capitals.
export type DayOfWeek =
    | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
    | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type Schedule = {
    id: number;
    name: string;
    description: string;
    // Java: Map<DayOfWeek, RoutineResponse>. A map is an object whose keys are days.
    // Partial<...> means "not every day has to be there" (a missing day = rest day).
    routinesByDay: Partial<Record<DayOfWeek, Routine>>;
};

export type AthleteGroup = {
    id: number;
    inviteCode: string;          // a UUID; athletes paste this to join
    name: string;
    description: string;
    activeSchedule: Schedule | null;   // null until the coach picks a schedule
};

// ---------- What the app SENDS (request bodies) ----------
// These use ids instead of whole objects: "routine #3" instead of the full routine.

export type LoginRequest = {
    email: string;
    password: string;
};

export type TokenResponse = {
    accessToken: string;         // the JWT you send back as "Authorization: Bearer ..."
};

// A new set has no id or setNumber yet; the server assigns them.
export type ExerciseSetRequest = Omit<ExerciseSet, 'id' | 'setNumber'>;

export type ExerciseRequest = {
    name: string;                // required, max 100 characters
    description: string;         // required, max 500 characters
    barbellExercise: boolean;
    measureType: MeasureType;
    sets: ExerciseSetRequest[];
};

export type RoutineRequest = {
    name: string;
    description: string;
    exerciseIds: number[];       // in order, no repeats
};

export type ScheduleRequest = {
    name: string;
    description: string;
    routineIdsByDay: Partial<Record<DayOfWeek, number>>;
};

export type AthleteGroupRequest = {
    name: string;
    description: string;
    scheduleId?: number | null;  // the ? means this field can be left out entirely
};

// ---------- Errors ----------
// When something goes wrong the server sends a "ProblemDetail".
// Show `detail` to the user; `errors` maps a form field to its message.
export type ProblemDetail = {
    status: number;
    detail: string;
    errors?: Record<string, string>;
};
