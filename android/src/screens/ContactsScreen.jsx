import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { contactsAPI } from '../services/api';
import { useChatStore } from '../stores/chatStore';
import { Header } from '../components/Common';

export const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const { createConversation } = useChatStore();

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const response = await contactsAPI.getAll();
      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (error) {
      alert('Failed to load contacts: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleContactSelection = (contact) => {
    const isSelected = selectedContacts.some((c) => c.id === contact.id);
    if (isSelected) {
      setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleCreateConversation = async () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }

    try {
      setIsLoading(true);
      const participantIds = selectedContacts.map((c) => c.id);
      const name =
        selectedContacts.length === 1
          ? selectedContacts[0].name
          : selectedContacts.map((c) => c.name).join(', ');

      const result = await createConversation(participantIds, name);
      if (result.success) {
        navigation.navigate('ChatList');
      }
    } catch (error) {
      alert('Failed to create conversation: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContact = ({ item }) => {
    const isSelected = selectedContacts.some((c) => c.id === item.id);
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => toggleContactSelection(item)}
      >
        <View
          style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected,
          ]}
        >
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactStatus}>{item.status || 'Hey there!'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Select Contacts" />
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading && filteredContacts.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#25D366" />
        </View>
      ) : (
        <>
          <FlatList
            data={filteredContacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No contacts found</Text>
              </View>
            }
          />

          {selectedContacts.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.selectedCount}>
                {selectedContacts.length} selected
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateConversation}
                disabled={isLoading}
              >
                <Text style={styles.createButtonText}>Create Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    backgroundColor: '#FFF',
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  contactStatus: {
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  selectedCount: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
