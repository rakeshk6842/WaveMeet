import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { Header } from '../components/Common';

export const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, logout, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [status, setStatus] = useState(user?.status || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = async () => {
    const result = await updateProfile({ name, status });
    if (result.success) {
      setIsEditing(false);
      alert('Profile updated successfully');
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#25D366" />
      <Header title="Profile" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={name}
              onChangeText={setName}
              editable={isEditing && !isLoading}
              placeholder="Your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Status</Text>
            <TextInput
              style={[
                styles.input,
                styles.statusInput,
                !isEditing && styles.inputDisabled,
              ]}
              value={status}
              onChangeText={setStatus}
              editable={isEditing && !isLoading}
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          {isEditing && (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { flex: 1 }]}
                onPress={handleUpdateProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, { flex: 1, marginLeft: 8 }]}
                onPress={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {!isEditing && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Help & Support</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#E74C3C" />
            ) : (
              <Text style={[styles.buttonText, styles.buttonTextDanger]}>
                Logout
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '700',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFF',
    marginVertical: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
  },
  statusInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimary: {
    backgroundColor: '#25D366',
  },
  buttonSecondary: {
    backgroundColor: '#E0E0E0',
  },
  buttonDanger: {
    backgroundColor: '#FADBD8',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: '#000',
  },
  buttonTextDanger: {
    color: '#E74C3C',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
  settingArrow: {
    fontSize: 16,
    color: '#999',
  },
});
