import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export const WelcomeHero = ({ onStartChat, onOpenUsers }) => {
  return (
    <View style={styles.container}>
      {/* Central WhatsApp Web Style Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.graphicContainer}>
          <View style={styles.laptopFrame}>
            <View style={styles.phoneBadge}>
              <Text style={styles.phoneIcon}>🏢</Text>
            </View>
            <View style={styles.chatBadge}>
              <Text style={styles.chatIcon}>💬</Text>
            </View>
          </View>
        </View>

        <Text style={styles.headline}>Vedaz company Group Chat</Text>
        <Text style={styles.subtitle}>
          Welcome to the official Vedaz company group. Anyone registered can chat, send documents, photos, audio, and polls in real time!
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={onStartChat}>
          <Text style={styles.primaryButtonText}>Join Vedaz company Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Buttons Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionItem} onPress={onStartChat}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>🏢</Text>
          </View>
          <Text style={styles.actionLabel}>Vedaz Group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onOpenUsers}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>👤</Text>
          </View>
          <Text style={styles.actionLabel}>Active Users</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onStartChat}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>📄</Text>
          </View>
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onOpenUsers}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>🤖</Text>
          </View>
          <Text style={styles.actionLabel}>System Bot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.chatBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  graphicContainer: {
    marginBottom: 24,
  },
  laptopFrame: {
    width: 120,
    height: 80,
    backgroundColor: '#2A3942',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3B4A54',
    position: 'relative',
  },
  phoneBadge: {
    position: 'absolute',
    top: 14,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    fontSize: 18,
  },
  chatBadge: {
    position: 'absolute',
    top: 14,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#008069',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 18,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#202C33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  }
});
