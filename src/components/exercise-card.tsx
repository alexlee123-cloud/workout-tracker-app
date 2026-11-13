import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Exercise } from '@/lib/types';            // clue: the type for one exercise

// The props this component accepts: one exercise.
type ExerciseCardProps = {
    exercise: Exercise;                            // clue: same type as the import
};

// No "default" here; this is a named export, like ThemedText.
export function ExerciseCard({ exercise }: ExerciseCardProps) {
    return (
        <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{exercise.name}</ThemedText>   {/* clue: exercise name */}
            <ThemedText>{exercise.measureType} · {exercise.sets.length} sets</ThemedText>  {/* clue: how many are in a list? */}
        </ThemedView>
        
        
        // clue: cut this part from your renderItem in exercises.tsx and paste it here.
        // Then rename "item" to "exercise" everywhere inside it.
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