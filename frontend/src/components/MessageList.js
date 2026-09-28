import React, { useRef, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { MessageItem } from './MessageItem';
import { COLORS } from '../theme/colors';

export const MessageList = ({ messages, currentUser, onRefresh, refreshing, isLoading }) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Central Date Badge */}
      <View style={styles.dateBadgeContainer}>
        <Text style={styles.dateBadgeText}>Today</Text>
      </View>

      {/* Security & Encryption Notice Box */}
      <View style={styles.securityBox}>
        <Text style={styles.securityText}>
          🔒 Messages are real-time broadcasted with Socket.io and persisted with SQLite.
        </Text>
      </View>
    </View>
  );

  if (isLoading && messages.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading chat history...</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id || `${item.timestamp}-${Math.random()}`}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <MessageItem message={item} currentUser={currentUser} />
      )}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBadgeContainer: {
    backgroundColor: '#182229',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  dateBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  securityBox: {
    backgroundColor: '#182229',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '85%',
    alignItems: 'center',
  },
  securityText: {
    color: '#FFD279', // WhatsApp yellow encryption text color
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 17,
  }
});
