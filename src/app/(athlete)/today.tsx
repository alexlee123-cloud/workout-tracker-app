import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { completeRoutine, getRoutineForDay, today } from '@/lib/athlete-api';
import { DAY_LABELS } from '@/lib/days';
import { Exercise, MeasureType, Routine } from '@/lib/types';

// What the athlete types for one set. Text, like the coach's form, turned into numbers on save.
type SetLog = { weight: string; amount: string };

// The athlete's main screen: today's routine with the coach's targets filled in.
// The athlete changes anything they did differently, then taps Complete.
export default function TodayScreen() {
    const [routine, setRoutine] = useState<Routine | null>(null);
    // logs[exerciseIndex][setIndex] = what they did on that set
    const [logs, setLogs] = useState<SetLog[][]>([]);
    const [message, setMessage] = useState('');   // rest day, errors, or "done"
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    const day = today();

    const load = useCallback(async () => {
        try {
            setMessage('');
            setDone(false);
            const r = await getRoutineForDay(today());
            setRoutine(r);
            // Start each set at the coach's target.
            setLogs(r.exercises.map((exercise) => exercise.sets.map((set) => ({
                weight: set.weight ? String(set.weight) : '',
                amount: String(targetAmount(exercise.measureType, set) ?? ''),
            }))));
        } catch (e) {
            setRoutine(null);
            setMessage(e instanceof Error ? e.message : 'Could not load today');
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    // Change one box (weight or amount) of one set of one exercise.
    function update(exerciseIndex: number, setIndex: number, field: keyof SetLog, value: string) {
        setLogs(logs.map((sets, i) =>
            i !== exerciseIndex ? sets : sets.map((set, j) => (j === setIndex ? { ...set, [field]: value } : set))
        ));
    }

    function addSet(exerciseIndex: number) {
        setLogs(logs.map((sets, i) => (i === exerciseIndex ? [...sets, { weight: '', amount: '' }] : sets)));
    }

    async function complete() {
        if (!routine) return;
        try {
            setSaving(true);
            setMessage('');
            await completeRoutine({
                routineId: routine.id,
                completedExercises: routine.exercises.map((exercise, i) => ({
                    exerciseId: exercise.id,
                    // Skip sets left completely empty.
                    completedSets: logs[i]
                        .filter((set) => set.weight !== '' || set.amount !== '')
                        .map((set) => {
                            const n = set.amount === '' ? null : Number(set.amount);
                            return {
                                weight: Number(set.weight) || 0,
                                reps: exercise.measureType === 'REPS' ? n : null,
                                distance: exercise.measureType === 'DISTANCE' ? n : null,
                                timeSeconds: exercise.measureType === 'TIME' ? n : null,
                            };
                        }),
                })),
            });
            setDone(true);
        } catch (e) {
            setMessage(e instanceof Error ? e.message : 'Could not save');
        } finally {
            setSaving(false);
        }
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <ThemedText type="title">Today</ThemedText>
                <ThemedText style={styles.dim}>{DAY_LABELS[day]}</ThemedText>

                {routine ? (
                    <>
                        <ThemedText type="subtitle">{routine.name}</ThemedText>
                        {routine.description ? <ThemedText style={styles.dim}>{routine.description}</ThemedText> : null}

                        {routine.exercises.map((exercise, i) => (
                            <ThemedView key={exercise.id} style={styles.card}>
                                <ThemedText type="subtitle">{exercise.name}</ThemedText>
                                <ThemedText style={styles.dim}>Target: {targetText(exercise)}</ThemedText>

                                {(logs[i] ?? []).map((set, j) => (
                                    <ThemedView key={j} style={styles.setRow}>
                                        <ThemedText style={styles.setLabel}>Set {j + 1}</ThemedText>
                                        <TextInput
                                            style={styles.input}
                                            value={set.weight}
                                            onChangeText={(text) => update(i, j, 'weight', text)}
                                            placeholder="lb"
                                            keyboardType="numeric"
                                            editable={!done}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            value={set.amount}
                                            onChangeText={(text) => update(i, j, 'amount', text)}
                                            placeholder={unitLabel(exercise.measureType)}
                                            keyboardType="numeric"
                                            editable={!done}
                                        />
                                        <ThemedText style={styles.unit}>{unitLabel(exercise.measureType)}</ThemedText>
                                    </ThemedView>
                                ))}

                                {!done ? (
                                    <Pressable style={styles.smallButton} onPress={() => addSet(i)}>
                                        <ThemedText>+ Add set</ThemedText>
                                    </Pressable>
                                ) : null}
                            </ThemedView>
                        ))}

                        {done ? (
                            <ThemedText type="subtitle" style={styles.doneText}>✓ Done for today. Nice work!</ThemedText>
                        ) : (
                            <Pressable style={styles.button} onPress={complete} disabled={saving}>
                                <ThemedText>{saving ? 'Saving…' : 'Complete workout'}</ThemedText>
                            </Pressable>
                        )}
                    </>
                ) : null}

                {message ? <ThemedText>{message}</ThemedText> : null}
            </ScrollView>
        </ThemedView>
    );
}

// The coach's target number for one set: reps, feet, or seconds.
function targetAmount(measureType: MeasureType, set: Exercise['sets'][number]): number | null {
    if (measureType === 'REPS') return set.reps;
    if (measureType === 'DISTANCE') return set.distance;
    return set.timeSeconds;
}

function unitLabel(measureType: MeasureType): string {
    return measureType === 'REPS' ? 'reps' : measureType === 'DISTANCE' ? 'ft' : 'sec';
}

// "3 sets: 5 reps @ 225 lb, ..." in a compact form.
function targetText(exercise: Exercise): string {
    const parts = exercise.sets.map((set) => {
        const amount = targetAmount(exercise.measureType, set);
        const weight = set.weight ? ` @ ${set.weight} lb` : '';
        return `${amount ?? '?'} ${unitLabel(exercise.measureType)}${weight}`;
    });
    return parts.join(', ') || 'no sets';
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        padding: 12,
        paddingTop: 80,
        paddingBottom: 140,   // room to scroll above the tab bar
        gap: 10,
    },
    dim: {
        opacity: 0.7,
    },
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        gap: 8,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    setLabel: {
        width: 48,
    },
    input: {
        flex: 1,
        color: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
    },
    unit: {
        width: 36,
        opacity: 0.7,
    },
    smallButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#22c55e',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    doneText: {
        color: '#22c55e',
        textAlign: 'center',
    },
});
