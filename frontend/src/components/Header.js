import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials } from '../utils/formatters';

export const Header = ({ activeChat, currentUser, isConnected, onOpenUsers, onOpenRightMenu, onBack }) => {
  const displayName = activeChat?.username || 'Vedaz company';
  const displayAvatar = activeChat?.avatar_color || '#00A884';

  const getSubTitle = () => {
    if (!isConnected) return 'connecting...';
    if (activeChat?.isGroup || activeChat?.id === 'vedaz_company') {
      return 'Vedaz company • Company Group (Everyone can chat)';
    }
    return activeChat?.status === 'online' ? 'online' : 'click for contact info';
  };

  return (
    <View style={styles.container}>
      {/* Left Contact Info */}
      <View style={styles.leftSection}>
        {onBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.contactRow} onPress={onOpenUsers}>
          <View style={[styles.avatar, { backgroundColor: displayAvatar }]}>
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{displayName}</Text>
            <Text style={styles.statusText}>{getSubTitle()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Right Header Icons (Search 🔍 and Right Active Chat 3-Dots Menu ⋮) */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconBtn} onPress={onOpenUsers}>
          <Text style={styles.iconText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onOpenRightMenu}>
          <Text style={styles.iconText}>⋮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: COLORS.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  userInfo: {
    justifyContent: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 10,
    marginLeft: 6,
  },
  iconText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '700',
  }
});
