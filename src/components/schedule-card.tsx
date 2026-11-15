import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DAYS, DAY_LABELS } from '@/lib/days';
import { Schedule } from '@/lib/types';

type ScheduleCardProps = {
    schedule: Schedule;
};

// One schedule in the list: its name, then each weekday with its routine (or Rest).
export function ScheduleCard({ schedule }: ScheduleCardProps) {
    return (
        <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{schedule.name}</ThemedText>
            {DAYS.map((day) => (
                <ThemedText key={day} style={schedule.routinesByDay[day] ? undefined : styles.rest}>
                    {DAY_LABELS[day]}: {schedule.routinesByDay[day]?.name ?? 'Rest'}
                </ThemedText>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        marginBottom: 8,
        gap: 2,
    },
    rest: {
        opacity: 0.5,
    },
});
