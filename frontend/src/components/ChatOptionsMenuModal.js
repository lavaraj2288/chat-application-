import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { COLORS } from '../theme/colors';

export const ChatOptionsMenuModal = ({
  visible,
  onClose,
  onContactInfo,
  onSearch,
  onSelectMessages,
  onClearChat,
  onCloseChat
}) => {
  if (!visible) return null;

  const handleAction = (callback) => {
    onClose();
    if (callback) callback();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              <ScrollView showsVerticalScrollIndicator={true} style={styles.scroll}>
                {/* 1. Contact info */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction(onContactInfo)}>
                  <Text style={styles.menuIcon}>ℹ️</Text>
                  <Text style={styles.menuText}>Contact info</Text>
                </TouchableOpacity>

                {/* 2. Search */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction(onSearch)}>
                  <Text style={styles.menuIcon}>🔍</Text>
                  <Text style={styles.menuText}>Search</Text>
                </TouchableOpacity>

                {/* 3. Select messages */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction(onSelectMessages)}>
                  <Text style={styles.menuIcon}>☑️</Text>
                  <Text style={styles.menuText}>Select messages</Text>
                </TouchableOpacity>

                {/* 4. Mute notifications */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>🔕</Text>
                  <Text style={styles.menuText}>Mute notifications</Text>
                  <Text style={styles.arrowText}>▶</Text>
                </TouchableOpacity>

                {/* 5. Disappearing messages */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>⏱️</Text>
                  <Text style={styles.menuText}>Disappearing messages</Text>
                </TouchableOpacity>

                {/* 6. Chat theme */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>🎨</Text>
                  <Text style={styles.menuText}>Chat theme</Text>
                </TouchableOpacity>

                {/* 7. Add to favourites */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>❤️</Text>
                  <Text style={styles.menuText}>Add to favourites</Text>
                </TouchableOpacity>

                {/* 8. Add to list */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>📑</Text>
                  <Text style={styles.menuText}>Add to list</Text>
                  <Text style={styles.arrowText}>▶</Text>
                </TouchableOpacity>

                {/* 9. Export chat */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>📥</Text>
                  <Text style={styles.menuText}>Export chat</Text>
                </TouchableOpacity>

                {/* 10. Close chat */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction(onCloseChat)}>
                  <Text style={styles.menuIcon}>❌</Text>
                  <Text style={styles.menuText}>Close chat</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* 11. Send call link */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>🔗</Text>
                  <Text style={styles.menuText}>Send call link</Text>
                </TouchableOpacity>

                {/* 12. Schedule call */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>📅</Text>
                  <Text style={styles.menuText}>Schedule call</Text>
                </TouchableOpacity>

                {/* 13. New group call */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>👥</Text>
                  <Text style={styles.menuText}>New group call</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* 14. Report */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>👎</Text>
                  <Text style={styles.menuText}>Report</Text>
                </TouchableOpacity>

                {/* 15. Block */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction()}>
                  <Text style={styles.menuIcon}>🚫</Text>
                  <Text style={styles.menuText}>Block</Text>
                </TouchableOpacity>

                {/* 16. Clear chat */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction(onClearChat)}>
                  <Text style={styles.menuIcon}>⛔</Text>
                  <Text style={styles.menuText}>Clear chat</Text>
                </TouchableOpacity>

                {/* 17. Delete chat */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleAction(onCloseChat)}>
                  <Text style={styles.menuIcon}>🗑️</Text>
                  <Text style={[styles.menuText, { color: '#F87171' }]}>Delete chat</Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    top: 55,
    right: 16, // Positioned on the TOP RIGHT next to the active chat header 3-dots
    width: 250,
    maxHeight: 480,
    backgroundColor: '#233138', // WhatsApp Web dark menu background
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scroll: {
    maxHeight: 460,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuIcon: {
    fontSize: 16,
    marginRight: 14,
    opacity: 0.9,
    width: 20,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#E9EDEF',
  },
  arrowText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#111B21',
    marginVertical: 4,
  }
});
