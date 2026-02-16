# WaveMeet iOS App

This branch contains the **React Native iOS application** for WaveMeet - a real-time messaging platform.

## 🎯 Features

- ✅ **User Authentication** - Login and register
- ✅ **Real-time Messaging** - WebSocket support
- ✅ **Chat Management** - Create, list, and view conversations
- ✅ **Contact Management** - Search and select contacts
- ✅ **User Profiles** - View and edit profile information
- ✅ **Typing Indicators** - See when others are typing
- ✅ **Online Status** - Real-time presence updates

## 📱 Project Structure

```
ios/
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
- Xcode 13+ with iOS SDK
- iOS Simulator or physical device

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
   npm run ios
   ```

### Running on Device

Connect your iOS device and run:
```bash
react-native run-ios --device
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

Press `Cmd+D` to open the debug menu:
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

2. **Create release build**
   ```bash
   npm run build
   ```

3. **Archive in Xcode**
   - Open `ios/wavemeet.xcworkspace` in Xcode
   - Product → Scheme → Release
   - Product → Archive
   - Upload to App Store

## 🐛 Troubleshooting

### Metro bundler won't start
```bash
npm start -- --reset-cache
```

### App crashes on startup
- Check `.env` file
- Ensure backend is running
- Clear watchman cache: `watchman watch-del-all`

### WebSocket connection fails
- Verify `REACT_APP_API_URL` is correct
- Check backend is running
- Ensure network connectivity

### Navigation not working
- Clear Metro cache and rebuild
- Check navigation parameter passing
- Verify screen names match

## 📚 Documentation

- [MOBILE_SETUP_GUIDE.md](../MOBILE_SETUP_GUIDE.md) - Detailed setup instructions
- [README.md](../README.md) - Main project documentation
- [GETTING_STARTED.md](../GETTING_STARTED.md) - Quick start guide

## 🔗 Related Branches

- `main` - Web and backend code
- `android-app` - Android app development

## 📄 License

MIT License - See LICENSE file for details
