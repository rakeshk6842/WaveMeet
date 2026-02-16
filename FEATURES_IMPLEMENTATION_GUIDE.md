# ENHANCED FEATURES IMPLEMENTATION GUIDE

**Version:** 1.0  
**Last Updated:** February 15, 2026  
**Features Added:** Push Notifications, Media Uploads, Voice/Video Calls

---

## 1. Push Notifications Feature

### 1.1 Architecture Overview

```
┌──────────────────┐
│   Mobile App     │
│ (iOS/Android)    │
└────────┬─────────┘
         │ 1. Register device token
         │ 2. Request permission
         ▼
┌──────────────────────────┐
│     Backend Server       │
│   (Socket.io + Firebase) │
└────────┬─────────────────┘
         │ 3. Store device tokens
         │ 4. Handle notifications
         ▼
┌──────────────────────────┐
│  Firebase Cloud           │
│  Messaging (FCM)          │
└────────┬─────────────────┘
         │ 5. Send to device
         ▼
┌──────────────────┐
│   Mobile App     │
│   (notification) │
└──────────────────┘
```

### 1.2 Implementation Files

**Backend:**
- `backend/src/services/pushNotifications.js` - FCM integration
- `backend/src/routes/notifications.js` - Notification API endpoints

**iOS:**
- `ios/src/services/notifications.js` - Device token registration
- `ios/App.json` - FCM configuration

**Android:**
- `android/src/services/notifications.js` - Device token registration
- `android/app.json` - FCM configuration

### 1.3 Setup Instructions

**Firebase Setup:**

```bash
# 1. Create Firebase Project
# - Go to https://console.firebase.google.com
# - Create new project "WaveMeet"

# 2. Enable Cloud Messaging
# - Project Settings → Cloud Messaging tab
# - Copy Server API Key and Sender ID

# 3. Download Service Account Key
# - Project Settings → Service Accounts
# - Generate new private key (JSON format)
# - Save as `firebase-credentials.json`

# 4. Set environment variable
export FIREBASE_SERVICE_ACCOUNT=$(cat firebase-credentials.json | jq -c .)
```

**iOS Configuration:**

```swift
// iOS: Add to AppDelegate
import UserNotifications
import FirebaseMessaging

func application(_ application: UIApplication,
                 didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
  
  // Request notification permissions
  UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
    DispatchQueue.main.async {
      UIApplication.shared.registerForRemoteNotifications()
    }
  }
  
  return true
}
```

**Android Configuration:**

```kotlin
// Android: Add to AndroidManifest.xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

// In MainActivity.java
private fun requestNotificationPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        requestPermissions(
            arrayOf(Manifest.permission.POST_NOTIFICATIONS),
            NOTIFICATION_PERMISSION_CODE
        )
    }
}
```

### 1.4 API Endpoints

**Register Device:**
```bash
POST /api/notifications/register-device
Content-Type: application/json
Authorization: Bearer <token>

{
  "deviceToken": "device-token-from-fcm",
  "platform": "ios" | "android",
  "deviceName": "iPhone 14 Pro"
}

Response:
{
  "success": true,
  "message": "Device registered successfully",
  "deviceToken": "..."
}
```

**Update Preferences:**
```bash
POST /api/notifications/preferences
Content-Type: application/json
Authorization: Bearer <token>

{
  "preferences": {
    "messages": true,
    "mentions": true,
    "calls": true,
    "groupUpdates": true,
    "sound": true,
    "vibration": true,
    "doNotDisturb": {
      "enabled": true,
      "startTime": "22:00",
      "endTime": "08:00"
    }
  }
}

Response:
{
  "success": true,
  "message": "Notification preferences updated",
  "preferences": {...}
}
```

### 1.5 Testing Push Notifications

**Backend Test:**
```bash
# Send test notification
POST /api/notifications/test
Authorization: Bearer <token>

{
  "deviceToken": "device-token"
}
```

**iOS Testing:**
```bash
# Simulate notification in Xcode
Xcode → Debug → Simulate Push Notification
```

**Android Testing:**
```bash
# Using adb
adb shell am start -a com.google.android.c2dm.intent.RECEIVE \
  -n com.example.wavemeet/.fcm.NotificationHandler
```

---

## 2. Media Uploads Feature

### 2.1 Architecture Overview

```
┌──────────────────┐
│   Mobile App     │
│ (iOS/Android)    │
└────────┬─────────┘
         │ 1. Select media
         │ 2. Upload file
         ▼
┌──────────────────────────┐
│   Backend Server         │
│  (Multer + File Storage) │
└────────┬─────────────────┘
         │ 3. Process & store
         │ 4. Generate URL
         ▼
┌──────────────────┐
│  File Storage    │
│  (Local/AWS S3)  │
└────────┬─────────┘
         │ 5. Save file
         ▼
┌──────────────────┐
│   Chat Message   │
│  (with file ref) │
└──────────────────┘
```

### 2.2 Implementation Files

**Backend:**
- `backend/src/services/mediaUpload.js` - File upload handling
- `backend/src/routes/media.js` - Media API endpoints

**Frontend/Mobile:**
- Image picker integration
- File upload progress tracking
- Preview rendering

### 2.3 Setup Instructions

**Create Upload Directory:**

```bash
mkdir -p uploads/{images,videos,audio,documents}
chmod 755 uploads
```

**Environment Configuration:**

```bash
# .env
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800  # 50MB
```

**For AWS S3 (Optional):**

```bash
npm install aws-sdk

# .env
USE_S3=true
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=wavemeet-media
AWS_S3_REGION=us-east-1
```

### 2.4 Supported File Types

| Type | Formats | Max Size |
|------|---------|----------|
| Image | JPEG, PNG, GIF, WebP | 10MB |
| Video | MP4, MOV, AVI | 50MB |
| Audio | MP3, WAV, OGG, WebM | 20MB |
| Document | PDF, DOC, DOCX | 10MB |

### 2.5 API Endpoints

**Upload File:**
```bash
POST /api/media/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
file: <binary>

Response:
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "id": "uuid",
    "filename": "photo.jpg",
    "storagePath": "uploads/images/uuid.jpg",
    "fileUrl": "/uploads/images/uuid.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000,
    "uploadedAt": "2026-02-15T10:30:00Z",
    "type": "images"
  }
}
```

**Upload Multiple Files:**
```bash
POST /api/media/upload-multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
files: [<file1>, <file2>, ...]

Response:
{
  "success": true,
  "message": "2 files uploaded successfully",
  "files": [...]
}
```

**Get Storage Usage:**
```bash
GET /api/media/stats/usage
Authorization: Bearer <token>

Response:
{
  "success": true,
  "stats": {
    "totalSize": 1024000000,
    "fileCount": 150,
    "breakdown": {
      "images": { "count": 100, "size": 500000000 },
      "videos": { "count": 30, "size": 500000000 },
      "audio": { "count": 15, "size": 20000000 },
      "documents": { "count": 5, "size": 4000000 }
    },
    "limit": 5368709120  // 5GB
  }
}
```

### 2.6 Frontend Integration (React/React Native)

**React Component Example:**
```javascript
function MediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          const percentage = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgress(percentage);
        },
      });

      console.log('Upload successful:', response.data.file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <progress value={progress} max="100" />}
    </div>
  );
}
```

### 2.7 Testing Media Uploads

```bash
# Test image upload
curl -X POST http://localhost:5001/api/media/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@test-image.jpg"

# Test file size limit
dd if=/dev/zero of=large-file.bin bs=1M count=60  # 60MB
curl -X POST http://localhost:5001/api/media/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@large-file.bin"
# Should return 400 - File too large
```

---

## 3. Voice/Video Calls Feature

### 3.1 Architecture Overview

```
┌──────────────────┐         ┌──────────────────┐
│  iOS App         │         │  Android App     │
│ (WebRTC)         │         │ (WebRTC)         │
└────────┬─────────┘         └────────┬─────────┘
         │                           │
         └───────────────┬───────────┘
                         │
                    ┌────▼─────────┐
                    │  Socket.io   │
                    │  Signaling   │
                    └────┬─────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼──────┐            ┌──────────▼──┐
    │ STUN/TURN │            │   Backend   │
    │  Server   │            │   (Calls)   │
    └───────────┘            └─────────────┘
```

### 3.2 Implementation Files

**Backend:**
- `backend/src/services/callService.js` - Call management
- `backend/src/routes/calls.js` - Call API endpoints

**Mobile:**
- `ios/src/services/callService.js` - iOS call handling
- `android/src/services/callService.js` - Android call handling

### 3.3 Setup Instructions

**WebRTC Setup:**

```bash
# Install WebRTC libraries
# For React Native:
npm install react-native-webrtc
npm install @react-native-camera-roll/camera-roll
npm install @react-native-permission-handler/permission-handler
```

**STUN/TURN Servers:**

```javascript
// config/webrtc.js
export const iceServers = [
  {
    urls: [
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
    ],
  },
  {
    urls: ['turn:turnserver.example.com:3478'],
    username: 'user',
    credential: 'pass',
  },
];
```

**Permissions:**

```xml
<!-- Android: AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.INTERNET" />
```

```swift
// iOS: Info.plist
<key>NSCameraUsageDescription</key>
<string>We need camera access for video calls</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for calls</string>
```

### 3.4 Socket Events

**Initiate Call:**
```javascript
socket.emit('call:initiate', {
  callId: 'unique-call-id',
  calleeId: 'target-user-id',
  callType: 'audio' | 'video',
  conversationId: 'conversation-id',
  callerName: 'John Doe'
});
```

**Accept Call:**
```javascript
socket.emit('call:accept', {
  callId: 'call-id'
});
```

**Reject Call:**
```javascript
socket.emit('call:reject', {
  callId: 'call-id',
  reason: 'busy' | 'unavailable' | 'declined'
});
```

**Send WebRTC Signal:**
```javascript
socket.emit('call:signal', {
  callId: 'call-id',
  to: 'recipient-user-id',
  signal: sdpOffer | iceCandidate
});
```

**End Call:**
```javascript
socket.emit('call:end', {
  callId: 'call-id'
});
```

**Media Control:**
```javascript
socket.emit('call:mute-audio', { callId: 'call-id' });
socket.emit('call:unmute-audio', { callId: 'call-id' });
socket.emit('call:mute-video', { callId: 'call-id' });
socket.emit('call:unmute-video', { callId: 'call-id' });
```

### 3.5 API Endpoints

**Get Call History:**
```bash
GET /api/calls/history?limit=50&offset=0
Authorization: Bearer <token>

Response:
{
  "success": true,
  "calls": [
    {
      "callId": "uuid",
      "participants": ["user-1", "user-2"],
      "startTime": "2026-02-15T10:30:00Z",
      "endTime": "2026-02-15T10:45:00Z",
      "duration": 900,
      "type": "video"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150
  }
}
```

**Get Call Statistics:**
```bash
GET /api/calls/stats/usage?period=month
Authorization: Bearer <token>

Response:
{
  "success": true,
  "stats": {
    "totalCalls": 45,
    "totalMinutes": 2340,
    "averageCallDuration": 52,
    "videoCalls": 30,
    "audioCalls": 15,
    "missedCalls": 5,
    "byDay": [...]
  }
}
```

### 3.6 Testing Voice/Video Calls

**Test Call Flow:**
```javascript
// 1. User A initiates call
socketA.emit('call:initiate', {
  callId: 'test-call-1',
  calleeId: 'user-b-id',
  callType: 'video'
});

// 2. User B receives incoming call
socketB.on('call:incoming', (data) => {
  console.log('Incoming call from:', data.callerId);
});

// 3. User B accepts call
socketB.emit('call:accept', { callId: 'test-call-1' });

// 4. Both users exchange WebRTC signals
socketA.emit('call:signal', {
  callId: 'test-call-1',
  to: 'user-b-id',
  signal: offerSdp
});

// 5. End call
socketA.emit('call:end', { callId: 'test-call-1' });
```

---

## 4. Features Status Summary

### 4.1 Implementation Status

| Feature | Backend | iOS | Android | Testing |
|---------|---------|-----|---------|---------|
| Push Notifications | ✅ | 🔄 | 🔄 | 🔄 |
| Media Uploads | ✅ | 🔄 | 🔄 | 🔄 |
| Voice Calls | ✅ | 🔄 | 🔄 | 🔄 |
| Video Calls | ✅ | 🔄 | 🔄 | 🔄 |
| Call History | ✅ | 🔄 | 🔄 | 🔄 |

Legend: ✅ Complete | 🔄 In Progress | ❌ Not Started

### 4.2 Next Steps

1. **Mobile Implementation**
   - Integrate push notifications in iOS/Android
   - Implement media picker UI
   - Add WebRTC peer connection logic

2. **Testing**
   - Unit tests for each feature
   - Integration tests
   - Performance testing

3. **Documentation**
   - User guides for each feature
   - Developer API documentation
   - Deployment guides

4. **Optimization**
   - Media file compression
   - Call quality optimization
   - Battery and bandwidth optimization

---

**Document Version:** 1.0  
**Last Updated:** February 15, 2026  
**Next Review:** May 15, 2026
