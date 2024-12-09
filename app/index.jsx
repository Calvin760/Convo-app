import { View, Text, Button } from 'react-native'; // Importing Button
import React from 'react';
import { useRouter } from 'expo-router';

const Index = () => {
    const router = useRouter();

    return (
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Text>Index</Text>
            <Button
                title="Welcome"
                onPress={() => router.push("Welcome")}
            />
        </View>
    );
};

export default Index;
