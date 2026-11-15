import { useCallback, useState } from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RoutineCard } from '@/components/routine-card';
import { Routine } from '@/lib/types';
import { getRoutines } from '@/lib/routines-api';

// Same pattern as the Exercises tab, for routines.
export default function RoutinesScreen() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            setError('');
            setRoutines(await getRoutines());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not load routines');
        }
    }, []);

    // Reload every time this tab comes into view.
    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    async function onRefresh() {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Routines</ThemedText>

            <Pressable style={styles.button} onPress={() => router.push('/create-routine')}>
                <ThemedText>+ New routine</ThemedText>
            </Pressable>

            <FlatList
                data={routines}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <RoutineCard routine={item} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <ThemedText>{error || 'No routines yet. Tap "+ New routine" to make one.'}</ThemedText>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        padding: 12,
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 12,
    },
});
