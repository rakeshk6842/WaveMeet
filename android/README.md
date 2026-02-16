# WaveMeet Android App

This branch contains the **React Native Android application** for WaveMeet - a real-time messaging platform.

## 🎯 Features

- ✅ **User Authentication** - Login and register
- ✅ **Real-time Messaging** - WebSocket support  
- ✅ **Chat Management** - Create, list, and view conversations
- ✅ **Contact Management** - Search and select contacts
- ✅ **User Profiles** - View and edit profile information
- ✅ **Typing Indicators** - See when others are typing
- ✅ **Online Status** - Real-time presence updates
- ✅ **Material Design** - Android design guidelines

## 📱 Project Structure

```
android/
├── package.json              # Dependencies
├── app.json                  # App configuration
├── index.js                  # Entry point
└── src/
    ├── App.jsx               # Main app with navigation
    ├── screens/              # Screen components
    │   ├── LoginScreen.jsx
    │   ├── RegisterScreen.jsx
    │   ├── ChatListScreen.jsx
    │   ├── ChatDetailScreen.jsx
    │   ├── ContactsScreen.jsx
    │   └── ProfileScreen.jsx
    ├── services/             # API and WebSocket
    │   ├── api.js
    │   └── socket.js
    ├── stores/               # State management
    │   ├── authStore.js
    │   └── chatStore.js
    └── components/           # Shared components
        └── Common.jsx
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Android Studio with Android SDK 30+
- Android Emulator or physical device
- ANDROID_HOME environment variable set

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env to set your backend URL
   ```

3. **Start Metro bundler**
   ```bash
   npm start
   ```

4. **In another terminal, build and run**
   ```bash
   npm run android
   ```

### Running on Device

Connect your Android device via USB and enable USB debugging:
```bash
adb devices
react-native run-android
```

## 🏗️ Architecture

### Navigation Stack

```
App.jsx
├── AuthStack (if not authenticated)
│   ├── LoginScreen
│   └── RegisterScreen
└── AppTabs (if authenticated)
    ├── ChatStack
    │   ├── ChatListScreen
    │   └── ChatDetailScreen
    ├── ContactsScreen
    └── ProfileScreen
```

### State Management

**useAuthStore** - Manages:
- User authentication
- JWT token storage
- User profile
- Login/logout/register

**useChatStore** - Manages:
- Conversations list
- Messages by conversation
- Typing users
- Real-time updates

## 📡 API Integration

The app connects to the WaveMeet backend API at:
```
http://localhost:5001/api
```

To change this, edit `.env`:
```env
REACT_APP_API_URL=http://your-server.com/api
```

## 🔄 WebSocket Events

Real-time updates via Socket.io:

**Sending:**
- `message:send` - Send a message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

**Receiving:**
- `message:receive` - New message received
- `typing:start` - Someone started typing
- `typing:stop` - Someone stopped typing

## 🛠️ Development

### Hot Reload

Press `R` in the Metro bundler terminal to reload.

### Debugging

Press `Cmd+M` or `Ctrl+M` to open the debug menu:
- Debug JS Remotely - Opens Chrome DevTools
- Show Inspector - View component hierarchy
- Show Perf Monitor - Performance metrics

### Running Tests

```bash
npm test
```

## 📦 Building for Release

1. **Update version**
   - Edit `app.json` version field

2. **Create release APK**
   ```bash
   npm run build:android
   ```

3. **Upload to Play Store**
   - Use Android Studio or Google Play Console
   - Upload APK from `android/app/build/outputs/apk/release/`

## 🐛 Troubleshooting

### Metro bundler won't start
```bash
npm start -- --reset-cache
```

### Gradle build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### App crashes on startup
- Check `.env` file
- Ensure backend is running
- Clear Metro cache: `watchman watch-del-all`
- Check Android SDK version compatibility

### WebSocket connection fails
- Verify `REACT_APP_API_URL` is correct
- Check backend is running
- Ensure device network connectivity
- Try using actual IP instead of localhost

### No devices connected
```bash
adb devices
adb reverse tcp:5001 tcp:5001  # Forward backend port to device
```

### Navigation not working
- Clear Metro cache and rebuild
- Check navigation parameter passing
- Verify screen names match

## 🔧 Android-Specific Configuration

### Permissions

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### Network Security

For local development (localhost), add `android/app/src/main/AndroidManifestres/network_security_config.xml`:
```xml
<domain-config>
    <domain includeSubdomains="true">localhost</domain>
    <trust-anchors>
        <certificates src="system" />
    </trust-anchors>
</domain-config>
```

## 📚 Documentation

- [MOBILE_SETUP_GUIDE.md](../MOBILE_SETUP_GUIDE.md) - Detailed setup instructions
- [README.md](../README.md) - Main project documentation
- [GETTING_STARTED.md](../GETTING_STARTED.md) - Quick start guide

## 🔗 Related Branches

- `main` - Web and backend code
- `ios-app` - iOS app development

## 📄 License

MIT License - See LICENSE file for details
