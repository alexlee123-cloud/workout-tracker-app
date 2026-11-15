import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DayOfWeek, Routine } from '@/lib/types';
import { DAYS, DAY_LABELS } from '@/lib/days';
import { getRoutines } from '@/lib/routines-api';
import { createSchedule } from '@/lib/schedules-api';

// The schedule builder: a name, a description, and a routine for each weekday.
// Tap a day to open its choices, then pick a routine or Rest.
// The schedule repeats every week.
export default function CreateScheduleScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [routines, setRoutines] = useState<Routine[]>([]);
    // Which routine (by id) goes on which day. A day that's missing is a rest day.
    const [routineIdsByDay, setRoutineIdsByDay] = useState<Partial<Record<DayOfWeek, number>>>({});
    const [openDay, setOpenDay] = useState<DayOfWeek | null>(null);   // the day whose choices are showing
    const [error, setError] = useState('');

    useEffect(() => {
        getRoutines()
            .then(setRoutines)
            .catch((e) => setError(e instanceof Error ? e.message : 'Could not load routines'));
    }, []);

    // Put a routine on a day, or pass null to make it a rest day.
    function pick(day: DayOfWeek, routineId: number | null) {
        const copy = { ...routineIdsByDay };
        if (routineId === null) {
            delete copy[day];
        } else {
            copy[day] = routineId;
        }
        setRoutineIdsByDay(copy);
        setOpenDay(null);
    }

    function routineName(id: number | undefined) {
        return routines.find((routine) => routine.id === id)?.name ?? 'Rest';
    }

    async function save() {
        try {
            setError('');
            await createSchedule({
                name: name.trim(),
                description: description.trim(),
                routineIdsByDay,
            });
            router.back();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not save');
        }
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                />
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                />

                <ThemedText type="subtitle">Week</ThemedText>
                {routines.length === 0 && !error ? (
                    <ThemedText style={styles.hint}>Make a routine first, then come back.</ThemedText>
                ) : null}

                {DAYS.map((day) => (
                    <ThemedView key={day} style={styles.dayBlock}>
                        <Pressable
                            style={styles.dayRow}
                            onPress={() => setOpenDay(openDay === day ? null : day)}>
                            <ThemedText style={styles.dayLabel}>{DAY_LABELS[day]}</ThemedText>
                            <ThemedText style={routineIdsByDay[day] ? styles.grow : [styles.grow, styles.hint]}>
                                {routineName(routineIdsByDay[day])}
                            </ThemedText>
                            <ThemedText>{openDay === day ? '▲' : '▼'}</ThemedText>
                        </Pressable>

                        {openDay === day ? (
                            <ThemedView style={styles.choices}>
                                <Pressable
                                    style={[styles.chip, !routineIdsByDay[day] && styles.chipSelected]}
                                    onPress={() => pick(day, null)}>
                                    <ThemedText>Rest</ThemedText>
                                </Pressable>
                                {routines.map((routine) => (
                                    <Pressable
                                        key={routine.id}
                                        style={[styles.chip, routineIdsByDay[day] === routine.id && styles.chipSelected]}
                                        onPress={() => pick(day, routine.id)}>
                                        <ThemedText>{routine.name}</ThemedText>
                                    </Pressable>
                                ))}
                            </ThemedView>
                        ) : null}
                    </ThemedView>
                ))}

                <Pressable style={styles.button} onPress={save}>
                    <ThemedText>Save</ThemedText>
                </Pressable>

                {error ? <ThemedText>{error}</ThemedText> : null}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 130,
        gap: 12,
    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 12,
    },
    hint: {
        opacity: 0.5,
    },
    dayBlock: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
    },
    dayLabel: {
        width: 40,
        fontWeight: 'bold',
    },
    grow: {
        flex: 1,
    },
    choices: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    chip: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
    },
    chipSelected: {
        backgroundColor: '#3b82f6',
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
});
