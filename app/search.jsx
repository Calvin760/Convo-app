import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp, wp } from '../helpers/common';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For the back button
import { supabase } from '../lib/supabase'; // Assuming you have Supabase set up for fetching users
import theme from '../constants/theme'; // Import theme file

const Search = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Fetch users from Supabase or your API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, name, image') // Adjust the columns as per your table structure
                    .ilike('name', `%${query}%`);  // This will filter users by name based on query

                if (error) {
                    console.error('Error fetching users:', error);
                } else {
                    setUsers(data);
                    setFilteredUsers(data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (query.length > 0) {
            fetchUsers(); // Fetch users if query is not empty
        } else {
            setFilteredUsers(users); // Show all users when query is empty
        }
    }, [query]); // Re-run whenever the query changes

    // Render each search result
    const renderSearchResult = ({ item }) => (
        <View style={styles.resultContainer}>
            <Pressable onPress={() => router.push(`/profile/${item.id}`)}>
                <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.resultImage} />
                <Text style={styles.resultName}>{item.name}</Text>
            </Pressable>
        </View>
    );

    return (
        <ScreenWrapper>
            {/* Header with back button */}
            <View style={styles.headerContainer}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.light} />
                </Pressable>
                <Text style={styles.header}>Search</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.primary} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search users..."
                    value={query}
                    onChangeText={setQuery}
                    placeholderTextColor={theme.colors.secondary}
                />
            </View>

            {/* Display No Results message if necessary */}
            {filteredUsers.length === 0 && query.length > 0 ? (
                <Text style={styles.noResults}>No users found</Text>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.resultsGrid}
                />
            )}
        </ScreenWrapper>
    );
};

export default Search;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(4),
        marginTop: hp(3),
        // backgroundColor: theme.colors.primary,  // Primary background color
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.lightGrey, // Secondary color for borders
    },
    backButton: {
        marginRight: wp(2),
    },
    header: {
        fontSize: hp(3),
        fontWeight: theme.typography.fontWeights.bold,
        flex: 1,
        textAlign: 'center',
        color: theme.colors.light, // White text for contrast on primary color
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.lightGrey,
        borderRadius: theme.borderRadius.medium,
        marginVertical: hp(2),
        paddingHorizontal: wp(4),
    },
    searchIcon: {
        marginRight: wp(2),
    },
    input: {
        flex: 1,
        padding: wp(4),
        fontSize: hp(2),
        color: theme.colors.primary, // Text color matching theme primary
    },
    resultsGrid: {
        paddingHorizontal: wp(1),
    },
    resultContainer: {
        alignItems: 'center',
        marginBottom: hp(2),
    },
    resultImage: {
        width: wp(31),
        height: wp(31),
        margin: wp(1),
        borderRadius: wp(15.5), // This makes the image round
        borderWidth: 2,
        borderColor: theme.colors.lightGrey, // Matching border color
    },
    resultName: {
        marginTop: hp(1),
        fontSize: hp(1.8),
        textAlign: 'center',
        color: theme.colors.text.primary,
    },
    noResults: {
        textAlign: 'center',
        marginVertical: hp(2),
        fontSize: hp(2),
        color: theme.colors.secondary,
    },
});
