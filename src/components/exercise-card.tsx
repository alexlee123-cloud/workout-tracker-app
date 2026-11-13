import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Exercise } from '@/lib/types';

// The props this component accepts: one exercise.
type ExerciseCardProps = {
    exercise: Exercise;
};

// No "default" here; this is a named export, like ThemedText.
export function ExerciseCard({ exercise }: ExerciseCardProps) {
    return (
        <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{exercise.name}</ThemedText>
            <ThemedText>{exercise.measureType} · {exercise.sets.length} {exercise.sets.length === 1 ? 'Set' : 'Sets'} </ThemedText>
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
        }
});