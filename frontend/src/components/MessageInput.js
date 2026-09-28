import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS } from '../theme/colors';
import { AttachmentMenuModal } from './AttachmentMenuModal';
import { EmojiPickerModal } from './EmojiPickerModal';

export const MessageInput = ({
  onSendMessage,
  onSendAttachment,
  onOpenCamera,
  onOpenPollModal,
  onOpenContactModal,
  onTypingStart,
  onTypingStop,
  disabled
}) => {
  const [text, setText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleTextChange = (newText) => {
    setText(newText);

    if (newText.trim().length > 0) {
      if (!isTypingRef.current && onTypingStart) {
        isTypingRef.current = true;
        onTypingStart();
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        if (isTypingRef.current && onTypingStop) {
          isTypingRef.current = false;
          onTypingStop();
        }
      }, 1500);
    } else {
      if (isTypingRef.current && onTypingStop) {
        isTypingRef.current = false;
        onTypingStop();
      }
    }
  };

  const handleSend = (textToSend) => {
    const targetText = textToSend || text;
    const trimmed = targetText.trim();
    if (!trimmed || disabled) return;

    if (isTypingRef.current && onTypingStop) {
      isTypingRef.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTypingStop();
    }

    onSendMessage(trimmed);
    if (!textToSend) setText('');
  };

  const handlePickRealFile = (fileData) => {
    if (onSendAttachment) {
      onSendAttachment(fileData);
    } else {
      handleSend(`📄 [${fileData.category.toUpperCase()}] ${fileData.fileName}`);
    }
  };

  const handleSelectEmoji = (emoji) => {
    const newText = text + emoji;
    handleTextChange(newText);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Text style={styles.iconText}>😊</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
        >
          <Text style={styles.iconText}>📎</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor={COLORS.textMuted}
          value={text}
          onChangeText={handleTextChange}
          multiline={false}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
          editable={!disabled}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!text.trim() || disabled) && styles.sendButtonDisabled
          ]}
          onPress={() => handleSend()}
          disabled={!text.trim() || disabled}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>

      {/* Emoji Picker Modal Panel */}
      <EmojiPickerModal
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelectEmoji={handleSelectEmoji}
      />

      {/* Attachment Options Popover Menu */}
      <AttachmentMenuModal
        visible={showAttachmentMenu}
        onClose={() => setShowAttachmentMenu(false)}
        onPickRealFile={handlePickRealFile}
        onOpenCamera={onOpenCamera}
        onOpenPollModal={onOpenPollModal}
        onOpenContactModal={onOpenContactModal}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.headerBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  iconBtn: {
    padding: 8,
  },
  iconText: {
    fontSize: 20,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.inputBg,
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  }
});
