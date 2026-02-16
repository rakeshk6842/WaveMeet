import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const Button = ({ onPress, title, variant = 'primary', disabled = false, style }) => {
  const styles = getStyles();
  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.secondaryButton,
    disabled && styles.disabledButton,
    style,
  ];

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={buttonStyle}>
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const TextInput = ({ placeholder, value, onChangeText, secureTextEntry = false, style }) => {
  const styles = getStyles();
  return (
    <View style={[styles.input, style]}>
      <Text style={styles.inputPlaceholder}>{placeholder}</Text>
    </View>
  );
};

export const Card = ({ children, style }) => {
  const styles = getStyles();
  return <View style={[styles.card, style]}>{children}</View>;
};

export const Header = ({ title, subtitle, onBackPress }) => {
  const styles = getStyles();
  return (
    <View style={styles.header}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    button: {
      backgroundColor: '#25D366',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#25D366',
    },
    disabledButton: {
      opacity: 0.5,
    },
    text: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryText: {
      color: '#25D366',
    },
    input: {
      backgroundColor: '#F0F0F0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginVertical: 8,
    },
    inputPlaceholder: {
      color: '#999',
      fontSize: 14,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    backButtonText: {
      fontSize: 24,
      color: '#25D366',
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#000',
    },
    headerSubtitle: {
      fontSize: 12,
      color: '#999',
      marginTop: 2,
    },
  });
