import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Exercise } from '@/lib/types';
import { getExercises } from '@/lib/exercises-api';
import { createRoutine } from '@/lib/routines-api';

// The routine builder: a name, a description, and exercises picked in order.
// Tap an exercise in "Your exercises" to add it to the end of the routine.
// In the routine, ↑ moves an exercise earlier and ✕ takes it out.
export default function CreateRoutineScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [library, setLibrary] = useState<Exercise[]>([]);   // all the coach's exercises
    const [picked, setPicked] = useState<Exercise[]>([]);     // the routine, in order
    const [error, setError] = useState('');

    // Load the coach's exercises once, when the screen opens.
    useEffect(() => {
        getExercises()
            .then(setLibrary)
            .catch((e) => setError(e instanceof Error ? e.message : 'Could not load exercises'));
    }, []);

    // The server doesn't allow the same exercise twice, so hide ones already picked.
    const available = library.filter((exercise) => !picked.some((p) => p.id === exercise.id));

    function add(exercise: Exercise) {
        setPicked([...picked, exercise]);
    }

    function remove(index: number) {
        setPicked(picked.filter((_, i) => i !== index));
    }

    // Swap an exercise with the one above it.
    function moveUp(index: number) {
        if (index === 0) return;
        const copy = [...picked];
        [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
        setPicked(copy);
    }

    async function save() {
        try {
            setError('');
            if (picked.length === 0) {
                setError('Add at least one exercise.');
                return;
            }
            await createRoutine({
                name: name.trim(),
                description: description.trim(),
                exerciseIds: picked.map((exercise) => exercise.id),
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

                <ThemedText type="subtitle">Routine ({picked.length})</ThemedText>
                {picked.length === 0 ? (
                    <ThemedText style={styles.hint}>Tap exercises below to add them in order.</ThemedText>
                ) : null}
                {picked.map((exercise, index) => (
                    <ThemedView key={exercise.id} style={styles.pickedRow}>
                        <ThemedText style={styles.grow}>
                            {index + 1}. {exercise.name}
                        </ThemedText>
                        <Pressable style={styles.smallButton} onPress={() => moveUp(index)}>
                            <ThemedText>↑</ThemedText>
                        </Pressable>
                        <Pressable style={styles.smallButton} onPress={() => remove(index)}>
                            <ThemedText>✕</ThemedText>
                        </Pressable>
                    </ThemedView>
                ))}

                <ThemedText type="subtitle">Your exercises</ThemedText>
                {available.map((exercise) => (
                    <Pressable key={exercise.id} style={styles.libraryRow} onPress={() => add(exercise)}>
                        <ThemedText>+ {exercise.name}</ThemedText>
                    </Pressable>
                ))}
                {library.length > 0 && available.length === 0 ? (
                    <ThemedText style={styles.hint}>All your exercises are in this routine.</ThemedText>
                ) : null}

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
        opacity: 0.6,
    },
    pickedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#3b82f6',
        borderRadius: 8,
    },
    grow: {
        flex: 1,
    },
    smallButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
    },
    libraryRow: {
        padding: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
});
