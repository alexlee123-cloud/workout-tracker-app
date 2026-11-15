import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Schedule } from '@/lib/types';
import { getSchedules } from '@/lib/schedules-api';
import { createGroup } from '@/lib/groups-api';

// Create an athlete group: a name, a description, and (optionally) its weekly schedule.
// The server makes the invite code; it shows on the Groups list after saving.
export default function CreateGroupScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [scheduleId, setScheduleId] = useState<number | null>(null);   // null = no schedule yet
    const [error, setError] = useState('');

    useEffect(() => {
        getSchedules()
            .then(setSchedules)
            .catch((e) => setError(e instanceof Error ? e.message : 'Could not load schedules'));
    }, []);

    async function save() {
        try {
            setError('');
            await createGroup({
                name: name.trim(),
                description: description.trim(),
                scheduleId,
            });
            router.back();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not save');
        }
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name (e.g. Varsity Lifting)"
                />
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                />

                <ThemedText type="subtitle">Weekly schedule</ThemedText>
                <ThemedView style={styles.choices}>
                    <Pressable
                        style={[styles.chip, scheduleId === null && styles.chipSelected]}
                        onPress={() => setScheduleId(null)}>
                        <ThemedText>None yet</ThemedText>
                    </Pressable>
                    {schedules.map((schedule) => (
                        <Pressable
                            key={schedule.id}
                            style={[styles.chip, scheduleId === schedule.id && styles.chipSelected]}
                            onPress={() => setScheduleId(schedule.id)}>
                            <ThemedText>{schedule.name}</ThemedText>
                        </Pressable>
                    ))}
                </ThemedView>

                <Pressable style={styles.button} onPress={save}>
                    <ThemedText>Save</ThemedText>
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
    container: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 130,
        gap: 12,
    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 12,
    },
    choices: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
    },
    chipSelected: {
        backgroundColor: '#3b82f6',
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
});
