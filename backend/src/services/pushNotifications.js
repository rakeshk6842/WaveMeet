/**
 * Push Notification Service
 * Handles sending push notifications to iOS and Android devices
 */

import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  if (serviceAccount.type) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.warn('Firebase not initialized:', error.message);
}

/**
 * Send push notification to a user
 */
export const sendPushNotification = async (deviceToken, notification) => {
  if (!admin.apps.length) {
    console.warn('Firebase not initialized, skipping push notification');
    return null;
  }

  try {
    const message = {
      token: deviceToken,
      notification: {
        title: notification.title || 'WaveMeet',
        body: notification.body || '',
      },
      data: {
        notificationId: notification.id || uuidv4(),
        type: notification.type || 'message',
        conversationId: notification.conversationId || '',
        senderId: notification.senderId || '',
        timestamp: new Date().toISOString(),
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          color: '#25D366',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            sound: 'default',
            badge: 1,
            'mutable-content': true,
          },
        },
      },
      webpush: {
        notification: {
          icon: 'https://example.com/logo.png',
          badge: 'https://example.com/badge.png',
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('Push notification sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

/**
 * Send push notification to multiple devices
 */
export const sendMulticastNotification = async (deviceTokens, notification) => {
  if (!admin.apps.length) {
    console.warn('Firebase not initialized, skipping multicast notification');
    return null;
  }

  try {
    const message = {
      notification: {
        title: notification.title || 'WaveMeet',
        body: notification.body || '',
      },
      data: {
        notificationId: notification.id || uuidv4(),
        type: notification.type || 'message',
        conversationId: notification.conversationId || '',
        senderId: notification.senderId || '',
        timestamp: new Date().toISOString(),
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          color: '#25D366',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendMulticast({
      ...message,
      tokens: deviceTokens,
    });

    console.log('Multicast notification sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    throw error;
  }
};

/**
 * Subscribe user to topic
 */
export const subscribeToTopic = async (deviceTokens, topic) => {
  if (!admin.apps.length) {
    return null;
  }

  try {
    const response = await admin.messaging().subscribeToTopic(deviceTokens, topic);
    console.log(`Subscribed to topic ${topic}:`, response);
    return response;
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    throw error;
  }
};

/**
 * Unsubscribe user from topic
 */
export const unsubscribeFromTopic = async (deviceTokens, topic) => {
  if (!admin.apps.length) {
    return null;
  }

  try {
    const response = await admin.messaging().unsubscribeFromTopic(deviceTokens, topic);
    console.log(`Unsubscribed from topic ${topic}:`, response);
    return response;
  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    throw error;
  }
};

/**
 * Send notification to all users in a conversation
 */
export const notifyConversationMembers = async (
  conversationId,
  senderName,
  messagePreview,
  excludeUserId = null
) => {
  // Implementation would fetch all device tokens for conversation members
  // and send notification using sendMulticastNotification
  console.log(
    `Notification: ${senderName} sent message in conversation ${conversationId}: ${messagePreview}`
  );
};

export default {
  sendPushNotification,
  sendMulticastNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  notifyConversationMembers,
};
