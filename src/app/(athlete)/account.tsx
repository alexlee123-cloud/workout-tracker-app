import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';

export default function AccountScreen() {
    const { signOut } = useAuth();

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Account</ThemedText>
            <ThemedText>You're logged in as an athlete.</ThemedText>
            <Pressable style={styles.button} onPress={() => signOut()}>
                <ThemedText>Log out</ThemedText>
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 12,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#ef4444',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
});
