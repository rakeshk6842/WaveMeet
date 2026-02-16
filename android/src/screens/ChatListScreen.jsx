import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useChatStore } from '../stores/chatStore';
import { Header } from '../components/Common';

export const ChatListScreen = ({ navigation }) => {
  const {
    conversations,
    fetchConversations,
    selectConversation,
    isLoading,
  } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadConversations();
    });

    return unsubscribe;
  }, [navigation]);

  const loadConversations = async () => {
    await fetchConversations();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleSelectConversation = (conversation) => {
    selectConversation(conversation.id);
    navigation.navigate('ChatDetail', { 
      conversationId: conversation.id,
      conversationName: conversation.name,
    });
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleSelectConversation(item)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.conversationContent}>
        <Text style={styles.conversationName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.conversationPreview} numberOfLines={1}>
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>
          {new Date(item.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#25D366" />
      <Header title="WaveMeet" />
      
      {isLoading && conversations.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#25D366" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No conversations yet</Text>
              <TouchableOpacity
                style={styles.newChatButton}
                onPress={() => navigation.navigate('Contacts')}
              >
                <Text style={styles.newChatButtonText}>Start a new chat</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Contacts')}
      >
        <Text style={styles.fabText}>✎</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  conversationContent: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  conversationPreview: {
    fontSize: 14,
    color: '#999',
  },
  timestampContainer: {
    marginLeft: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  newChatButton: {
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newChatButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  fabText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
});
