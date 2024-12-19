import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import theme from '../constants/theme'
import AntDesign from '@expo/vector-icons/AntDesign';
import { hp } from '../helpers/common';

const BackButton = ({size=24, router}) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      {/* <Ionicons name="arrowLeft" strongWidth={2.5} size={size} color={theme.colors.text} /> */}
      <AntDesign name="left" size={size} color="black" />
        
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({

  button:{
    position: 'absolute', // Enables absolute positioning
    top: 10, // Distance from the bottom of the screen
    left: 10, // Distance from the left of the screen
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: theme.borderRadius.small,
    backgroundColor: 'rgba(0,0,0,0.0)'
  }
})