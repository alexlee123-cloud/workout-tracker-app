import { useCallback, useState } from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseCard } from '@/components/exercise-card';
import { Exercise } from '@/lib/types';
import { getExercises } from '@/lib/exercises-api';

export default function ExercisesScreen(){

    const [exercises, setExercises] = useState<Exercise[]>([]);   // starts as an empty list
    const [refreshing, setRefreshing] = useState(false);          // true while pull-to-refresh spins
    const [error, setError] = useState('');

    // Loads the list from the server, and shows a message if that fails.
    const load = useCallback(async () => {
        try {
            setError('');
            setExercises(await getExercises());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not load exercises');
        }
    }, []);

    // Like useEffect, but runs every time this tab comes back into view,
    // so a newly created exercise shows up when you return from the form.
    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    // Pull down on the list to reload it.
    async function onRefresh() {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Exercises</ThemedText>

            <Pressable style={styles.button} onPress={() => router.push('/create-exercise')}>
                <ThemedText>+ New exercise</ThemedText>
            </Pressable>

            <FlatList
                data={exercises}
                keyExtractor={(item) => String(item.id)} // a unique key per row (ids!)
                renderItem={({ item }) => (
                    <ExerciseCard exercise={item} />
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <ThemedText>{error || 'No exercises yet. Tap "+ New exercise" to add one.'}</ThemedText>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
        container: {
        flex: 1,
        paddingTop: 80,
        padding: 12
        },
        button: {
        backgroundColor: '#3b82f6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 12,
        },
});