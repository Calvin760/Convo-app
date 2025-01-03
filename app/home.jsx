import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { Ionicons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import theme from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Video } from 'expo-av';

const Home = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts
  const [showCommentInput, setShowCommentInput] = useState(null); // Track which post's comment input to show
  const [commentText, setCommentText] = useState(''); // Store comment text

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

    // Function to get the like count for a specific postId
    const getPostLikeCount = async (postId) => {
      const { data, error } = await supabase
        .from('postLikes')
        .select('postId')
        .eq('postId', postId);
      if (error) {
        console.error('Error fetching like count:', error);
        return 0;
      }
      return data.length; // Return the like count for the post
    };

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*, users(name, image, id, email, phoneNumber, bio)')
          .order('created_at', { ascending: false })
          .limit(10); // Limit posts to 10

        if (error) throw error;

        // Fetch like count for each post
        const postsWithLikeCount = await Promise.all(data.map(async (post) => {
          const { data: likeData, error: likeError } = await supabase
            .from('postLikes')
            .select('postId')
            .eq('postId', post.id);

          if (likeError) throw likeError;

          return {
            ...post,
            likeCount: likeData.length, // Add likeCount to the post object
          };
        }));

        // Fetch liked posts for the current user
        const { data: likedPostsData, error: likedError } = await supabase
          .from('postLikes')
          .select('postId')
          .eq('userId', user.id);

        if (likedError) throw likedError;

        // Map liked posts into a Set
        const likedPostIds = new Set(likedPostsData?.map((like) => like.postId));

        setPosts(postsWithLikeCount); // Set posts with likeCount
        setLikedPosts(likedPostIds); // Set liked posts state
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchUserData();
    fetchPosts();
  }, [user]);

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const renderMedia = (file) => {
    const fileType = file?.split('.').pop()?.toLowerCase();
    if (fileType === 'mp4' || fileType === 'mov' || fileType === 'avi') {
      return (
        <Video
          source={{ uri: file }}
          style={styles.postImage}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
      );
    } else {
      return <Image source={{ uri: file }} style={styles.postImage} />;
    }
  };

  const toggleLike = async (postId) => {
    const alreadyLiked = likedPosts.has(postId);

    try {
      if (alreadyLiked) {
        // If already liked, remove the like from the database
        const { error } = await supabase
          .from('postLikes')
          .delete()
          .eq('postId', postId)
          .eq('userId', user.id);
        if (error) throw error;
      } else {
        // Check if the user has already liked this post (prevent multiple likes)
        const { data: existingLike, error: fetchError } = await supabase
          .from('postLikes')
          .select('id')
          .eq('postId', postId)
          .eq('userId', user.id);

        if (fetchError) throw fetchError;

        // If no like is found, add the like
        if (existingLike && existingLike.length === 0) {
          const { error } = await supabase
            .from('postLikes')
            .insert({ postId, userId: user.id });
          if (error) throw error;
        }
      }

      // Update the liked posts state to reflect the change
      setLikedPosts((prev) => {
        const updated = new Set(prev);
        if (alreadyLiked) {
          updated.delete(postId);
        } else {
          updated.add(postId);
        }
        return updated;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };


  const handleCommentSubmit = (postId) => {
    // Handle comment submission (you can push this comment to a database or manage it here)
    console.log('Comment Submitted: ', commentText);
    setShowCommentInput(null); // Hide input after submission
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ConvoConnect</Text>
        <Pressable onPress={() => router.push('profile')} style={styles.profileImageContainer}>
          <Image source={{ uri: profileData?.image || 'https://via.placeholder.com/100' }} style={styles.profileImage} />
        </Pressable>
      </View>

      {/* Feed */}
      <ScrollView contentContainerStyle={styles.feedContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postsFake}>
              <View style={styles.postHeader}>
                <Pressable onPress={() => router.push(`${post.users.id}`)}>
                  <Image source={{ uri: post.users?.image || 'https://via.placeholder.com/100' }} style={styles.profileImage} />
                </Pressable>
                <Text style={styles.userName}>{post.users?.name || 'Unknown User'}</Text>
              </View>

              <View style={styles.mediaContainer}>
                {renderMedia(post.file)}
              </View>

              <View style={styles.postFooter}>
                <View style={styles.icons}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => toggleLike(post.id)}
                  >
                    <FontAwesome
                      name={likedPosts.has(post.id) ? 'heart' : 'heart-o'}
                      size={24}
                      color={likedPosts.has(post.id) ? theme.colors.primary : 'black'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setShowCommentInput(post.id)}
                  >
                    <FontAwesome name="comment-o" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="paper-plane-outline" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.likes}>{likedPosts.has(post.id) ? `You and ${post.likeCount-1} others` : `${post.likeCount} Likes`}</Text>

                <Text style={styles.caption}>{post.body}</Text>
                <Text style={styles.time}>{formatTime(post.created_at)}</Text>

                {/* Show comment input if the post is clicked */}
                {showCommentInput === post.id && (
                  <View style={styles.commentInputContainer}>
                    <TextInput
                      value={commentText}
                      onChangeText={setCommentText}
                      placeholder="Write a comment..."
                      style={styles.commentInput}
                    />
                    <Pressable onPress={() => handleCommentSubmit(post.id)} style={styles.commentSubmitButton}>
                      <Text style={styles.commentSubmitText}>Submit</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable onPress={() => router.push('home')} style={styles.navButton}>
          <AntDesign name="home" size={28} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push('search')} style={styles.navButton}>
          <FontAwesome name="search" size={28} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push('createPost')} style={styles.navButton}>
          <MaterialIcons name="add-box" size={28} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push('notifications')} style={styles.navButton}>
          <FontAwesome name="heart-o" size={28} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push('profile')} style={styles.navButton}>
          <Ionicons name="person-outline" size={28} color="black" />
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  feedContainer: {
    paddingBottom: hp(10),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
  },
  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    marginRight: wp(2),
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  userName: {
    fontWeight: 'bold',
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    height: hp(40),
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postFooter: {
    padding: wp(3),
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wp(2),
    width: wp(30),
  },
  iconButton: {
    padding: wp(2),
  },
  likes: {
    fontWeight: 'bold',
    marginBottom: wp(1),
  },
  caption: {
    color: '#555',
  },
  time: {
    color: '#aaa',
    fontSize: hp(1.8),
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(3),
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: wp(2),
    flex: 1,
    borderRadius: 8,
  },
  commentSubmitButton: {
    padding: wp(2),
    marginLeft: wp(2),
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  commentSubmitText: {
    color: 'white',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
  },
  navButton: {
    padding: 10,
  },
});

export default Home;
