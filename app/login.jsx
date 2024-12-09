import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import { hp, wp } from '../helpers/common';
import theme from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase'; // Ensure this is properly imported

const Login = () => {
    const router = useRouter();
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const onSubmit = async () => {
        const email = emailRef.current?.trim();
        const password = passwordRef.current?.trim();

        if (!email || !password) {
            Alert.alert('Login', 'Please fill all the fields!');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Login', 'Please enter a valid email address!');
            return;
        }

        setLoading(true);

        const { data: { session }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        console.log('session: ', session);
        console.log('error: ', error);

        if (error) {
            Alert.alert('Login', error.message);
            return;
        }

        Alert.alert('Login', 'Logged in successfully!');
        router.push('home'); // Navigate to home screen after login
    };

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <Text style={styles.welcomeMessage}>Hey, Welcome Back!</Text>
                <Text style={styles.title}>Login</Text>
                <View style={styles.form}>
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

                    <Button
                        title={loading ? 'Logging in...' : 'Login'}
                        buttonStyle={styles.button}
                        onPress={onSubmit}
                        disabled={loading}
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Text
                        style={styles.signupText}
                        onPress={() => {
                            router.push('signup');
                            console.log('Signup pressed');
                        }}
                    >
                        Sign up
                    </Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(5),
    },
    welcomeMessage: {
        fontSize: hp(2.5),
        color: theme.colors.text.secondary || '#888',
        marginBottom: hp(1),
        textAlign: 'center',
    },
    title: {
        fontSize: hp(4),
        color: theme.colors.text.primary,
        fontWeight: theme.typography?.fontWeights?.bold || '700',
        marginBottom: hp(3),
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
    signupText: {
        fontSize: hp(2),
        color: theme.colors.primary,
        fontWeight: theme.typography?.fontWeights?.bold || '700',
        textDecorationLine: 'underline',
    },
});
