import {StyleSheet, FlatList} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Exercise } from '@/lib/types';

const FAKE_EXERCISES: Exercise[] = [
    {
        id: 1,
        name: 'Back Squat',
        description: 'Heavy squat day',
        barbellExercise: true,
        measureType: 'REPS',
        sets: [
            { id: 1, setNumber: 1, weight: 225, reps: 5, distance: null, timeSeconds: null, notes: null },
            { id: 2, setNumber: 2, weight: 225, reps: 5, distance: null, timeSeconds: null, notes: null },
        ],
    },
    
    {
        id: 2, 
        name: "400m Run", 
        description: "Running time!", 
        barbellExercise: false, 
        measureType: 'DISTANCE', 
        sets: [
            {id: 3, setNumber: 1, weight: 0, reps: null, distance: 1312, timeSeconds: null, notes: null}
        ],
    },

    {
        id: 3, 
        name: "Plank", 
        description: "Plank O Clock!", 
        barbellExercise: false, 
        measureType: 'TIME',
        sets: [
            {id: 4, setNumber: 1, weight: 0, reps: null, distance: null, timeSeconds: 60, notes: null}
        ]
    },
];

export default function ExercisesScreen(){
    

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Exercises</ThemedText>

            <FlatList
                data={FAKE_EXERCISES}                              // clue: your fake list's name
                keyExtractor={(item) => String(item.id)} // a unique key per row (ids!)
                renderItem={({ item }) => (
                    <ThemedView style={styles.card}>
                        <ThemedText type="subtitle">{item.name}</ThemedText>   {/* clue: exercise name */}
                        <ThemedText>{item.measureType} · {item.sets.length} sets</ThemedText>  {/* clue: how many are in a list? */}
                    </ThemedView>
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

        card: {
            padding: 12, 
            borderWidth: 1, 
            borderColor: 'gray', 
            borderRadius: 8, 
            marginBottom: 8, 
        }
});