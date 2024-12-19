import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import theme from '../constants/theme'
import { hp } from '../helpers/common'

const RichTextEditor = ({
  editoRef,
  onChange
}) => {
  return (
    <View style={{mainHeight: 285}}>
      <RichToolbar
      actions={[
      actions.insertImage,
      actions.setBold,
      actions.setItalic,
      actions.insertBulletsList,
      actions.insertOrderedList,
      actions.insertLink,
      actions.keyboard,
      actions.setStrikethrough,
      actions.setUnderline,
      actions.removeFormat,
      actions.insertVideo,
      actions.checkboxList,
      actions.undo,
      actions.redo,
      ]}
      iconMap={{

      }}
      style={styles.richBar}
      flatContainerStyle={styles.listStyle}
      selectedIconTint ={theme.colors.dark}
      editor={editoRef}
      diabled={false} 
      />
      <RichEditor
        ref={editoRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={"What's on your mind?"}
        onChange={onChange}
        />

    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.borderRadius.large,
    borderTopLeftRadius: theme.borderRadius.large,
    
    backgroundColor: "f1f1f1",
  },
  rich:{
    minHeight:50,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.borderRadius.large,
    borderBottomRightRadius: theme.borderRadius.large,  
    borderColor: theme.colors.lightGrey,
    padding: 5,

  },
  contentStyle:{
    color: theme.colors.text.primary,
    placeholderColor: theme.colors.lightGrey
  }
})