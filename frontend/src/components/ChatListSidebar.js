import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials, formatMessageTime } from '../utils/formatters';

export const ChatListSidebar = ({
  users = [],
  messages = [],
  currentUser,
  activeChat,
  onSelectChat,
  onNewChat,
  onOpenMenu,
  style
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Unread', 'Users', 'Groups'];

  // Build comprehensive chat list including users, activeChat, and message contacts
  const allMap = new Map();

  users.forEach((u) => {
    if (u && u.id) allMap.set(u.id, u);
  });

  if (activeChat && activeChat.id) {
    if (!allMap.has(activeChat.id)) {
      allMap.set(activeChat.id, activeChat);
    }
  }

  messages.forEach((m) => {
    if (m.sender_id && m.sender_id !== currentUser?.id && !allMap.has(m.sender_id)) {
      allMap.set(m.sender_id, {
        id: m.sender_id,
        username: m.sender_name || 'User',
        status: 'offline',
        avatar_color: COLORS.primary
      });
    }
    if (
      m.receiver_id &&
      m.receiver_id !== currentUser?.id &&
      m.receiver_id !== 'public' &&
      m.receiver_id !== 'vedaz_company' &&
      !allMap.has(m.receiver_id)
    ) {
      allMap.set(m.receiver_id, {
        id: m.receiver_id,
        username: 'Contact',
        status: 'offline',
        avatar_color: COLORS.primary
      });
    }
  });

  const combinedUsers = Array.from(allMap.values());

  const filteredUsers = combinedUsers.filter((u) => {
    if (searchQuery.trim() !== '' && !u.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeFilter === 'Unread') {
      const userMsgs = messages.filter((m) => m.sender_id === u.id);
      return userMsgs.some((m) => m.status !== 'read');
    }
    if (activeFilter === 'Groups') {
      return u.isGroup || u.id === 'public' || u.id === 'vedaz_company';
    }
    if (activeFilter === 'Users') {
      return !u.isGroup && u.id !== 'public' && u.id !== 'vedaz_company';
    }

    // Always keep activeChat and Vedaz company
    if (activeChat?.id === u.id || u.id === 'vedaz_company') {
      return true;
    }

    // Keep if user has message history
    const hasMsgs = messages.some(
      (m) =>
        (m.sender_id === currentUser?.id && m.receiver_id === u.id) ||
        (m.sender_id === u.id && (m.receiver_id === currentUser?.id || !m.receiver_id)) ||
        (m.sender_id === u.id || m.receiver_id === u.id)
    );

    if (hasMsgs) return true;

    // If it's currentUser and not activeChat and has no msgs, hide
    if (u.id === currentUser?.id) return false;

    return true;
  });

  // Sort list by latest message timestamp descending
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const getLatestTime = (item) => {
      const itemMsgs = messages.filter((m) => {
        if (item.id === 'vedaz_company' || item.id === 'public') {
          return m.receiver_id === 'vedaz_company' || m.receiver_id === 'public' || !m.receiver_id;
        }
        return (
          (m.sender_id === currentUser?.id && m.receiver_id === item.id) ||
          (m.sender_id === item.id && (m.receiver_id === currentUser?.id || !m.receiver_id)) ||
          (m.sender_id === item.id || m.receiver_id === item.id)
        );
      });
      if (itemMsgs.length > 0) {
        return new Date(itemMsgs[itemMsgs.length - 1].timestamp).getTime();
      }
      return 0;
    };

    return getLatestTime(b) - getLatestTime(a);
  });

  return (
    <View style={[styles.container, style]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatApp</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onNewChat}>
            <View style={styles.plusBadge}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onOpenMenu}>
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search or start a new chat"
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {filters.map((f) => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Chat / User List */}
      {sortedUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No chats found</Text>
          <Text style={styles.emptySubtitle}>Start a conversation with online users</Text>
        </View>
      ) : (
        <FlatList
          data={sortedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = activeChat?.id === item.id;
            // Get last message sent between currentUser and this user/group
            const userMessages = messages.filter((m) => {
              if (item.id === 'vedaz_company' || item.id === 'public') {
                return m.receiver_id === 'vedaz_company' || m.receiver_id === 'public' || !m.receiver_id;
              }
              return (
                (m.sender_id === currentUser?.id && m.receiver_id === item.id) ||
                (m.sender_id === item.id && m.receiver_id === currentUser?.id)
              );
            });
            const lastMsg = userMessages[userMessages.length - 1];

            return (
              <TouchableOpacity
                style={[styles.userRow, isSelected && styles.selectedRow]}
                onPress={() => onSelectChat(item)}
              >
                <View style={styles.avatarWrapper}>
                  <View style={[styles.avatar, { backgroundColor: item.avatar_color || COLORS.primary }]}>
                    <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: item.status === 'online' ? COLORS.online : COLORS.offline }
                    ]}
                  />
                </View>

                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <Text style={styles.username} numberOfLines={1}>{item.username}</Text>
                    {lastMsg ? (
                      <Text style={styles.timeText}>{formatMessageTime(lastMsg.timestamp)}</Text>
                    ) : null}
                  </View>

                  <Text style={styles.lastMsgText} numberOfLines={1}>
                    {lastMsg ? lastMsg.text : (item.status === 'online' ? '🟢 Online - Tap to chat' : 'Offline')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    backgroundColor: COLORS.listBg,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  header: {
    height: 60,
    backgroundColor: COLORS.listBg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 8,
  },
  plusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  menuIcon: {
    color: COLORS.textSecondary,
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterChip: {
    backgroundColor: COLORS.chipBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 6,
  },
  activeFilterChip: {
    backgroundColor: COLORS.chipActiveBg,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: COLORS.primary,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedRow: {
    backgroundColor: '#2A3942',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.listBg,
  },
  rowContent: {
    flex: 1,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  lastMsgText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 72,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  }
});
