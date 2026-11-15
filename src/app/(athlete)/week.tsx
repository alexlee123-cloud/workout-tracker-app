import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getMySchedule, today } from '@/lib/athlete-api';
import { DAYS, DAY_LABELS } from '@/lib/days';
import { Schedule } from '@/lib/types';

// The athlete's week: each day's routine and its exercises. Today is highlighted.
export default function WeekScreen() {
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [error, setError] = useState('');

    useFocusEffect(
        useCallback(() => {
            getMySchedule()
                .then((s) => {
                    setError('');
                    setSchedule(s);
                })
                .catch((e) => setError(e instanceof Error ? e.message : 'Could not load your week'));
        }, [])
    );

    const todayDay = today();

    return (
        <ThemedView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText type="title">This week</ThemedText>
                {schedule ? <ThemedText style={styles.dim}>{schedule.name}</ThemedText> : null}
                {error ? <ThemedText>{error}</ThemedText> : null}

                {schedule
                    ? DAYS.map((day) => {
                          const routine = schedule.routinesByDay[day];
                          return (
                              <ThemedView
                                  key={day}
                                  style={[styles.card, day === todayDay && styles.todayCard]}>
                                  <ThemedText type="subtitle">
                                      {DAY_LABELS[day]}{day === todayDay ? ' (today)' : ''}: {routine?.name ?? 'Rest'}
                                  </ThemedText>
                                  {routine?.exercises.map((exercise) => (
                                      <ThemedText key={exercise.id} style={styles.dim}>
                                          • {exercise.name} ({exercise.sets.length}{' '}
                                          {exercise.sets.length === 1 ? 'set' : 'sets'})
                                      </ThemedText>
                                  ))}
                              </ThemedView>
                          );
                      })
                    : null}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        padding: 12,
        paddingTop: 80,
        paddingBottom: 140,   // room to scroll above the tab bar
        gap: 8,
    },
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        gap: 2,
    },
    todayCard: {
        borderColor: '#3b82f6',
        borderWidth: 2,
    },
    dim: {
        opacity: 0.7,
    },
});
