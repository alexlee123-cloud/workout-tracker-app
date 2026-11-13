import { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseCard } from '@/components/exercise-card';
import { Exercise } from '@/lib/types';
import { getExercises } from '@/lib/exercises-api';

export default function ExercisesScreen(){

    const [exercises, setExercises] = useState<Exercise[]>([]);   // starts as an empty list

    useEffect(() => {
        getExercises().then(setExercises);
}, []);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Exercises</ThemedText>

            <FlatList
                data={exercises}
                keyExtractor={(item) => String(item.id)} // a unique key per row (ids!)
                renderItem={({ item }) => (
                    <ExerciseCard exercise={item} />
                )}
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
});