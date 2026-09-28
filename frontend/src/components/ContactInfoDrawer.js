import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  useWindowDimensions
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials } from '../utils/formatters';

export const ContactInfoDrawer = ({
  visible,
  onClose,
  contact,
  messages = [],
  onClearChat,
  onDeleteChat,
  onDeleteContact
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;

  if (!visible || !contact) return null;

  const contactName = contact.username || 'Contact Info';
  const contactPhone = contact.phone || '+91 98765 43210';
  const avatarColor = contact.avatar_color || COLORS.primary;

  // Filter shared media/attachments in messages
  const sharedMedia = messages.filter(m => m.attachment && (m.attachment.dataUrl || m.attachment.type === 'photo'));

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.drawerContainer, isMobile ? styles.mobileContainer : styles.desktopContainer]}>
              {/* Header Bar */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeText}>{isMobile ? '←' : '✕'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact info</Text>
                <TouchableOpacity style={styles.editBtn}>
                  <Text style={styles.editText}>✏️</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
                {/* User Profile Section */}
                <View style={styles.profileSection}>
                  <View style={[styles.largeAvatar, { backgroundColor: avatarColor }]}>
                    <Text style={styles.largeAvatarText}>{getInitials(contactName)}</Text>
                  </View>

                  <Text style={styles.contactName}>{contactName}</Text>
                  <Text style={styles.contactPhone}>{contactPhone}</Text>

                  {/* Quick Action Circle Buttons */}
                  <View style={styles.quickActionsRow}>
                    <TouchableOpacity style={styles.actionCircleBtn} onPress={onClose}>
                      <View style={styles.circleIconBox}>
                        <Text style={styles.circleIcon}>🔍</Text>
                      </View>
                      <Text style={styles.circleLabel}>Search</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.sectionDivider} />

                {/* Media, links and docs */}
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>🖼️  Media, links and docs</Text>
                    <Text style={styles.sectionBadge}>{sharedMedia.length || 0}</Text>
                  </View>

                  {sharedMedia.length > 0 ? (
                    <View style={styles.mediaGrid}>
                      {sharedMedia.slice(0, 4).map((m, idx) => (
                        <View key={idx} style={styles.mediaItem}>
                          {m.attachment?.dataUrl ? (
                            <Image source={{ uri: m.attachment.dataUrl }} style={styles.mediaThumb} />
                          ) : (
                            <View style={styles.mediaPlaceholder}>
                              <Text style={{ fontSize: 16 }}>📄</Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noMediaText}>No media shared yet</Text>
                  )}
                </View>

                <View style={styles.sectionDivider} />

                {/* Settings Options List */}
                <View style={styles.optionsList}>
                  <TouchableOpacity style={styles.optionRow}>
                    <Text style={styles.optionIcon}>⭐</Text>
                    <Text style={styles.optionText}>Starred messages</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRow}>
                    <Text style={styles.optionIcon}>🔔</Text>
                    <Text style={styles.optionText}>Notification settings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRow}>
                    <Text style={styles.optionIcon}>♡</Text>
                    <Text style={styles.optionText}>Add to favourites</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRow}>
                    <Text style={styles.optionIcon}>📑</Text>
                    <Text style={styles.optionText}>Add to list</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRow}>
                    <Text style={styles.optionIcon}>📥</Text>
                    <Text style={styles.optionText}>Export chat</Text>
                  </TouchableOpacity>

                  <View style={styles.smallDivider} />

                  {/* Destructive Actions */}
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      if (onDeleteContact) onDeleteContact(contact);
                      else if (onDeleteChat) onDeleteChat();
                      onClose();
                    }}
                  >
                    <Text style={[styles.optionIcon, styles.dangerText]}>👤</Text>
                    <Text style={[styles.optionText, styles.dangerText]}>Delete contact</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      if (onClearChat) onClearChat();
                      onClose();
                    }}
                  >
                    <Text style={[styles.optionIcon, styles.dangerText]}>⛔</Text>
                    <Text style={[styles.optionText, styles.dangerText]}>Clear chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRow}>
                    <Text style={[styles.optionIcon, styles.dangerText]}>🚫</Text>
                    <Text style={[styles.optionText, styles.dangerText]}>Block {contactName}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRow}>
                    <Text style={[styles.optionIcon, styles.dangerText]}>👎</Text>
                    <Text style={[styles.optionText, styles.dangerText]}>Report {contactName}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      if (onDeleteChat) onDeleteChat();
                      onClose();
                    }}
                  >
                    <Text style={[styles.optionIcon, styles.dangerText]}>🗑️</Text>
                    <Text style={[styles.optionText, styles.dangerText]}>Delete chat</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#111B21',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  mobileContainer: {
    left: 0,
    right: 0,
    width: '100%',
  },
  desktopContainer: {
    right: 0,
    width: 380,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  header: {
    height: 60,
    backgroundColor: '#202C33',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#E9EDEF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  editBtn: {
    padding: 6,
  },
  editText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: '#111B21',
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  largeAvatarText: {
    fontSize: 46,
    fontWeight: '800',
    color: '#FFF',
  },
  contactName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E9EDEF',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCircleBtn: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  circleIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#202C33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  circleIcon: {
    fontSize: 20,
  },
  circleLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#0B141A',
  },
  smallDivider: {
    height: 1,
    backgroundColor: '#222D34',
    marginVertical: 6,
  },
  sectionBlock: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  sectionBadge: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mediaItem: {
    width: '23%',
    height: 70,
    borderRadius: 8,
    marginRight: '2%',
    marginBottom: 8,
    overflow: 'hidden',
  },
  mediaThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  mediaPlaceholder: {
    flex: 1,
    backgroundColor: '#202C33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMediaText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  optionsList: {
    paddingVertical: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
    color: '#E9EDEF',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E9EDEF',
  },
  dangerText: {
    color: '#F87171',
  }
});
