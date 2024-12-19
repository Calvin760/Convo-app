import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { hp, wp } from '../helpers/common';
import theme from '../constants/theme';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import { StatusBar } from 'expo-status-bar';
import ScreenWrapper from '../components/ScreenWrapper';

const EditProfile = () => {
    const { user: currentUser, setUserData } = useAuth();

    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        bio: '',
        address: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!currentUser) {
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                bio: data.bio || '',
                address: data.address || '',
            });
            setProfileImage(data.image || null);  // Set the current image if available
        }

    }, [currentUser]);

    // const handleSaveProfile = async () => {
    //     setLoading(true);
    //     try {
    //         let imageUrl = profileImage;

    //         if (profileImage && typeof profileImage !== 'string') {
    //             // Upload image to Supabase storage
    //             const { data, error } = await supabase.storage
    //                 .from('users')
    //                 .upload(`public/${user.id}-${Date.now()}`, profileImage, {
    //                     cacheControl: '3600',
    //                     upsert: false,
    //                 });

    //             if (error) throw error;
    //             imageUrl = data.Key;
    //         }

    //         const { error: updateError } = await supabase
    //             .from('users')
    //             .update({
    //                 name: formData.name,
    //                 email: formData.email,
    //                 phoneNumber: formData.phoneNumber,
    //                 bio: formData.bio,
    //                 address: formData.address,
    //                 image: imageUrl,
    //             })
    //             .eq('id', user.id);

    //         if (updateError) throw updateError;

    //         Alert.alert('Success', 'Profile updated successfully!');
    //         router.push('/profile'); // Navigate back to the Profile screen
    //     } catch (error) {
    //         console.error('Error updating profile:', error);
    //         Alert.alert('Error', 'Failed to update profile. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSaveProfile = async () => {
        let userData = { ...formData };

        let { name, email, phoneNumber, address, image, bio } = userData
        // if (!name || !email || !phoneNumber || !address || !image || !bio){
        //     Alert.alert('Profile', "Please fill all the fields")
        //     return;
        // }
        setLoading(true)

        if (typeof image == 'object') {
            let imageRes = await uploadFile('profiles', image?.uri, true)
            if (imageRes.success) userData.image = imageRes.data
            else userData.image = null
        }

        const res = await updateUser(currentUser?.id, userData)
        setLoading(false)
        if (res.success) {
            setUserData({ ...currentUser, ...userData })
            router.back()
        }
    };


    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <StatusBar style="dark" />
                    <Text style={styles.title}>Edit Profile</Text>
                    <BackButton router={router} />

                    {/* Profile Picture */}
                    <View style={styles.profileImageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Image
                                source={{ uri: profileImage || 'https://via.placeholder.com/100' }}  // Default placeholder
                                style={styles.profileImage}
                            />
                        )}
                        <TouchableOpacity style={styles.changeImageButton} onPress={handleImagePick}>
                            <Text style={styles.changeImageButtonText}>Change Picture</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Input Fields */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={hp(3)} color={theme.colors.text.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: value })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={hp(3)} color={theme.colors.text.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={hp(3)} color={theme.colors.text.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="text-outline" size={hp(3)} color={theme.colors.text.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Bio"
                                value={formData.bio}
                                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={hp(3)} color={theme.colors.text.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Address"
                                value={formData.address}
                                onChangeText={(text) => setFormData({ ...formData, address: text })}
                            />
                        </View>
                    </View>

                    {/* Save and Cancel Buttons */}
                    <Button
                        title="Save"
                        buttonStyle={styles.button}
                        onPress={handleSaveProfile}
                        loading={loading}
                    />
                    <Button
                        title="Cancel"
                        buttonStyle={[styles.button, { backgroundColor: 'red' }]}
                        onPress={() => router.push('/profile')}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(5),
        backgroundColor: '#fff',
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.typography?.fontWeights?.bold || '700',
        marginBottom: hp(3),
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: hp(4),
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: theme.colors.border || '#ddd',
    },
    changeImageButton: {
        marginTop: hp(1),
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        borderRadius: 25,
    },
    changeImageButtonText: {
        color: '#fff',
        fontSize: hp(2),
        fontWeight: theme.typography?.fontWeights?.bold || '700',
    },
    form: {
        width: '100%',
        marginBottom: hp(3),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border || '#ddd',
        borderRadius: theme.borderRadius.medium,
        paddingHorizontal: wp(4),
        marginBottom: hp(2),
        backgroundColor: 'white',
        height: hp(6.5),
    },
    input: {
        flex: 1,
        fontSize: hp(2),
        color: theme.colors.text.primary,
        marginLeft: wp(2),
    },
    button: {
        width: '100%',
        borderRadius: hp(3.3),
        marginTop: hp(1),
    },
    scrollContainer: {
        flexGrow: 1,
    },
});

export default EditProfile;