import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Video, Pressable } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

const ShowPost = () => {
    const router = useRouter();
    const pathname = usePathname();
    const postId = pathname.split('/').pop();  // Get the postId from query parameters
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();

                if (error) throw error;
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    if (!post) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const fileType = post.file?.split('.').pop()?.toLowerCase();

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.back()}>
                <Text style={styles.backButton}>Back</Text>
            </Pressable>
            <Text style={styles.postTitle}>Post</Text>
            {fileType === 'mp4' || fileType === 'mov' || fileType === 'avi' ? (
                <Video
                    source={{ uri: post.file }}
                    style={styles.postMedia}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                />
            ) : (
                <Image source={{ uri: post.file }} style={styles.postMedia} />
            )}
            <Text style={styles.postDescription}>{post.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    postTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postMedia: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    postDescription: {
        fontSize: 16,
        color: 'gray',
    },
    backButton: {
        fontSize: 18,
        color: 'blue',
        marginBottom: 10,
    },
});

export default ShowPost;
