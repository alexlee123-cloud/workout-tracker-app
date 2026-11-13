import {useState} from 'react';
import {TextInput, Pressable, StyleSheet} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <ThemedView style={styles.container}>
            <ThemedText type = "title">Workout Tracker - Coach Screen</ThemedText>

            <TextInput style={styles.input}
                value = {email}
                onChangeText={setEmail}
                placeholder="Email"
            />

            <TextInput style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />

            <Pressable onPress={() => console.log(email, password)} style={styles.button}>
                <ThemedText> Log In </ThemedText>
            </Pressable>

        </ThemedView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,                  // fill the whole screen
        padding: 24,
        gap: 12,                  // space between each item
        justifyContent: 'center',
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
});