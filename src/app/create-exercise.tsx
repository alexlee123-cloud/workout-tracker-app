import { StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {useState} from 'react';
import { MeasureType } from '@/lib/types';
import { router } from 'expo-router';
import { createExercise } from '@/lib/exercises-api';

type SetInput = { weight: string, amount: string};


// The Create Exercise form (version 1: one set).
export default function CreateExerciseScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [measureType, setMeasureType] = useState<MeasureType>('REPS');
    const [sets, setSets] = useState<SetInput[]>([{ weight: '', amount: '' }]);
    const [error, setError] = useState('');
    const amountLabel = measureType === 'REPS' ? 'Reps' : measureType === 'DISTANCE' ? 'Distance (ft)' : 'Time (seconds)';
    
    function updateSet(index: number, field: keyof SetInput, value: string) {
        setSets(sets.map((set, i) => (i === index ? { ...set, [field]: value } : set)));
    }
    
    return (
        <ThemedView style={styles.screen}>
        {/* ScrollView lets the form scroll when the keyboard covers the bottom. */}
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            

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

            {sets.map((set, index) => (
                <ThemedView key={index} style={styles.row}>
                    <ThemedText>Set {index + 1}</ThemedText>
                    <TextInput style={[styles.input, styles.setInput]}
                        value={set.weight}
                        onChangeText={(text) => updateSet(index, 'weight', text)}
                        placeholder="lb"
                        keyboardType="numeric"
                    />
                    <TextInput style={[styles.input, styles.setInput]}
                        value={set.amount}
                        onChangeText={(text) => updateSet(index, 'amount', text)}
                        placeholder={amountLabel}
                        keyboardType="numeric"
                    />
                </ThemedView>
            ))}

            <Pressable style={styles.chip} onPress={() => setSets([...sets, { weight: '', amount: '' }])}>
                <ThemedText>+ Add set</ThemedText>
            </Pressable>

            <Pressable
                style={styles.button}
                onPress={async () => {
                    try {
                        setError('');
                        await createExercise({
                            name: name.trim(),
                            description: description.trim(),
                            barbellExercise: false,
                            measureType: measureType,
                            sets: sets.map((set) => {
                                const n = Number(set.amount);
                                return {
                                    weight: Number(set.weight) || 0,
                                    reps: measureType === 'REPS' ? n : null,
                                    distance: measureType === 'DISTANCE' ? n : null,
                                    timeSeconds: measureType === 'TIME' ? n : null,
                                    notes: null,
                                };
                            }),
                        });
                        router.back();                         // go back to the Exercises list
                    } catch (e) {
                        setError(e instanceof Error ? e.message : 'Could not save');
                    }
                }}>
                <ThemedText> Save </ThemedText>
            </Pressable>

            {error ? <ThemedText>{error}</ThemedText> : null}

        </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
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
        flexGrow: 1,   // flexGrow (not flex) so the ScrollView can scroll
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

    setInput: { flex: 1 },

});


