import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { Video } from 'expo-av';
import { hp, wp } from '../helpers/common';
import theme from '../constants/theme';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import { createOrUpdatePost } from '../services/postService';

const CreatePost = () => {
    const { user, setAuth } = useAuth();
    const router = useRouter();
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const editoRef = useRef();
    const bodyRef = useRef(); // Use bodyRef for the caption in RichTextEditor

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfileData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [user]);

    const handleMediaPick = async (mediaType) => {
        let result;
        if (mediaType === 'image') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });
        } else if (mediaType === 'video') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'],
                allowsEditing: true,
                quality: 0.7,
            });
        }

        if (!result.canceled) {
            setMedia(result.assets[0].uri);
        }
    };

    const handleDeleteMedia = () => {
        Alert.alert('Delete Media', 'Are you sure you want to delete this media?', [
            { text: 'Cancel' },
            { text: 'Yes', onPress: () => setMedia(null) },
        ]);
    };

    const handlePost = async () => {
        console.log('caption', bodyRef.current); // Display the caption text
        console.log('media', media); // Display the media file URI

        // Enforce caption and media selection
        if (!bodyRef.current?.trim()) {
            Alert.alert('Create Post', 'Please add a caption!');
            return;
        }

        if (!media) {
            Alert.alert('Create Post', 'Please upload an image or video!');
            return;
        }

        let data = {
            file: media,  // Use the correct media URI here
            caption: bodyRef.current,  // Use the caption
            userId: user?.id,
        };

        setLoading(true);
        let res = await createOrUpdatePost(data);
        setLoading(false);

        if (!res.success) {
            Alert.alert('Error', res.msg);  // Display error if the result is not successful
        } else {
            console.log('Post uploaded successfully:', res);
            // Optionally, you can navigate back or show success message
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        editoRef.current?.blur(); // Blur the editor when dismissing keyboard
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <BackButton router={router} />
                    <Text style={styles.title}>Create Post</Text>

                    {/* User Profile and Caption */}
                    <View style={styles.profileSection}>
                        <View style={styles.profileContainer}>
                            <Image
                                source={{ uri: profileData?.image || 'https://via.placeholder.com/100' }}
                                style={styles.profileImage}
                            />
                            <Text style={styles.username}>{profileData?.name}</Text>
                        </View>

                        <View style={styles.captionContainer}>
                            <RichTextEditor
                                editorRef={editoRef}
                                onChange={body => (bodyRef.current = body)} // Capture the caption
                            />
                        </View>
                    </View>

                    {/* Media Picker Section - Using Icons */}
                    <View style={styles.mediaSection}>
                        <Text style={styles.mediaText}>Select Media</Text>

                        <View style={styles.mediaOptions}>
                            <TouchableOpacity
                                onPress={() => handleMediaPick('image')}
                                style={styles.mediaButton}
                            >
                                <Ionicons name="image-outline" size={hp(5)} color={theme.colors.primary} />
                                <Text style={styles.mediaLabel}>Add Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleMediaPick('video')}
                                style={styles.mediaButton}
                            >
                                <Ionicons name="videocam-outline" size={hp(5)} color={theme.colors.primary} />
                                <Text style={styles.mediaLabel}>Add Video</Text>
                            </TouchableOpacity>
                        </View>

                        {media && (
                            <View>
                                {/* Display selected media */}
                                {media.endsWith('.mp4') || media.endsWith('.mov') || media.endsWith('.avi') ? (
                                    <Video
                                        source={{ uri: media }}
                                        style={styles.mediaPreview}
                                        shouldPlay
                                        resizeMode="contain"
                                        isLooping={true}
                                    />
                                ) : (
                                    <Image source={{ uri: media }} style={styles.mediaPreview} />
                                )}

                                {/* Delete Media Button */}
                                <TouchableOpacity onPress={handleDeleteMedia} style={styles.deleteButton}>
                                    <Ionicons name="trash-bin-outline" size={hp(3)} color="red" />
                                    <Text style={styles.deleteLabel}>Delete Media</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Submit Post */}
                    <TouchableOpacity onPress={handlePost} style={styles.tickIconContainer}>
                        <Ionicons name="checkmark-circle-outline" size={hp(4)} color={theme.colors.primary} />
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CreatePost;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Ensures the ScrollView takes full height
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        paddingTop: hp(3),
        backgroundColor: '#fff',
    },
    title: {
        fontSize: hp(3.2),
        color: theme.colors.text.primary,
        fontWeight: '700',
        marginBottom: hp(2),
    },
    profileSection: {
        width: '100%',
        marginBottom: hp(3),
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    profileImage: {
        width: hp(8),
        height: hp(8),
        borderRadius: hp(4), // Circular profile image
        marginRight: wp(3),
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    username: {
        fontSize: hp(2.4),
        color: theme.colors.text.primary,
        fontWeight: '500',
    },
    captionContainer: {
        width: '100%',
        paddingHorizontal: wp(4),
        marginBottom: hp(2),
        borderRadius: hp(2),
        backgroundColor: theme.colors.lightGrey,
        paddingVertical: hp(2),
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    mediaSection: {
        width: '100%',
        paddingHorizontal: wp(5),
        marginBottom: hp(3),
    },
    mediaText: {
        fontSize: hp(2.4),
        color: theme.colors.text.primary,
        fontWeight: '600',
        marginBottom: hp(2),
    },
    mediaOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: hp(2),
    },
    mediaButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: hp(1.5),
        borderWidth: 1,
        borderRadius: hp(1),
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.lightGrey,
        width: wp(35),
    },
    mediaLabel: {
        fontSize: hp(2),
        color: theme.colors.text.primary,
        marginTop: hp(1),
    },
    mediaPreview: {
        width: wp(80),
        height: hp(40),
        borderRadius: hp(2),
        marginTop: hp(2),
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2),
        padding: hp(1.5),
        borderWidth: 1,
        borderRadius: hp(1),
        borderColor: 'red',
        backgroundColor: theme.colors.lightGrey,
    },
    deleteLabel: {
        fontSize: hp(2),
        color: 'red',
        marginLeft: wp(2),
    },
    tickIconContainer: {
        position: 'absolute',
        top: hp(3),
        right: wp(5),
        zIndex: 1,
    },
});
