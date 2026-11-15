import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { login, registerAthlete, registerCoach } from '@/lib/auth-api';
import { useAuth } from '@/lib/auth';

type AccountType = 'COACH' | 'ATHLETE';

// Sign up as a coach, or as an athlete with the invite code from a coach.
// After the account is made we log in right away, and the app shows the right tabs.
export default function SignUpScreen() {
    const { signIn } = useAuth();
    const [accountType, setAccountType] = useState<AccountType>('ATHLETE');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    async function signUp() {
        try {
            setSaving(true);
            setError('');
            const cleanEmail = email.trim().toLowerCase();
            const details = { email: cleanEmail, displayName: displayName.trim(), password };
            if (accountType === 'COACH') {
                await registerCoach(details);
            } else {
                await registerAthlete({ ...details, inviteCode: inviteCode.trim() });
            }
            const response = await login(cleanEmail, password);
            signIn(response.accessToken);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Sign up failed');
        } finally {
            setSaving(false);
        }
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <ThemedText>I am a...</ThemedText>
                <ThemedView style={styles.row}>
                    {(['ATHLETE', 'COACH'] as AccountType[]).map((type) => (
                        <Pressable
                            key={type}
                            style={[styles.chip, accountType === type && styles.chipSelected]}
                            onPress={() => setAccountType(type)}>
                            <ThemedText>{type === 'COACH' ? 'Coach' : 'Athlete'}</ThemedText>
                        </Pressable>
                    ))}
                </ThemedView>

                {accountType === 'ATHLETE' ? (
                    <TextInput
                        style={styles.input}
                        value={inviteCode}
                        onChangeText={setInviteCode}
                        placeholder="Invite code from your coach"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                ) : null}

                <TextInput
                    style={styles.input}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Your name"
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password (8+ characters)"
                    secureTextEntry
                    autoCapitalize="none"
                />

                <Pressable style={styles.button} onPress={signUp} disabled={saving}>
                    <ThemedText>{saving ? 'Creating account…' : 'Sign up'}</ThemedText>
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
        padding: 24,
        paddingTop: 130,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    chipSelected: {
        backgroundColor: '#3b82f6',
    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 12,
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
});
