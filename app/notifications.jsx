import React from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp, wp } from '../helpers/common';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';

const mockNotifications = [
    {
        id: 1,
        type: 'like',
        user: 'John Doe',
        avatar: 'https://via.placeholder.com/50',
        message: 'liked your photo.',
    },
    {
        id: 2,
        type: 'follow',
        user: 'Jane Smith',
        avatar: 'https://via.placeholder.com/50',
        message: 'started following you.',
    },
];

const Notifications = () => {
    const router = useRouter()
    
    const renderNotification = ({ item }) => (
        <View style={styles.notification}>
            
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text>
                <Text style={styles.username}>{item.user} </Text>
                {item.message}
            </Text>
        </View>
    );

    return (
        <ScreenWrapper>
            
            <Text style={styles.header}>Notifications</Text>
            <BackButton router={router} />
            <FlatList
                data={mockNotifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </ScreenWrapper>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    header: {
        fontSize: hp(3),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: hp(2),
    },
    list: {
        padding: wp(4),
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    avatar: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        marginRight: wp(4),
    },
    username: {
        fontWeight: 'bold',
    },
});
