import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { initializeSocket, socketEmitters, socketListeners } from '../services/socket';
import { Header } from '../components/Common';

export const ChatDetailScreen = ({ route, navigation }) => {
  const { conversationId, conversationName } = route.params;
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const { messages, fetchMessages, sendMessage, addMessage, isLoading, selectConversation } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    selectConversation(conversationId);
    loadMessages();
    
    const socket = initializeSocket();

    // Set up socket listeners
    socketListeners.onMessageReceive((data) => {
      if (data.conversationId === conversationId) {
        addMessage(conversationId, data.message);
      }
    });

    socketListeners.onTypingStart((data) => {
      if (data.conversationId === conversationId) {
        useChatStore.getState().setTypingUser(conversationId, data.userId, true);
      }
    });

    socketListeners.onTypingStop((data) => {
      if (data.conversationId === conversationId) {
        useChatStore.getState().setTypingUser(conversationId, data.userId, false);
      }
    });

    return () => {
      socketEmitters.stopTyping(conversationId);
    };
  }, [conversationId]);

  const loadMessages = async () => {
    await fetchMessages(conversationId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const result = await sendMessage(conversationId, newMessage);
    if (result.success) {
      setNewMessage('');
      socketEmitters.stopTyping(conversationId);
    }
  };

  const handleTyping = (text) => {
    setNewMessage(text);

    if (!isTyping) {
      setIsTyping(true);
      socketEmitters.startTyping(conversationId);
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      setIsTyping(false);
      socketEmitters.stopTyping(conversationId);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const conversationMessages = messages[conversationId] || [];

  const renderMessage = ({ item }) => {
    const isUserMessage = item.senderId === user?.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage && styles.userMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUserMessage && styles.userMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUserMessage && styles.userMessageText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isUserMessage && styles.userMessageTime,
            ]}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Header title={conversationName} />

      {isLoading && conversationMessages.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#25D366" />
        </View>
      ) : (
        <>
          <FlatList
            data={[...conversationMessages].reverse()}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            scrollEventThrottle={16}
            contentContainerStyle={styles.messagesList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={newMessage}
              onChangeText={handleTyping}
              multiline
              maxHeight={100}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newMessage.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>→</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 10,
  },
  userMessageBubble: {
    backgroundColor: '#25D366',
  },
  messageText: {
    color: '#000',
    fontSize: 14,
  },
  userMessageText: {
    color: '#FFF',
  },
  messageTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  userMessageTime: {
    color: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
