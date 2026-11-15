import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// The routine builder. We'll build it in goal 10, step 2.
export default function CreateRoutineScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText>Routine builder goes here</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 130,
    },
});
