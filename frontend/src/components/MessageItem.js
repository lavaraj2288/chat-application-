import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { formatMessageTime, getInitials } from '../utils/formatters';

export const MessageItem = ({ message, currentUser }) => {
  const isMyMessage =
    message.sender_id === currentUser?.id ||
    message.sender_name?.toLowerCase() === currentUser?.username?.toLowerCase();

  const formattedTime = formatMessageTime(message.timestamp);

  // Check if message contains attachment JSON or data URL
  let attachment = message.attachment;
  if (!attachment && message.text && message.text.startsWith('{') && message.text.endsWith('}')) {
    try {
      attachment = JSON.parse(message.text);
    } catch (e) {}
  }

  // Render Attachment Card
  const renderAttachmentContent = () => {
    if (!attachment) {
      return (
        <Text style={[styles.messageText, isMyMessage ? styles.myText : styles.otherText]}>
          {message.text}
        </Text>
      );
    }

    if (attachment.type === 'photo' || attachment.type === 'camera' || attachment.dataUrl) {
      return (
        <View style={styles.attachmentBox}>
          {attachment.dataUrl ? (
            <Image
              source={{ uri: attachment.dataUrl }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          ) : null}
          <Text style={[styles.attachmentTitle, isMyMessage ? styles.myText : styles.otherText]}>
            {attachment.fileName || '🖼️ Photo Attachment'}
          </Text>
        </View>
      );
    }

    if (attachment.type === 'document') {
      return (
        <View style={styles.docCard}>
          <View style={styles.docIconBox}>
            <Text style={styles.docIcon}>📄</Text>
          </View>
          <View style={styles.docMeta}>
            <Text style={styles.docName} numberOfLines={1}>
              {attachment.fileName || 'Document.pdf'}
            </Text>
            <Text style={styles.docSize}>
              {attachment.fileSize ? `${Math.round(attachment.fileSize / 1024)} KB` : 'Document file'}
            </Text>
          </View>
        </View>
      );
    }

    if (attachment.type === 'poll') {
      return (
        <View style={styles.pollCard}>
          <Text style={styles.pollQuestion}>📊 {attachment.question}</Text>
          {attachment.options?.map((opt, idx) => (
            <TouchableOpacity key={idx} style={styles.pollOptionBtn}>
              <Text style={styles.pollOptionText}>{opt.text}</Text>
              <Text style={styles.pollVoteCount}>{opt.votes || 0} votes</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <Text style={[styles.messageText, isMyMessage ? styles.myText : styles.otherText]}>
        {message.text}
      </Text>
    );
  };

  return (
    <View style={[styles.wrapper, isMyMessage ? styles.wrapperRight : styles.wrapperLeft]}>
      {!isMyMessage && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(message.sender_name)}</Text>
        </View>
      )}

      <View style={styles.contentContainer}>
        {!isMyMessage && (
          <Text style={styles.senderName}>{message.sender_name}</Text>
        )}

        <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
          {renderAttachmentContent()}

          <View style={styles.metaRow}>
            <Text style={[styles.timeText, isMyMessage ? styles.myTimeText : styles.otherTimeText]}>
              {formattedTime}
            </Text>
            {isMyMessage && (
              <Text style={[styles.statusCheck, message.status === 'read' ? styles.readCheck : styles.sentCheck]}>
                {message.status === 'read' ? ' ✓✓' : ' ✓'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 14,
    alignItems: 'flex-end',
  },
  wrapperRight: {
    justifyContent: 'flex-end',
  },
  wrapperLeft: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  contentContainer: {
    maxWidth: '78%',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
  },
  myBubble: {
    backgroundColor: COLORS.myBubble,
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: COLORS.otherBubble,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: COLORS.myBubbleText,
  },
  otherText: {
    color: COLORS.otherBubbleText,
  },
  attachmentBox: {
    width: 220,
    marginBottom: 4,
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 6,
  },
  attachmentTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
    minWidth: 200,
    marginBottom: 4,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  docIcon: {
    fontSize: 18,
  },
  docMeta: {
    flex: 1,
  },
  docName: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  docSize: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  pollCard: {
    minWidth: 220,
    marginBottom: 4,
  },
  pollQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  pollOptionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollOptionText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  pollVoteCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 3,
  },
  timeText: {
    fontSize: 10,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  otherTimeText: {
    color: COLORS.textMuted,
  },
  statusCheck: {
    fontSize: 11,
    marginLeft: 2,
    fontWeight: 'bold',
  },
  sentCheck: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  readCheck: {
    color: '#6EE7B7',
  }
});
