import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { COLORS } from '../theme/colors';

export const OptionsMenuModal = ({
  visible,
  onClose,
  onNewGroup,
  onStarredMessages,
  onSelectChats,
  onMarkAllAsRead,
  onOpenSettings,
  onLogout
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              {/* 1. New group */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onNewGroup) onNewGroup();
                }}
              >
                <Text style={styles.menuIcon}>👥</Text>
                <Text style={styles.menuText}>New group</Text>
              </TouchableOpacity>

              {/* 2. Starred messages */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onStarredMessages) onStarredMessages();
                }}
              >
                <Text style={styles.menuIcon}>⭐</Text>
                <Text style={styles.menuText}>Starred messages</Text>
              </TouchableOpacity>

              {/* 3. Select chats */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onSelectChats) onSelectChats();
                }}
              >
                <Text style={styles.menuIcon}>☑️</Text>
                <Text style={styles.menuText}>Select chats</Text>
              </TouchableOpacity>

              {/* 4. Mark all as read */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onMarkAllAsRead) onMarkAllAsRead();
                }}
              >
                <Text style={styles.menuIcon}>💬</Text>
                <Text style={styles.menuText}>Mark all as read</Text>
              </TouchableOpacity>

              {/* 5. Settings */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onOpenSettings) onOpenSettings();
                }}
              >
                <Text style={styles.menuIcon}>⚙️</Text>
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 6. Log out */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onLogout) onLogout();
                }}
              >
                <Text style={styles.menuIcon}>🚪</Text>
                <Text style={styles.menuText}>Log out</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    top: 55,
    right: 12,
    width: 210,
    backgroundColor: '#233138', // WhatsApp Web dark menu background
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    fontSize: 16,
    marginRight: 14,
    opacity: 0.9,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E9EDEF',
  },
  divider: {
    height: 1,
    backgroundColor: '#111B21',
    marginVertical: 4,
  }
});
