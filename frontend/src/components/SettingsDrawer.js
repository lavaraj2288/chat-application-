import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials } from '../utils/formatters';

export const SettingsDrawer = ({
  visible,
  onClose,
  currentUser,
  onOpenProfile,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!visible) return null;

  const userName = currentUser?.username || 'Guest';
  const avatarColor = currentUser?.avatar_color || COLORS.primary;

  const handleAction = (callback) => {
    onClose();
    if (callback) callback();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.drawerContainer}>
              {/* Top Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                  <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search settings"
                      placeholderTextColor={COLORS.textMuted}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>

                {/* Profile Header & "Share a thought" Bubble */}
                <TouchableOpacity style={styles.profileHeader} onPress={() => handleAction(onOpenProfile)}>
                  <View style={styles.thoughtBubble}>
                    <Text style={styles.thoughtText}>Share a thought</Text>
                    <View style={styles.thoughtArrow} />
                  </View>

                  <View style={[styles.largeAvatar, { backgroundColor: avatarColor }]}>
                    <Text style={styles.largeAvatarText}>{getInitials(userName)}</Text>
                  </View>

                  <Text style={styles.userNameText}>{userName}</Text>
                  <Text style={styles.userSubText}>Available - Click to view profile</Text>
                </TouchableOpacity>

                {/* Settings Items List */}
                <View style={styles.settingsList}>
                  {/* General */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction()}>
                    <Text style={styles.itemIcon}>💻</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>General</Text>
                      <Text style={styles.itemSubtitle}>Startup and close</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Profile */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction(onOpenProfile)}>
                    <Text style={styles.itemIcon}>👤</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>Profile</Text>
                      <Text style={styles.itemSubtitle}>Name, profile picture, username</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Account */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction()}>
                    <Text style={styles.itemIcon}>🔑</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>Account</Text>
                      <Text style={styles.itemSubtitle}>Security notifications, account info</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Privacy */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction()}>
                    <Text style={styles.itemIcon}>🔒</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>Privacy</Text>
                      <Text style={styles.itemSubtitle}>Blocked contacts, disappearing messages</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Chats */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction()}>
                    <Text style={styles.itemIcon}>💬</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>Chats</Text>
                      <Text style={styles.itemSubtitle}>Theme, wallpaper, chat settings</Text>
                    </View>
                  </TouchableOpacity>


                  {/* Notifications */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction()}>
                    <Text style={styles.itemIcon}>🔔</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>Notifications</Text>
                      <Text style={styles.itemSubtitle}>Messages, groups, sounds</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Keyboard shortcuts */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction()}>
                    <Text style={styles.itemIcon}>⌨️</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>Keyboard shortcuts</Text>
                      <Text style={styles.itemSubtitle}>Quick actions</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Help and feedback */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction()}>
                    <Text style={styles.itemIcon}>❓</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>Help and feedback</Text>
                      <Text style={styles.itemSubtitle}>Help centre, contact us, privacy policy</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.smallDivider} />

                  {/* Log out (Red text matching screenshot) */}
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleAction(onLogout)}>
                    <Text style={[styles.itemIcon, styles.dangerText]}>🚪</Text>
                    <View style={styles.itemTextContainer}>
                      <Text style={[styles.itemTitle, styles.dangerText]}>Log out</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 60, // Positioned right next to the 60px sidebar rail
    bottom: 0,
    width: 320,
    backgroundColor: '#111B21',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    height: 60,
    backgroundColor: '#202C33',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 6,
    marginRight: 12,
  },
  backText: {
    color: '#E9EDEF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202C33',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 38,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#E9EDEF',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  thoughtBubble: {
    backgroundColor: '#202C33',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thoughtText: {
    color: '#8696A0',
    fontSize: 12,
    fontWeight: '600',
  },
  thoughtArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    backgroundColor: '#202C33',
    transform: [{ rotate: '45deg' }],
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  largeAvatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFF',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E9EDEF',
    marginTop: 4,
  },
  userSubText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  settingsList: {
    paddingTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  activeItemRow: {
    backgroundColor: '#1F2C34', // Highlighted item matching screenshot
    borderRadius: 12,
    marginHorizontal: 8,
  },
  itemIcon: {
    fontSize: 18,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
    color: '#E9EDEF',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E9EDEF',
  },
  itemSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  smallDivider: {
    height: 1,
    backgroundColor: '#222D34',
    marginVertical: 6,
  },
  dangerText: {
    color: '#F87171', // Red / Salmon text color matching uploaded screenshot
  }
});
