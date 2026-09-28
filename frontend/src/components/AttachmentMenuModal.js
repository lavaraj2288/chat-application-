import React, { useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { COLORS } from '../theme/colors';

export const AttachmentMenuModal = ({
  visible,
  onClose,
  onPickRealFile,
  onOpenCamera,
  onOpenPollModal,
  onOpenContactModal
}) => {
  const docInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  if (!visible) return null;

  const handleFileChange = (event, category) => {
    const file = event.target.files && event.target.files[0];
    if (file && onPickRealFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPickRealFile({
          category,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          dataUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
    onClose();
  };

  const handleItemPress = (optionId) => {
    if (optionId === 'document' && docInputRef.current) {
      docInputRef.current.click();
    } else if (optionId === 'photos' && photoInputRef.current) {
      photoInputRef.current.click();
    } else if (optionId === 'audio' && audioInputRef.current) {
      audioInputRef.current.click();
    } else if (optionId === 'camera' && onOpenCamera) {
      onClose();
      onOpenCamera();
    } else if (optionId === 'poll' && onOpenPollModal) {
      onClose();
      onOpenPollModal();
    } else if (optionId === 'contact' && onOpenContactModal) {
      onClose();
      onOpenContactModal();
    } else if (optionId === 'event') {
      onClose();
      if (onPickRealFile) {
        onPickRealFile({
          category: 'event',
          fileName: '📅 Team Event: Project Sync & Review',
          fileSize: 0,
          fileType: 'event'
        });
      }
    } else if (optionId === 'sticker') {
      onClose();
      if (onPickRealFile) {
        onPickRealFile({
          category: 'sticker',
          fileName: '✨ Custom WhatsApp Sticker',
          fileSize: 0,
          fileType: 'sticker'
        });
      }
    }
  };

  const options = [
    { id: 'document', label: 'Document', icon: '📄', color: '#7F56D9' },
    { id: 'photos', label: 'Photos & videos', icon: '🖼️', color: '#2E90FA' },
    { id: 'camera', label: 'Camera', icon: '📷', color: '#EE46BC' },
    { id: 'audio', label: 'Audio', icon: '🎧', color: '#F79009' },
    { id: 'contact', label: 'Contact', icon: '👤', color: '#06AED4' },
    { id: 'poll', label: 'Poll', icon: '📊', color: '#FAB814' },
    { id: 'event', label: 'Event', icon: '📅', color: '#F04438' },
    { id: 'sticker', label: 'New sticker', icon: '✨', color: '#12B76A' },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Hidden HTML File Inputs for Real File Dialogs */}
          <input
            type="file"
            ref={docInputRef}
            style={{ display: 'none' }}
            accept="*/*"
            onChange={(e) => handleFileChange(e, 'document')}
          />
          <input
            type="file"
            ref={photoInputRef}
            style={{ display: 'none' }}
            accept="image/*,video/*"
            onChange={(e) => handleFileChange(e, 'photos')}
          />
          <input
            type="file"
            ref={audioInputRef}
            style={{ display: 'none' }}
            accept="audio/*"
            onChange={(e) => handleFileChange(e, 'audio')}
          />

          <TouchableWithoutFeedback>
            <View style={styles.popoverContainer}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.menuRow}
                  onPress={() => handleItemPress(opt.id)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: opt.color + '22' }]}>
                    <Text style={[styles.iconText, { color: opt.color }]}>{opt.icon}</Text>
                  </View>
                  <Text style={styles.label}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  popoverContainer: {
    position: 'absolute',
    bottom: 75,
    left: 16,
    width: 230,
    backgroundColor: '#233138',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 16,
  },
  label: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#E9EDEF',
  }
});
