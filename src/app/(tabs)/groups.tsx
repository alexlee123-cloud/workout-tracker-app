import { useCallback, useState } from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GroupCard } from '@/components/group-card';
import { AthleteGroup } from '@/lib/types';
import { getGroups } from '@/lib/groups-api';

// Same pattern as the Exercises tab, for athlete groups.
export default function GroupsScreen() {
    const [groups, setGroups] = useState<AthleteGroup[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            setError('');
            setGroups(await getGroups());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not load groups');
        }
    }, []);

    // Reload every time this tab comes into view.
    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    async function onRefresh() {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Groups</ThemedText>

            <Pressable style={styles.button} onPress={() => router.push('/create-group')}>
                <ThemedText>+ New group</ThemedText>
            </Pressable>

            <FlatList
                data={groups}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <GroupCard group={item} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <ThemedText>{error || 'No groups yet. Tap "+ New group" to make one.'}</ThemedText>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        padding: 12,
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 12,
    },
});
