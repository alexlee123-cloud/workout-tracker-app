import {TextInput, Pressable, StyleSheet} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RoutineScreen(){
    

    return (
        <ThemedView style={styles.container}>
            <ThemedText type = "title">Routine</ThemedText>
        </ThemedView>

        
    )
}

const styles = StyleSheet.create({
        container: {
        flex: 1,
        justifyContent: 'center',
        padding: 12
        },
});