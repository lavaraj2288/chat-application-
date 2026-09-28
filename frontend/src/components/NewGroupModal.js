import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials } from '../utils/formatters';

export const NewGroupModal = ({
  visible,
  onClose,
  users = [],
  currentUser,
  onCreateGroup
}) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!visible) return null;

  // Filter out current user & existing group objects
  const availableUsers = users.filter((u) => {
    if (u.id === currentUser?.id || u.isGroup || u.id === 'vedaz_company') return false;
    if (searchQuery.trim() === '') return true;
    return u.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    if (selectedUserIds.length === 0) {
      alert('Please select at least one contact for the group');
      return;
    }

    setIsSubmitting(true);
    try {
      const allMembers = Array.from(new Set([...selectedUserIds, currentUser?.id].filter(Boolean)));
      await onCreateGroup({
        name: groupName.trim(),
        memberIds: allMembers
      });
      // Reset form
      setGroupName('');
      setSelectedUserIds([]);
      onClose();
    } catch (err) {
      console.error('Create group failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create New Group</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Group Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter group subject (e.g. Project Team)"
              placeholderTextColor={COLORS.textMuted}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          {/* Search Contacts */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts to add"
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Selection Counter */}
          <View style={styles.counterRow}>
            <Text style={styles.counterText}>
              Selected Members: <Text style={styles.counterHighlight}>{selectedUserIds.length}</Text>
            </Text>
          </View>

          {/* Contact Picker List */}
          {availableUsers.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No available contacts found</Text>
            </View>
          ) : (
            <FlatList
              data={availableUsers}
              keyExtractor={(item) => item.id}
              style={styles.userList}
              renderItem={({ item }) => {
                const isSelected = selectedUserIds.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.userRow, isSelected && styles.selectedUserRow]}
                    onPress={() => toggleSelectUser(item.id)}
                  >
                    <View style={[styles.avatar, { backgroundColor: item.avatar_color || COLORS.primary }]}>
                      <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
                    </View>

                    <View style={styles.userInfo}>
                      <Text style={styles.username}>{item.username}</Text>
                      <Text style={styles.userStatus}>
                        {item.status === 'online' ? '🟢 Online' : 'Offline'}
                      </Text>
                    </View>

                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}

          {/* Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createBtn,
                (!groupName.trim() || selectedUserIds.length === 0 || isSubmitting) && styles.disabledBtn
              ]}
              onPress={handleCreateGroup}
              disabled={!groupName.trim() || selectedUserIds.length === 0 || isSubmitting}
            >
              <Text style={styles.createBtnText}>
                {isSubmitting ? 'Creating...' : `Create Group (${selectedUserIds.length})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: '#111B21',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  nameInput: {
    backgroundColor: '#202C33',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202C33',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 12,
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
  counterRow: {
    marginBottom: 8,
  },
  counterText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  counterHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  userList: {
    maxHeight: 220,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectedUserRow: {
    backgroundColor: '#202C33',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userStatus: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  emptyBox: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  disabledBtn: {
    backgroundColor: '#2A3942',
    opacity: 0.6,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  }
});
