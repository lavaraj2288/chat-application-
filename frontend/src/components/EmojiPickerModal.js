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

const EMOJI_CATEGORIES = [
  {
    id: 'smileys',
    name: 'Smileys & People',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '🥹', '😅', '😂', '🤣', '🥲',
      '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
      '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐',
      '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟',
      '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭',
      '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
      '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤫', '🫠', '🤥', '😶',
      '🫥', '😐', '😑', '🫨', '😬', '🙄', '😯', '😦', '😧', '😮',
      '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮',
      '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👺', '👹',
      '💀', '☠️', '👻', '👽', '🤖', '💩', '👍', '👎', '👏', '🙌',
      '🫶', '👐', '🤲', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '👌',
      '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️'
    ]
  },
  {
    id: 'animals',
    name: 'Animals & Nature',
    icon: '🐻',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨',
      '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
      '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞',
      '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢',
      '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡',
      '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓'
    ]
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '☕',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
      '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
      '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
      '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳',
      '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟',
      '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘',
      '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙',
      '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦'
    ]
  },
  {
    id: 'activity',
    name: 'Activity & Sports',
    icon: '⚽',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
      '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷',
      '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️'
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: '🚗',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🤴', '🏎️', '🚓', '🚑', '🚒', '🚐',
      '🛻', '🚚', '🚛', '🚜', '👩‍🦽', '🛵', '🏍️', '🛺', '🚨', '🚔',
      '🚘', '🚍', '🚖', '🛞', '🚡', '🚠', '🚟', '🚃', '🚋', '🚝',
      '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫'
    ]
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: '💡',
    emojis: [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️',
      '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
      '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️',
      '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋'
    ]
  },
  {
    id: 'symbols',
    name: 'Symbols',
    icon: '🔣',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
      '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐'
    ]
  },
  {
    id: 'flags',
    name: 'Flags',
    icon: '🚩',
    emojis: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇮🇳', '🇺🇸',
      '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇰🇷', '🇧🇷', '🇲🇽', '🇿🇦'
    ]
  }
];

export const EmojiPickerModal = ({ visible, onClose, onSelectEmoji }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [bottomTab, setBottomTab] = useState('emoji'); // 'emoji' | 'gif' | 'sticker'

  if (!visible) return null;

  const currentCat = EMOJI_CATEGORIES.find((c) => c.id === activeCategory) || EMOJI_CATEGORIES[0];

  // Filter emojis by search query if present
  let displayEmojis = currentCat.emojis;
  if (searchQuery.trim().length > 0) {
    displayEmojis = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.panelContainer}>
              {/* Top Category Tabs Bar */}
              <View style={styles.categoryBar}>
                {EMOJI_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id && !searchQuery;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catTab, isActive && styles.activeCatTab]}
                      onPress={() => {
                        setActiveCategory(cat.id);
                        setSearchQuery('');
                      }}
                    >
                      <Text style={[styles.catIcon, isActive && styles.activeCatIcon]}>{cat.icon}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search emoji"
                    placeholderTextColor={COLORS.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              {/* Category Title Header */}
              <Text style={styles.categoryTitle}>
                {searchQuery ? 'Search Results' : currentCat.name}
              </Text>

              {/* Scrollable Emoji Grid */}
              <ScrollView contentContainerStyle={styles.emojiGrid} showsVerticalScrollIndicator={true}>
                {displayEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={`${emoji}-${index}`}
                    style={styles.emojiCell}
                    onPress={() => {
                      if (onSelectEmoji) onSelectEmoji(emoji);
                    }}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Bottom Selector Tabs Bar (Emoji | GIF | Sticker) */}
              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={[styles.bottomTabBtn, bottomTab === 'emoji' && styles.activeBottomTab]}
                  onPress={() => setBottomTab('emoji')}
                >
                  <Text style={styles.bottomTabIcon}>😊</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.bottomTabBtn, bottomTab === 'gif' && styles.activeBottomTab]}
                  onPress={() => setBottomTab('gif')}
                >
                  <Text style={styles.bottomTabText}>GIF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.bottomTabBtn, bottomTab === 'sticker' && styles.activeBottomTab]}
                  onPress={() => setBottomTab('sticker')}
                >
                  <Text style={styles.bottomTabIcon}>🏷️</Text>
                </TouchableOpacity>
              </View>
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
  panelContainer: {
    position: 'absolute',
    bottom: 75,
    left: 10,
    right: 10,
    maxWidth: 380,
    height: 380,
    backgroundColor: '#111B21', // WhatsApp Web dark theme background
    borderRadius: 16,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  catTab: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeCatTab: {
    borderBottomColor: COLORS.primary,
  },
  catIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  activeCatIcon: {
    opacity: 1,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202C33',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchIcon: {
    fontSize: 13,
    marginRight: 8,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#E9EDEF',
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  emojiCell: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  emojiText: {
    fontSize: 22,
  },
  bottomBar: {
    height: 44,
    backgroundColor: '#202C33',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomTabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  activeBottomTab: {
    backgroundColor: '#111B21',
  },
  bottomTabIcon: {
    fontSize: 16,
  },
  bottomTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  }
});
