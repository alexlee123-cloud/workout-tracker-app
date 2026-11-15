import { Pressable, Share, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AthleteGroup } from '@/lib/types';

type GroupCardProps = {
    group: AthleteGroup;
};

// One group in the list: name, its schedule, and the invite code athletes use to join.
export function GroupCard({ group }: GroupCardProps) {
    // Opens the phone's share sheet (Messages, Mail, Copy, and so on) with the invite code.
    function shareCode() {
        Share.share({
            message: `Join my group "${group.name}" in Workout Tracker with this invite code: ${group.inviteCode}`,
        });
    }

    return (
        <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{group.name}</ThemedText>
            <ThemedText style={styles.dim}>
                Schedule: {group.activeSchedule?.name ?? 'none yet'}
            </ThemedText>
            <ThemedText style={styles.dim}>Invite code:</ThemedText>
            {/* selectable = press and hold to copy */}
            <ThemedText selectable style={styles.code}>{group.inviteCode}</ThemedText>
            <Pressable style={styles.shareButton} onPress={shareCode}>
                <ThemedText>Share invite code</ThemedText>
            </Pressable>
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
        gap: 4,
    },
    dim: {
        opacity: 0.7,
    },
    code: {
        fontFamily: 'Courier',
        fontSize: 13,
    },
    shareButton: {
        marginTop: 6,
        padding: 10,
        borderWidth: 1,
        borderColor: '#3b82f6',
        borderRadius: 8,
        alignItems: 'center',
    },
});
