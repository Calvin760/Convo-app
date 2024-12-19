import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import theme from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Loading from '../components/Loading';
import { View } from 'react-native';
const Button = ({
  buttonStyle,
  textStyle,
  title = '',
  onPress = () => { },
  loading = false,
  hasShadow = true,
}) => {
  // Shadow styles for elevated effect
  const shadowStyle = {
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  };

    if(loading){
     return (
       <View style={[styles.button, buttonStyle, {backgroundColor: 'white'}]}>
         <Loading/>
       </View>
     )
   }
  return (

    <Pressable
      onPress={loading ? null : onPress} // Disable when loading
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        hasShadow && shadowStyle,
        pressed && styles.pressedEffect,
        loading && styles.disabledButton,
      ]}
    >
 (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )
      
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: hp(6.6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(3.3), // Fully rounded edges
    paddingHorizontal: wp(5),
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled || '#d3d3d3',
  },
  pressedEffect: {
    opacity: 0.85, // Slight transparency when pressed
  },
  text: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: theme.typography.fontWeights.bold,
  },
});
