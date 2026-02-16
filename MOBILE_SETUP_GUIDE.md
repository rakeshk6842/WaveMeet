# WaveMeet Mobile Apps - Setup & Development Guide

This guide covers the iOS and Android mobile applications for WaveMeet, built with React Native.

## Overview

WaveMeet provides native mobile applications for both iOS and Android platforms with:
- **Real-time messaging** via WebSocket
- **User authentication** (Login/Register)
- **Chat management** (create, list, view conversations)
- **Contact management** (search, select, create new chats)
- **User profiles** (view and edit profile information)
- **Typing indicators** (real-time typing status)
- **Online/offline status**

## Project Structure

```
WaveMeet/
├── ios/                      # iOS app (React Native)
│   ├── package.json
│   ├── app.json
│   ├── index.js
│   └── src/
│       ├── App.jsx           # Main app component with navigation
│       ├── screens/
│       │   ├── LoginScreen.jsx
│       │   ├── RegisterScreen.jsx
│       │   ├── ChatListScreen.jsx
│       │   ├── ChatDetailScreen.jsx
│       │   ├── ContactsScreen.jsx
│       │   └── ProfileScreen.jsx
│       ├── services/
│       │   ├── api.js        # HTTP API client
│       │   └── socket.js     # WebSocket client
│       ├── stores/
│       │   ├── authStore.js  # Auth state management
│       │   └── chatStore.js  # Chat state management
│       └── components/
│           └── Common.jsx    # Shared components
│
├── android/                  # Android app (React Native)
│   └── [Same structure as iOS]
```

## Technology Stack

### Frontend Framework
- **React Native 0.72.0** - Cross-platform mobile development
- **React 18.2.0** - UI library

### Navigation
- **@react-navigation/native** - Navigation library
- **@react-navigation/bottom-tabs** - Tab navigation
- **@react-navigation/native-stack** - Stack navigation

### State Management
- **Zustand** - Lightweight state management
  - `useAuthStore` - Authentication state
  - `useChatStore` - Chat/messaging state

### API & WebSocket
- **axios** - HTTP client for REST API
- **socket.io-client** - Real-time WebSocket communication

### Storage
- **@react-native-async-storage/async-storage** - Persistent local storage

### UI
- **react-native-vector-icons** - Icon library
- **react-native-keyboard-aware-scroll-view** - Keyboard handling
- Native StyleSheet for styling

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- React Native CLI: `npm install -g react-native-cli`
- **iOS**: Xcode 13+, iOS SDK 13+
- **Android**: Android Studio, Android SDK 30+

### iOS Setup

1. **Install dependencies**
   ```bash
   cd ios
   npm install
   ```

2. **Install pod dependencies**
   ```bash
   cd ios/ios
   pod install
   cd ../..
   ```

3. **Start Metro bundler**
   ```bash
   npm start
   ```

4. **In another terminal, build and run**
   ```bash
   npm run ios
   ```

5. **Or run on specific simulator**
   ```bash
   react-native run-ios --simulator="iPhone 15"
   ```

### Android Setup

1. **Install dependencies**
   ```bash
   cd android
   npm install
   ```

2. **Configure environment**
   - Ensure `ANDROID_HOME` is set
   - Ensure Android SDK tools are in PATH

3. **Start Metro bundler**
   ```bash
   npm start
   ```

4. **In another terminal, build and run**
   ```bash
   npm run android
   ```

5. **Or run on specific device**
   ```bash
   react-native run-android --deviceId="<device_id>"
   ```

## Architecture

### Authentication Flow

```
[Login/Register Screen] 
    ↓ (credentials)
[useAuthStore.login/register] 
    ↓ (API call)
[Backend API] 
    ↓ (token + user)
[Zustand Store] → [AsyncStorage]
    ↓
[Navigation to Chat Stack]
    ↓
[Initialize Socket.io connection]
```

### Real-time Messaging Flow

```
[User types message in ChatDetailScreen]
    ↓
[handleSendMessage called]
    ↓
[conversationsAPI.sendMessage()] 
    ↓
[Backend API receives message]
    ↓ (broadcasts via socket.io)
[Socket.io: message:receive event]
    ↓
[chatStore.addMessage()] 
    ↓
[Message appears in FlatList]
```

### State Management

**useAuthStore** - Manages:
- `user` - Current user object
- `token` - JWT authentication token
- `isAuthenticated` - Auth status boolean
- `isLoading` - Loading state
- `error` - Error messages
- Methods: `initializeAuth()`, `login()`, `register()`, `logout()`, `updateProfile()`

**useChatStore** - Manages:
- `conversations` - Array of user conversations
- `messages` - Object with messages by conversation ID
- `selectedConversation` - Currently active conversation
- `typingUsers` - Typing status by conversation
- Methods: `fetchConversations()`, `fetchMessages()`, `createConversation()`, `sendMessage()`, `addMessage()`

## Screens

### Authentication

**LoginScreen**
- Email and password input fields
- Login button (calls `useAuthStore.login()`)
- Link to register screen
- Error display for failed login
- Loading indicator during auth

**RegisterScreen**
- Name, email, password, confirm password fields
- Register button (calls `useAuthStore.register()`)
- Password validation
- Link back to login screen

### Chat

**ChatListScreen**
- List of all user conversations
- FAB (floating action button) to create new chat
- Pull-to-refresh functionality
- Conversation preview (name, last message, timestamp)
- Navigate to ChatDetailScreen on tap

**ChatDetailScreen**
- Message list (FlatList, reversed for chronological order)
- Message input field
- Send button
- Typing indicators
- Real-time message receiving via WebSocket
- Auto-scroll to latest message

**ContactsScreen**
- Searchable contact list
- Multi-select with checkboxes
- Create chat button (bottom bar)
- Contact avatars and status display
- Navigate to ChatListScreen after creating conversation

**ProfileScreen**
- User avatar and name display
- Editable profile fields (name, status)
- Settings menu items
- Logout button
- Edit mode toggle

## API Endpoints Used

```javascript
// Auth
POST /api/auth/login
POST /api/auth/register

// Conversations
GET /api/conversations
POST /api/conversations
GET /api/conversations/:id/messages
POST /api/conversations/:id/messages

// Contacts
GET /api/contacts
GET /api/contacts/search

// Users
GET /api/users/profile
PUT /api/users/profile
```

## WebSocket Events

The app listens and emits the following socket.io events:

**Listening (onMessageReceive, onTypingStart, etc.)**
```javascript
socket.on('message:receive', (data) => {...})
socket.on('typing:start', (data) => {...})
socket.on('typing:stop', (data) => {...})
socket.on('user:online', (data) => {...})
socket.on('user:offline', (data) => {...})
```

**Emitting**
```javascript
socket.emit('message:send', {conversationId, content})
socket.emit('typing:start', {conversationId})
socket.emit('typing:stop', {conversationId})
socket.emit('user:online')
socket.emit('user:offline')
```

## Configuration

### Environment Variables

Create a `.env` file in the respective app root:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_SOCKET_URL=http://localhost:5001
```

For production:
```env
REACT_APP_API_URL=https://api.wavemeet.com
REACT_APP_SOCKET_URL=https://api.wavemeet.com
```

### Changing API URLs

Edit `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

Edit `src/services/socket.js`:
```javascript
const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

## Development Workflow

### Hot Reload

Both iOS and Android support hot reload and fast refresh:

1. Press `R` in terminal to reload
2. Press `RR` for full reload
3. Press `I` (iOS) to open iOS debugger

### Debugging

**React Native Debugger**
```bash
npm install -g react-native-debugger
react-native-debugger &
```

**Chrome DevTools**
- Press `Cmd+D` (iOS) or `Cmd+M` (Android)
- Select "Debug JS Remotely"

### Testing

Run tests:
```bash
npm test
```

With coverage:
```bash
npm test -- --coverage
```

## Performance Optimization

1. **Message List** - FlatList with inverted prop and reversed data
2. **API Calls** - Axios request/response interceptors
3. **State Updates** - Zustand for efficient state management
4. **Image Loading** - Lazy loading for avatars
5. **Keyboard** - KeyboardAvoidingView for proper input handling

## Common Issues & Solutions

### Socket Connection Fails
- Check backend is running on correct port
- Verify `REACT_APP_API_URL` matches backend
- Check network connectivity on device
- Ensure WebSocket support in backend

### White Screen on Startup
- Check Metro bundler is running
- Run `npm install` again
- Clear Metro cache: `npm start -- --reset-cache`
- Rebuild: `npm run ios` or `npm run android`

### Storage Not Persisting
- Check AsyncStorage is properly initialized
- Verify keys are correct in auth/chat stores
- Check device storage permissions

### Navigation Issues
- Verify screen names match in navigator
- Check navigation parameter passing
- Ensure navigation container wraps all navigators

## Building for Production

### iOS

1. **Update app version**
   - Edit `ios/app.json`

2. **Create production build**
   ```bash
   npm run build -- --prod
   react-native run-ios --configuration Release
   ```

3. **Archive for App Store**
   - Open in Xcode: `open ios/wavemeet.xcworkspace`
   - Product → Archive
   - Upload to App Store

### Android

1. **Update app version**
   - Edit `android/app.json`

2. **Create release APK**
   ```bash
   npm run build:android
   ```

3. **Upload to Play Store**
   - Use Android Studio or Google Play Console
   - Upload `android/app/build/outputs/apk/release/app-release.apk`

## Deployment

### Test Flight (iOS)
1. Archive build in Xcode
2. Upload to TestFlight
3. Add testers and distribute

### Google Play Beta (Android)
1. Upload APK to Play Console
2. Create beta release track
3. Add test users and distribute

## Support & Documentation

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Socket.io Client Docs](https://socket.io/docs/v4/client-api/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## Contributing

When adding new features:
1. Create feature branch
2. Implement on iOS first
3. Port to Android with platform-specific adjustments
4. Test on both physical devices and simulators
5. Update documentation
6. Submit pull request

## License

MIT License - See LICENSE file for details
