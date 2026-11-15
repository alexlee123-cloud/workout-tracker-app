import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Routine } from '@/lib/types';

type RoutineCardProps = {
    routine: Routine;
};

// One routine in the list: its name, how many exercises, and their names in order.
export function RoutineCard({ routine }: RoutineCardProps) {
    const count = routine.exercises.length;
    return (
        <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{routine.name}</ThemedText>
            <ThemedText>{count} {count === 1 ? 'exercise' : 'exercises'}</ThemedText>
            {count > 0 ? (
                <ThemedText style={styles.names}>
                    {routine.exercises.map((exercise) => exercise.name).join(' → ')}
                </ThemedText>
            ) : null}
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
        gap: 4,
    },
    names: {
        opacity: 0.7,
    },
});
