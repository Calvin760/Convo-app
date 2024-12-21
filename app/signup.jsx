import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import { hp, wp } from '../helpers/common';
import theme from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

const SignUp = () => {
    const router = useRouter();
    const emailRef = useRef('');
    const nameRef = useRef('');
    const passwordRef = useRef('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        const email = emailRef.current?.trim();
        const name = nameRef.current?.trim();
        const password = passwordRef.current?.trim();

        if (!email || !name || !password) {
            Alert.alert('Sign Up', 'Please fill all the fields!');
            return;
        }

        setLoading(true);

        const { data: {session }, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                },
            },
        });

        setLoading(false);
        // console.log('session: ', session)
        // console.log('error: ', error)
        if (error) {
            Alert.alert('Sign Up', error.message);
            return;
        }

        Alert.alert('Sign Up', 'Account created successfully! Please check your email to confirm.');
        router.push('login'); // Navigate to Login screen after sign-up
    };

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <BackButton router={router} />
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Let's get started</Text>
                <View style={styles.form}>
                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={hp(3)} color={theme.colors.text.primary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor={theme.colors.text.secondary || '#888'}
                            onChangeText={(text) => (nameRef.current = text)}
                            returnKeyType="next"
                        />
                    </View>
                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={hp(3)} color={theme.colors.text.primary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            placeholderTextColor={theme.colors.text.secondary || '#888'}
                            onChangeText={(text) => (emailRef.current = text)}
                            returnKeyType="next"
                        />
                    </View>
                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={hp(3)} color={theme.colors.text.primary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            placeholderTextColor={theme.colors.text.secondary || '#888'}
                            onChangeText={(text) => (passwordRef.current = text)}
                            returnKeyType="done"
                        />
                    </View>
                    {/* Sign Up Button */}
                    <Button
                        title={'Sign Up'}
                        buttonStyle={styles.button}
                        onPress={handleSignUp}
                        loading={loading}
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Text
                        style={styles.loginText}
                        onPress={() => router.push('login')}
                    >
                        Login
                    </Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(5),
    },
    title: {
        fontSize: hp(4),
        color: theme.colors.text.primary,
        fontWeight: theme.typography?.fontWeights?.bold || '700',
        marginBottom: hp(1),
    },
    subtitle: {
        fontSize: hp(2.5),
        color: theme.colors.text.secondary || '#888',
        marginBottom: hp(3),
        textAlign: 'center',
    },
    form: {
        width: '100%',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border || '#ddd',
        borderRadius: theme.borderRadius.medium,
        borderRadius: hp(3.3),
        paddingHorizontal: wp(4),
        marginBottom: hp(2),
        backgroundColor: 'white',
        height: hp(6.5),
        width: '100%',
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
        marginTop: hp(2),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: hp(2),
        color: theme.colors.text.secondary || '#888',
        marginRight: wp(1),
    },
    loginText: {
        fontSize: hp(2),
        color: theme.colors.primary,
        fontWeight: theme.typography?.fontWeights?.bold || '700',
        textDecorationLine: 'underline',
    },
});
