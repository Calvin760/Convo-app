import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getUserData } from '../services/userService';

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("User session:", session?.user);

      if (session) {
        setAuth(session.user);
        updateUserData(session?.user)
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    });


    return () => {
      subscription?.unsubscribe();
    };
  }, []); 

  const updateUserData = async (user) => {
    let res =await getUserData(user?.id);
    console.log('got user data: ', res)
  }
  return (
    <Stack
      screenOptions={{ headerShown: false }}
    />
  );
};

export default _layout;
