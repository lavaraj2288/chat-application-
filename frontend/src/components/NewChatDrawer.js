import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials } from '../utils/formatters';

export const NewChatDrawer = ({
  visible,
  onClose,
  users = [],
  currentUser,
  onSelectContact,
  onNewGroup,
  onNewContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!visible) return null;

  const filteredUsers = users.filter((u) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  const handleContactClick = (user) => {
    onClose();
    if (onSelectContact) onSelectContact(user);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.drawerContainer}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                  <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New chat</Text>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>⠿</Text>
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search name, number or @username"
                    placeholderTextColor={COLORS.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                  <View style={styles.actionSection}>
                    {/* Green Action 1: New group */}
                    <TouchableOpacity
                      style={styles.greenActionRow}
                      onPress={() => {
                        onClose();
                        if (onNewGroup) onNewGroup();
                      }}
                    >
                      <View style={styles.greenCircle}>
                        <Text style={styles.greenCircleIcon}>👥</Text>
                      </View>
                      <Text style={styles.actionText}>New group</Text>
                    </TouchableOpacity>

                    {/* Green Action 2: New contact */}
                    <TouchableOpacity
                      style={styles.greenActionRow}
                      onPress={() => {
                        onClose();
                        if (onNewContact) onNewContact();
                      }}
                    >
                      <View style={styles.greenCircle}>
                        <Text style={styles.greenCircleIcon}>👤</Text>
                      </View>
                      <Text style={styles.actionText}>New contact</Text>
                    </TouchableOpacity>

                    {/* Green Action 3: New community */}
                    <TouchableOpacity style={styles.greenActionRow}>
                      <View style={styles.greenCircle}>
                        <Text style={styles.greenCircleIcon}>👥</Text>
                      </View>
                      <Text style={styles.actionText}>New community</Text>
                    </TouchableOpacity>

                    {/* Self Row: Current User (You) */}
                    {currentUser && (
                      <TouchableOpacity
                        style={styles.selfRow}
                        onPress={() => handleContactClick(currentUser)}
                      >
                        <View style={[styles.avatar, { backgroundColor: currentUser.avatar_color || COLORS.primary }]}>
                          <Text style={styles.avatarText}>{getInitials(currentUser.username)}</Text>
                        </View>
                        <View style={styles.rowContent}>
                          <Text style={styles.username}>{currentUser.username} (You)</Text>
                          <Text style={styles.statusText}>Message yourself</Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    <Text style={styles.alphabetHeader}>#</Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userRow}
                    onPress={() => handleContactClick(item)}
                  >
                    <View style={[styles.avatar, { backgroundColor: item.avatar_color || COLORS.primary }]}>
                      <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
                    </View>
                    <View style={styles.rowContent}>
                      <Text style={styles.username}>{item.username}</Text>
                      <Text style={styles.statusText} numberOfLines={1}>
                        {item.phone || item.email || (item.status === 'online' ? 'Available - Live in ChatApp 💫' : 'Offline')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
              />
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
    left: 60, // Positioned right next to the 60px sidebar rail, covering the left chat list
    bottom: 0,
    width: 320,
    backgroundColor: '#111B21', // Dark background matching screenshot
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    height: 60,
    backgroundColor: '#202C33',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 6,
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
    flex: 1,
    marginLeft: 12,
  },
  gridIconBox: {
    padding: 6,
  },
  gridIcon: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#111B21',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202C33',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#E9EDEF',
  },
  actionSection: {
    paddingTop: 4,
  },
  greenActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greenCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00A884', // WhatsApp Green Accent matching screenshot
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  greenCircleIcon: {
    fontSize: 20,
    color: '#FFF',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E9EDEF',
  },
  selfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  rowContent: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  statusText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  alphabetHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 74,
  },
  listContent: {
    paddingBottom: 20,
  }
});
