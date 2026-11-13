import {TextInput, Pressable, StyleSheet} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SchedulesScreen(){
    

    return (
        <ThemedView style={styles.container}>
            <ThemedText type = "title">Schedules</ThemedText>
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