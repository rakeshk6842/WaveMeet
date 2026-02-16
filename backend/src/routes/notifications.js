/**
 * Push Notifications API Routes
 * Handles device token registration and notification preferences
 */

import express from 'express';
import { authenticate } from '../middleware.js';
import {
  sendPushNotification,
  sendMulticastNotification,
  subscribeToTopic,
} from '../services/pushNotifications.js';

const router = express.Router();

/**
 * Register device token for push notifications
 * POST /api/notifications/register-device
 */
router.post('/register-device', authenticate, async (req, res) => {
  const { deviceToken, platform, deviceName } = req.body;
  const userId = req.user.id;

  if (!deviceToken || !platform) {
    return res.status(400).json({
      error: 'Missing required fields: deviceToken, platform',
    });
  }

  try {
    // Store device token in database
    // This is a placeholder - implement actual database storage
    console.log(
      `Device registered for user ${userId}:`,
      { deviceToken, platform, deviceName }
    );

    res.json({
      success: true,
      message: 'Device registered successfully',
      deviceToken,
    });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ error: 'Failed to register device' });
  }
});

/**
 * Unregister device token
 * POST /api/notifications/unregister-device
 */
router.post('/unregister-device', authenticate, async (req, res) => {
  const { deviceToken } = req.body;
  const userId = req.user.id;

  if (!deviceToken) {
    return res.status(400).json({ error: 'Missing deviceToken' });
  }

  try {
    // Remove device token from database
    console.log(`Device unregistered for user ${userId}:`, deviceToken);

    res.json({
      success: true,
      message: 'Device unregistered successfully',
    });
  } catch (error) {
    console.error('Error unregistering device:', error);
    res.status(500).json({ error: 'Failed to unregister device' });
  }
});

/**
 * Update notification preferences
 * POST /api/notifications/preferences
 */
router.post('/preferences', authenticate, async (req, res) => {
  const { preferences } = req.body;
  const userId = req.user.id;

  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ error: 'Invalid preferences format' });
  }

  try {
    // Store notification preferences in database
    const defaultPreferences = {
      messages: preferences.messages !== false,
      mentions: preferences.mentions !== false,
      calls: preferences.calls !== false,
      groupUpdates: preferences.groupUpdates !== false,
      sound: preferences.sound !== false,
      vibration: preferences.vibration !== false,
      doNotDisturb: {
        enabled: preferences.doNotDisturb?.enabled || false,
        startTime: preferences.doNotDisturb?.startTime || '22:00',
        endTime: preferences.doNotDisturb?.endTime || '08:00',
      },
    };

    console.log(
      `Notification preferences updated for user ${userId}:`,
      defaultPreferences
    );

    res.json({
      success: true,
      message: 'Notification preferences updated',
      preferences: defaultPreferences,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

/**
 * Get notification preferences
 * GET /api/notifications/preferences
 */
router.get('/preferences', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch notification preferences from database
    const preferences = {
      messages: true,
      mentions: true,
      calls: true,
      groupUpdates: true,
      sound: true,
      vibration: true,
      doNotDisturb: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
    };

    res.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

/**
 * Test push notification
 * POST /api/notifications/test
 */
router.post('/test', authenticate, async (req, res) => {
  const { deviceToken } = req.body;

  if (!deviceToken) {
    return res.status(400).json({ error: 'Missing deviceToken' });
  }

  try {
    const result = await sendPushNotification(deviceToken, {
      title: 'WaveMeet',
      body: 'This is a test notification',
      type: 'test',
    });

    res.json({
      success: true,
      message: 'Test notification sent',
      result,
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

export default router;
