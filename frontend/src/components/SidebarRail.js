import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials } from '../utils/formatters';

export const SidebarRail = ({ activeTab, onTabSelect, currentUser, onOpenProfile }) => {
  const tabs = [
    { id: 'chats', icon: '💬', label: 'Chats' },
    { id: 'status', icon: '⭕', label: 'Status' },
    { id: 'users', icon: '👥', label: 'Users' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onTabSelect(t.id)}
            >
              <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>{t.icon}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.avatarContainer} onPress={onOpenProfile}>
          <View style={[styles.avatar, { backgroundColor: currentUser?.avatar_color || COLORS.primary }]}>
            <Text style={styles.avatarText}>{getInitials(currentUser?.username || 'Guest')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    backgroundColor: '#111B21',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
  },
  tabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  activeTabButton: {
    backgroundColor: '#202C33',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
  },
  bottomSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    padding: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  }
});
