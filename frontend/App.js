import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform, useWindowDimensions } from 'react-native';

import { SidebarRail } from './src/components/SidebarRail';
import { ChatListSidebar } from './src/components/ChatListSidebar';
import { WelcomeHero } from './src/components/WelcomeHero';
import { Header } from './src/components/Header';
import { MessageList } from './src/components/MessageList';
import { MessageInput } from './src/components/MessageInput';
import { TypingIndicator } from './src/components/TypingIndicator';
import { LoginModal } from './src/components/LoginModal';
import { UserListModal } from './src/components/UserListModal';
import { OptionsMenuModal } from './src/components/OptionsMenuModal';
import { ChatOptionsMenuModal } from './src/components/ChatOptionsMenuModal';
import { ContactInfoDrawer } from './src/components/ContactInfoDrawer';
import { NewChatDrawer } from './src/components/NewChatDrawer';
import { SettingsDrawer } from './src/components/SettingsDrawer';
import { WebCameraModal } from './src/components/WebCameraModal';
import { PollCreationModal } from './src/components/PollCreationModal';
import { NewGroupModal } from './src/components/NewGroupModal';
import { ConnectionBanner } from './src/components/ConnectionBanner';

import { COLORS } from './src/theme/colors';
import {
  initSocket,
  getSocket,
  joinUser,
  sendSocketMessage,
  emitTypingStart,
  emitTypingStop,
  emitCreateGroup,
  disconnectSocket
} from './src/services/socketService';
import {
  fetchChatHistory,
  fetchUsersApi,
  sendMessageApi,
  clearChatApi,
  deleteUserApi
} from './src/config/api';

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;

  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');

  const showSidebar = !isMobile || (isMobile && !activeChat);
  const showChatWindow = !isMobile || (isMobile && activeChat !== null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modals & Drawers state
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showRightOptionsMenu, setShowRightOptionsMenu] = useState(false);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [showNewChatDrawer, setShowNewChatDrawer] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  // Restore saved login session on load
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('chatapp_user');
        if (saved) {
          const user = JSON.parse(saved);
          setCurrentUser(user);
          setShowLoginModal(false);
        }
      }
    } catch (e) {}
  }, []);

  // 1. Fetch Chat History via REST API
  const loadChatHistory = useCallback(async () => {
    try {
      const history = await fetchChatHistory();
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setIsLoadingHistory(false);
      setRefreshing(false);
    }
  }, []);

  // 2. Fetch Users List
  const loadUsers = useCallback(async () => {
    try {
      const userList = await fetchUsersApi();
      setUsers(userList);
    } catch (err) {
      console.error('Failed to fetch users list:', err);
    }
  }, []);

  // 3. Initialize Socket.io Connection & Listeners
  useEffect(() => {
    const socket = initSocket();

    const handleConnect = () => {
      setIsConnected(true);
      if (currentUser) {
        joinUser(currentUser.username, currentUser.id);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewMessage = (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    };

    const handleUsersList = (updatedUsers) => {
      setUsers(updatedUsers);
    };

    const handleUserTyping = ({ userId, username }) => {
      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === userId)) return prev;
        return [...prev, { userId, username }];
      });
    };

    const handleUserStoppedTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    const handleChatCleared = ({ targetId, userId1, userId2 }) => {
      setMessages((prev) =>
        prev.filter((m) => {
          if (targetId === 'vedaz_company' || targetId === 'public' || (targetId && targetId.startsWith('grp_'))) {
            return m.receiver_id !== targetId;
          }
          return !(
            (m.sender_id === userId1 && m.receiver_id === userId2) ||
            (m.sender_id === userId2 && m.receiver_id === userId1) ||
            m.sender_id === targetId ||
            m.receiver_id === targetId
          );
        })
      );
    };

    const handleContactDeleted = ({ userId }) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setMessages((prev) => prev.filter((m) => m.sender_id !== userId && m.receiver_id !== userId));
      setActiveChat((prev) => (prev?.id === userId ? null : prev));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_message', handleNewMessage);
    socket.on('users_list', handleUsersList);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('chat_cleared', handleChatCleared);
    socket.on('contact_deleted', handleContactDeleted);

    setIsConnected(socket.connected);

    loadChatHistory();
    loadUsers();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('users_list', handleUsersList);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
      socket.off('chat_cleared', handleChatCleared);
      socket.off('contact_deleted', handleContactDeleted);
    };
  }, [currentUser, loadChatHistory, loadUsers]);

  // Filter messages for active chat room / user (1-on-1 Individual Chat vs Group)
  const displayMessages = messages.filter((m) => {
    if (!activeChat) return true;
    if (activeChat.id === 'vedaz_company' || activeChat.id === 'public') {
      return m.receiver_id === 'vedaz_company' || m.receiver_id === 'public' || !m.receiver_id;
    }
    // Strict 1-on-1 Individual Direct Chat
    return (
      (m.sender_id === currentUser?.id && m.receiver_id === activeChat.id) ||
      (m.sender_id === activeChat.id && m.receiver_id === currentUser?.id)
    );
  });

  // Handle Send Message
  const handleSendMessage = async (text, attachmentData = null) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    const messageData = {
      text: text || 'Attachment',
      attachment: attachmentData,
      senderId: currentUser.id,
      senderName: currentUser.username,
      receiverId: activeChat && activeChat.id !== 'public' ? activeChat.id : 'vedaz_company'
    };

    const socket = getSocket();
    if (socket && socket.connected) {
      sendSocketMessage(messageData, (ack) => {
        if (!ack || !ack.success) {
          console.warn('Socket message ack failed, falling back to REST');
        }
      });
    } else {
      try {
        const savedMsg = await sendMessageApi(messageData);
        setMessages((prev) => [...prev, savedMsg]);
      } catch (err) {
        console.error('REST sendMessage error:', err);
      }
    }
  };

  // Real Laptop File Attachment Handler
  const handleSendAttachment = (fileData) => {
    handleSendMessage(`📄 ${fileData.fileName}`, {
      type: fileData.category,
      fileName: fileData.fileName,
      fileSize: fileData.fileSize,
      dataUrl: fileData.dataUrl
    });
  };

  // Webcam Photo Capture Handler
  const handleCapturePhoto = (dataUrl) => {
    handleSendMessage('📷 Photo Captured from Laptop Camera', {
      type: 'photo',
      fileName: 'Camera_Photo.jpg',
      dataUrl
    });
  };

  // Poll Creation Handler
  const handleCreatePoll = (pollData) => {
    handleSendMessage(`📊 ${pollData.question}`, {
      type: 'poll',
      question: pollData.question,
      options: pollData.options
    });
  };

  // Group Creation Handler
  const handleCreateGroup = (groupData) => {
    emitCreateGroup(groupData, (res) => {
      if (res && res.success) {
        setActiveChat(res.data);
      }
    });

    const tempGroup = {
      id: 'grp_' + Date.now(),
      username: groupData.name,
      avatar_color: '#00A884',
      status: `Group • ${groupData.memberIds.length} members`,
      isGroup: true
    };
    setUsers((prev) => [tempGroup, ...prev.filter(u => u.id !== tempGroup.id)]);
    setActiveChat(tempGroup);
    setShowNewGroupModal(false);
  };

  const handleRefreshHistory = () => {
    setRefreshing(true);
    loadChatHistory();
    loadUsers();
  };

  const handleMarkAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, status: 'read' })));
  };

  const handleDeleteContact = async (targetContact) => {
    const target = targetContact || activeChat;
    if (!target) return;

    try {
      await deleteUserApi(target.id);
    } catch (err) {
      console.warn('REST deleteUser error:', err);
    }

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('delete_contact', { userId: target.id });
    }

    // Permanently remove contact from users state
    setUsers((prev) => prev.filter((u) => u.id !== target.id));

    // Permanently clear messages for this contact from state
    setMessages((prev) => prev.filter((m) => m.sender_id !== target.id && m.receiver_id !== target.id));

    // Reset active chat if it was the target contact
    if (activeChat?.id === target.id) {
      setActiveChat(null);
    }
  };

  const handleClearCurrentChat = async () => {
    if (!activeChat) return;

    const targetId = activeChat.id;
    const userId1 = currentUser?.id;
    const userId2 = activeChat.id;

    try {
      await clearChatApi({ userId1, userId2, targetId });
    } catch (err) {
      console.warn('REST clearChat error:', err);
    }

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('clear_chat', { userId1, userId2, targetId });
    }

    // Permanently purge messages from state
    setMessages((prev) =>
      prev.filter((m) => {
        if (targetId === 'vedaz_company' || targetId === 'public' || targetId.startsWith('grp_')) {
          return m.receiver_id !== targetId;
        }
        return !(
          (m.sender_id === userId1 && m.receiver_id === userId2) ||
          (m.sender_id === userId2 && m.receiver_id === userId1) ||
          m.sender_id === targetId ||
          m.receiver_id === targetId
        );
      })
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChat(null);
    disconnectSocket();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('chatapp_user');
      }
    } catch (e) {}
    setShowLoginModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.sidebarBg} />
      <View style={styles.container}>
        <ConnectionBanner isConnected={isConnected} />

        <View style={styles.mainLayout}>
          {/* Leftmost Icon Rail (Desktop only) */}
          {!isMobile && (
            <SidebarRail
              activeTab={activeTab}
              onTabSelect={setActiveTab}
              currentUser={currentUser}
              onOpenProfile={() => setShowSettingsDrawer(true)}
            />
          )}

          {/* Left Chat List Column */}
          {showSidebar && (
            <ChatListSidebar
              style={isMobile ? styles.mobileSidebar : styles.desktopSidebar}
              users={users}
              messages={messages}
              currentUser={currentUser}
              activeChat={activeChat}
              onSelectChat={(chat) => setActiveChat(chat)}
              onNewChat={() => setShowNewChatDrawer(true)}
              onOpenMenu={() => setShowOptionsMenu(true)}
            />
          )}

          {/* Right Main Chat / Welcome Window */}
          {showChatWindow && (
            <View style={styles.chatWindowContainer}>
              {activeChat ? (
                <View style={styles.activeChatContainer}>
                  <Header
                    activeChat={activeChat}
                    currentUser={currentUser}
                    isConnected={isConnected}
                    onOpenUsers={() => setShowContactDrawer(true)}
                    onOpenRightMenu={() => setShowRightOptionsMenu(true)}
                    onBack={isMobile ? () => setActiveChat(null) : null}
                  />

                  <View style={styles.chatBody}>
                    <MessageList
                      messages={displayMessages}
                      currentUser={currentUser}
                      onRefresh={handleRefreshHistory}
                      refreshing={refreshing}
                      isLoading={isLoadingHistory}
                    />
                    <TypingIndicator typingUsers={typingUsers} />
                  </View>

                  <MessageInput
                    onSendMessage={(t) => handleSendMessage(t)}
                    onSendAttachment={handleSendAttachment}
                    onOpenCamera={() => setShowCameraModal(true)}
                    onOpenPollModal={() => setShowPollModal(true)}
                    onOpenContactModal={() => setShowContactDrawer(true)}
                    onTypingStart={emitTypingStart}
                    onTypingStop={emitTypingStop}
                    disabled={!currentUser}
                  />
                </View>
              ) : (
                <WelcomeHero
                  onStartChat={() => setActiveChat({ id: 'vedaz_company', username: 'Vedaz company', isGroup: true, avatar_color: '#00A884' })}
                  onOpenUsers={() => setShowUsersModal(true)}
                />
              )}
            </View>
          )}
        </View>

        {/* WhatsApp Web Settings Drawer */}
        <SettingsDrawer
          visible={showSettingsDrawer}
          onClose={() => setShowSettingsDrawer(false)}
          currentUser={currentUser}
          onOpenProfile={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />

        {/* New Chat Green + Button Drawer */}
        <NewChatDrawer
          visible={showNewChatDrawer}
          onClose={() => setShowNewChatDrawer(false)}
          users={users}
          currentUser={currentUser}
          onSelectContact={(user) => setActiveChat(user)}
          onNewGroup={() => {
            setShowNewChatDrawer(false);
            setShowNewGroupModal(true);
          }}
          onNewContact={() => setShowUsersModal(true)}
        />

        {/* Contact Info Side Drawer */}
        <ContactInfoDrawer
          visible={showContactDrawer}
          onClose={() => setShowContactDrawer(false)}
          contact={activeChat || currentUser}
          messages={displayMessages}
          onClearChat={handleClearCurrentChat}
          onDeleteContact={handleDeleteContact}
          onDeleteChat={() => {
            handleClearCurrentChat();
            setActiveChat(null);
          }}
        />

        {/* Left 3-Dots Options Menu Modal */}
        <OptionsMenuModal
          visible={showOptionsMenu}
          onClose={() => setShowOptionsMenu(false)}
          onNewGroup={() => {
            setShowOptionsMenu(false);
            setShowNewGroupModal(true);
          }}
          onStarredMessages={handleRefreshHistory}
          onSelectChats={() => setShowUsersModal(true)}
          onMarkAllAsRead={handleMarkAllAsRead}
          onOpenSettings={() => setShowSettingsDrawer(true)}
          onLogout={handleLogout}
        />

        {/* Right Active Chat 3-Dots Menu Modal */}
        <ChatOptionsMenuModal
          visible={showRightOptionsMenu}
          onClose={() => setShowRightOptionsMenu(false)}
          onContactInfo={() => setShowContactDrawer(true)}
          onSearch={() => {}}
          onSelectMessages={() => {}}
          onClearChat={handleClearCurrentChat}
          onCloseChat={() => setActiveChat(null)}
        />

        {/* Web Camera Modal */}
        <WebCameraModal
          visible={showCameraModal}
          onClose={() => setShowCameraModal(false)}
          onCapturePhoto={handleCapturePhoto}
        />

        {/* Poll Creation Modal */}
        <PollCreationModal
          visible={showPollModal}
          onClose={() => setShowPollModal(false)}
          onCreatePoll={handleCreatePoll}
        />

        {/* New Group Modal */}
        <NewGroupModal
          visible={showNewGroupModal}
          onClose={() => setShowNewGroupModal(false)}
          users={users}
          currentUser={currentUser}
          onCreateGroup={handleCreateGroup}
        />

        {/* Auth Modal */}
        <LoginModal
          visible={showLoginModal}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            joinUser(user.username, user.id);
            setShowLoginModal(false);
            try {
              if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('chatapp_user', JSON.stringify(user));
              }
            } catch (e) {}
          }}
          onClose={() => setShowLoginModal(false)}
        />

        {/* User Drawer Modal */}
        <UserListModal
          visible={showUsersModal}
          onClose={() => setShowUsersModal(false)}
          users={users}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.sidebarBg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileSidebar: {
    width: '100%',
    flex: 1,
    borderRightWidth: 0,
  },
  desktopSidebar: {
    width: 320,
  },
  chatWindowContainer: {
    flex: 1,
    backgroundColor: COLORS.chatBg,
  },
  activeChatContainer: {
    flex: 1,
  },
  chatBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
