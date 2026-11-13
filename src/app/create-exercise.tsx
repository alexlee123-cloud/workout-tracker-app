import { StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {useState} from 'react';
import { MeasureType } from '@/lib/types';
import { router } from 'expo-router';
import { createExercise } from '@/lib/exercises-api';

// The Create Exercise form (version 1: one set).
export default function CreateExerciseScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [measureType, setMeasureType] = useState<MeasureType>('REPS');
    const [weight, setWeight] = useState('');
    const [amount, setAmount] = useState('');   // reps, feet, or seconds
    const [error, setError] = useState('');
    const amountLabel = measureType === 'REPS' ? 'Reps' : measureType === 'DISTANCE' ? 'Distance (ft)' : 'Time (seconds)';
    
    
    return (
        <ThemedView style={styles.container}>
            

            <TextInput style={styles.input}
                value = {name}
                onChangeText={setName}
                placeholder="Name:"
            />

            <TextInput style={styles.input}
                value = {description}
                onChangeText = {setDescription}
                placeholder="Description:"
                />

            <ThemedView style={styles.row}>
                {(['REPS', 'DISTANCE', 'TIME'] as MeasureType[]).map((type) => (
                    <Pressable
                        key={type}
                        style={[styles.chip, measureType === type && styles.chipSelected]}
                        onPress={() => setMeasureType(type)}>
                        <ThemedText>{type}</ThemedText>
                    </Pressable>
                ))}
            </ThemedView>

            <TextInput style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Weight (lb)"
                keyboardType="numeric"
            />

            <TextInput style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder={amountLabel}
                keyboardType="numeric"
            />

            <Pressable
                style={styles.button}
                onPress={async () => {
                    try {
                        setError('');
                        const n = Number(amount);              // turns the text "5" into the number 5
                        await createExercise({
                            name: name.trim(),
                            description: description.trim(),
                            barbellExercise: false,
                            measureType: measureType,
                            sets: [{
                                weight: Number(weight) || 0,   // empty box means 0
                                reps: measureType === 'REPS' ? n : null,
                                distance: measureType === 'DISTANCE' ? n : null,
                                timeSeconds: measureType === 'TIME' ? n : null,
                                notes: null,
                            }],
                        });
                        router.back();                         // go back to the Exercises list
                    } catch (e) {
                        setError(e instanceof Error ? e.message : 'Could not save');
                    }
                }}>
                <ThemedText> Save </ThemedText>
            </Pressable>

            {error ? <ThemedText>{error}</ThemedText> : null}

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    input: {
        color: 'white',            // white text so it shows on the dark background
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 12,
    },
    button: {
        backgroundColor: '#3b82f6', // a medium blue, close to the Expo icon's blue
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',     // centers the text inside the button
    },

    container: {
        flex: 1,
        padding: 16, 
        paddingTop: 130, 
        gap: 12
    },

    row: {
        flexDirection: 'row',
        gap: 8,
    },

    chip: {          
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
    },

    chipSelected: {
        backgroundColor: '#3b82f6'
    },

    

});



/*
export default function LoginScreen(){
   
    return (
        <ThemedView style={styles.container}>
            <ThemedText type = "title">Workout Tracker - Coach Screen</ThemedText>

            <TextInput style={styles.input}
                value = {email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
            />

            

            {error ? <ThemedText>{error}</ThemedText> : null}

        </ThemedView>
    );

}


*/