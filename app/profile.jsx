import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Pressable, Alert, Modal, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import theme from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Video } from 'expo-av';  // Import the Video component from expo-av

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('userId', user.id);

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchUserData();
    fetchPosts();
  }, [user]);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign out', 'Error signing out!');
    } else {
      setAuth(null);
      router.push('/login');
    }
  };

  const renderPost = ({ item }) => {
    const fileType = item.file?.split('.').pop()?.toLowerCase(); // Extract file type (image or video)

    // If file is a video, render the Video component, otherwise render Image
    if (fileType === 'mp4' || fileType === 'mov' || fileType === 'avi') {
      return (
        <Video
          source={{ uri: item.file }}  // Video source
          style={styles.postImage}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
      );
    } else {
      return <Image source={{ uri: item.file }} style={styles.postImage} />;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('home')}>
          <AntDesign name="arrowleft" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <AntDesign name="ellipsis1" size={28} color="black" />
        </Pressable>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: profileData?.image || 'https://via.placeholder.com/100' }}
          style={styles.profilePicture}
        />
        <View style={styles.profileStats}>
          <Text style={styles.statNumber}>{posts?.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.profileStats}>
          <Text style={styles.statNumber}>1.2k</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.profileStats}>
          <Text style={styles.statNumber}>300</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bio}>
        <Text style={styles.username}>{profileData?.name || 'User'}</Text>
        <Text style={styles.bioText}>{profileData?.bio || 'No bio available'}</Text>
      </View>

      {/* Post Grid */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.postGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal for Logout or Edit Profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push('/editProfile');
              }}
            >
              <Text style={styles.modalButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                onLogout();
              }}
            >
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default Profile;

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
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    marginRight: wp(4),
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  profileStats: {
    alignItems: 'center',
    marginHorizontal: wp(4),
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: hp(2.5),
  },
  statLabel: {
    fontSize: hp(1.5),
    color: '#555',
  },
  bio: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  username: {
    fontWeight: 'bold',
    fontSize: hp(2),
  },
  bioText: {
    fontSize: hp(1.8),
    color: '#555',
    marginTop: hp(0.5),
  },
  postGrid: {
    paddingHorizontal: wp(1),
  },
  postImage: {
    width: wp(31),
    height: wp(31),
    margin: wp(1),
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalButtonText: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});
