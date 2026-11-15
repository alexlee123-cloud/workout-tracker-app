import { useCallback, useState } from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScheduleCard } from '@/components/schedule-card';
import { Schedule } from '@/lib/types';
import { getSchedules } from '@/lib/schedules-api';

// Same pattern as the Exercises tab, for weekly schedules.
export default function SchedulesScreen() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            setError('');
            setSchedules(await getSchedules());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not load schedules');
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
            <ThemedText type="title">Schedules</ThemedText>

            <Pressable style={styles.button} onPress={() => router.push('/create-schedule')}>
                <ThemedText>+ New schedule</ThemedText>
            </Pressable>

            <FlatList
                data={schedules}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <ScheduleCard schedule={item} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <ThemedText>{error || 'No schedules yet. Tap "+ New schedule" to make one.'}</ThemedText>
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
