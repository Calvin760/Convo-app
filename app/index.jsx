import { View, Text, Button } from 'react-native'; // Importing Button
import React from 'react';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';

const Index = () => {
    const router = useRouter();

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Loading/>
        </View>
    );
};

export default Index;
