import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { hp, wp } from '../helpers/common';
import theme from '../constants/theme';
import Button from '../components/Button';
import { useRouter } from 'expo-router';

const Welcome = () => {
  const router =useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Welcome image */}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require('../assets/images/welcome.png')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>LinkUp!</Text>
          <Text style={styles.punchline}>
            Where every thought finds a home and every image tells a story
          </Text>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={styles.buttonStyle}
            onPress={() => {
              router.push('signup')
              console.log('Getting Started pressed');
            }}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginPromptText}>Already have an account?</Text>
            <Pressable onPress={() => { 
              router.push('login')
              console.log('Login pressed')
             }
              
              }>
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: wp(4),
    paddingTop: hp(10), // Adds spacing from the top
  },
  welcomeImage: {
    height: hp(30),
    width: wp(80), // Ensures image fits well within the screen
    alignSelf: 'center',
    marginBottom: hp(5), // Adds space between the image and text
  },
  textContainer: {
    alignItems: 'center',
    gap: hp(2), // Consistent spacing between title and punchline
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.typography?.fontWeights?.bold || '700', // Fallback for font weight
  },
  punchline: {
    color: theme.colors.text.primary,
    fontSize: hp(2),
    textAlign: 'center',
    fontWeight: theme.typography?.fontWeights?.regular || '400', // Regular weight for readability
    paddingHorizontal: wp(10),
  },
  footer: {
    marginTop: hp(5), // Adds spacing above the footer
    width: '100%',
    alignItems: 'center',
  },
  buttonStyle: {
    marginHorizontal: wp(3),
    width: wp(80), // Ensures the button fits nicely within the view
    borderRadius: hp(3.3), // Fully rounded button
  },
  bottomTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2), // Adds spacing above the text
  },
  loginPromptText: {
    color: theme.colors.text.secondary || '#888',
    fontSize: hp(2),
    marginRight: wp(1), // Adds spacing between the prompt and the "Login" text
  },
  loginText: {
    color: theme.colors.primary,
    fontSize: hp(2),
    fontWeight: theme.typography?.fontWeights?.bold || '700',
    textDecorationLine: 'underline',
  },
});
