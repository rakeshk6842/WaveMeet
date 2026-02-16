# WaveMeet iOS Deployment Guide for Testing

**Date:** February 15, 2026  
**Project:** WaveMeet Phase 2  
**Platform:** iOS  
**Status:** Complete & Ready for Testing  

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Development Setup](#development-setup)
4. [Testing on Simulator](#testing-on-simulator)
5. [Testing on Physical Device](#testing-on-physical-device)
6. [TestFlight Beta Distribution](#testflight-beta-distribution)
7. [Troubleshooting](#troubleshooting)
8. [Performance Testing](#performance-testing)

---

## Prerequisites

### Required Software
- **Xcode 13 or later** (preferably Xcode 15.x)
- **iOS SDK 13 or later**
- **Node.js 16+** (check: `node --version`)
- **npm 7+** (check: `npm --version`)
- **CocoaPods** (check: `pod --version`)
- **Git** for version control

### Hardware Requirements
- **Mac with Apple Silicon or Intel processor**
- **Minimum 8GB RAM** (16GB recommended)
- **15GB free disk space** (20GB recommended)

### iOS Device/Simulator Requirements
- **iOS 13.0 or later** (testing)
- **iOS 14.0 or later** (recommended)
- **iPhone 12 or later** (for physical device testing)

### Apple Developer Account
- **Free account**: For simulator testing only
- **Paid account ($99/year)**: For physical device testing and TestFlight beta

---

## Environment Setup

### Step 1: Install Xcode

```bash
# Using App Store (recommended)
# Open App Store and search for "Xcode"

# OR using Command Line Tools only
xcode-select --install

# Verify installation
xcode-select -p
# Output: /Applications/Xcode.app/Contents/Developer
```

### Step 2: Install CocoaPods

```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify installation
pod --version

# Update pod repositories
pod repo update
```

### Step 3: Install React Native CLI

```bash
# Install react-native globally
npm install -g react-native-cli

# Verify installation
react-native --version
```

### Step 4: Clone/Download WaveMeet Project

```bash
# Navigate to the project directory
cd /path/to/WaveMeet

# Verify structure
ls -la
# Should see: ios/ frontend/ backend/ android/ etc.
```

---

## Development Setup

### Step 1: Install iOS App Dependencies

```bash
# Navigate to iOS app directory
cd ios

# Install npm dependencies
npm install

# Verify installations
npm list
```

### Step 2: Install Pod Dependencies

```bash
# Navigate to iOS folder
cd ios

# Install CocoaPods
pod install

# Wait for pods to install (~5-10 minutes)
pod install --repo-update  # If first time or issues

# Return to root
cd ../..

# Verify Podfile.lock was created
ls -la ios/ios/Podfile.lock
```

### Step 3: Configure Environment Variables

```bash
# Navigate to iOS app directory
cd ios

# Create .env file
cat > .env << 'EOF'
# Backend API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=http://localhost:3001

# Firebase Configuration (if using Firebase)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# App Configuration
REACT_APP_ENV=development
REACT_APP_DEBUG=true
EOF

# Update values for your backend
nano .env  # or use your favorite editor
```

### Step 4: Backend Configuration

For testing on physical device or from different network:

```bash
# Update REACT_APP_API_URL to your machine's IP
# Example: REACT_APP_API_URL=http://192.168.1.100:3001

# Get your Mac's IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Use the en0 (WiFi) address
```

---

## Testing on Simulator

### Option 1: Run on Default Simulator

```bash
# From project root directory
cd ios

# Start Metro bundler (in terminal 1)
npm start

# In a new terminal, build and run (terminal 2)
npm run ios

# Wait for app to load (30-60 seconds first time)
```

### Option 2: Run on Specific Simulator

```bash
# List available simulators
xcrun simctl list devices available

# Example output:
# iPhone 15
# iPhone 15 Plus
# iPhone 15 Pro
# iPhone 15 Pro Max
# etc.

# Run on specific device
npx react-native run-ios --simulator="iPhone 15 Pro"

# Or with custom configuration
npx react-native run-ios --simulator="iPhone 15 Pro" --configuration Release
```

### Option 3: Manual Xcode Build

```bash
# Navigate to iOS project
cd ios/ios

# Open Xcode project
open WaveMeet.xcworkspace  # Note: .xcworkspace, not .xcodeproj

# In Xcode:
# 1. Select simulator from top menu (e.g., "iPhone 15 Pro")
# 2. Click "Play" button (Cmd + R) to build and run
# 3. Wait for build to complete

# In another terminal, start Metro bundler
cd /path/to/WaveMeet/ios
npm start
```

### Testing Checklist for Simulator

```
Basic Functionality:
  ☐ App launches without crashing
  ☐ Login screen loads
  ☐ Can enter credentials
  ☐ Register button works

Authentication:
  ☐ Can create new account
  ☐ Can login with credentials
  ☐ JWT token stored properly
  ☐ Session persists after app restart

Chat Features:
  ☐ Chat list displays
  ☐ Can create new chat
  ☐ Can send messages
  ☐ Messages appear in real-time
  ☐ Typing indicator works

Media Features:
  ☐ Can upload images
  ☐ Can send files
  ☐ Media displays in chat

Voice/Video Calls:
  ☐ Can initiate call
  ☐ Can receive call
  ☐ Audio works
  ☐ Video works

Push Notifications:
  ☐ Can receive notifications
  ☐ Notifications display correctly

Profile:
  ☐ Can view profile
  ☐ Can edit profile
  ☐ Changes save properly
```

---

## Testing on Physical Device

### Step 1: Prepare Physical Device

```bash
# On your iPhone:
1. Connect to same WiFi as Mac
2. Go to Settings → Developer
3. Enable Developer Mode (if iOS 16+)
4. Trust the computer when prompted
5. Keep device unlocked during setup
```

### Step 2: Connect via USB

```bash
# Connect iPhone with USB cable to Mac

# Verify device is recognized
xcrun simctl list devices

# Should see your device with UUID
```

### Step 3: Configure Xcode Project

```bash
# Open Xcode
cd ios/ios
open WaveMeet.xcworkspace

# In Xcode:
# 1. Select your physical device from top menu (not simulator)
# 2. Go to Signing & Capabilities tab
# 3. Select Team: (personal Apple account)
# 4. Xcode will auto-setup provisioning
```

### Step 4: Build and Run on Device

```bash
# From iOS app directory
cd ios

# Option 1: Using react-native CLI
npx react-native run-ios --device

# Option 2: Using Xcode
# 1. Click "Play" button (Cmd + R)
# 2. Wait for build and installation
# 3. App will launch on physical device

# Option 3: From command line
xcodebuild -workspace ios/WaveMeet.xcworkspace \
  -scheme WaveMeet \
  -configuration Release \
  -derivedDataPath build \
  -destination 'platform=iOS,name=YOUR_DEVICE_NAME'
```

### Step 5: Configure Backend URL for Device

```bash
# For testing from physical device on local network

# Get Mac's IP address
ipconfig getifaddr en0
# Example output: 192.168.1.100

# Update .env in ios directory
cat > .env << 'EOF'
REACT_APP_API_URL=http://192.168.1.100:3001
REACT_APP_SOCKET_URL=http://192.168.1.100:3001
EOF

# Rebuild app with new configuration
npm start  # (new terminal)
npx react-native run-ios --device
```

### Device Testing Checklist

```
Network Connectivity:
  ☐ App connects to backend
  ☐ WebSocket connects
  ☐ No SSL/TLS errors

Performance:
  ☐ App launches in <3 seconds
  ☐ Smooth scrolling (60 FPS)
  ☐ No lag during typing
  ☐ Messages send/receive instantly

Battery & Memory:
  ☐ No excessive battery drain
  ☐ Memory usage < 200MB
  ☐ No memory leaks

Sensors & Features:
  ☐ Camera works for video calls
  ☐ Microphone works for voice calls
  ☐ Notifications work

Connectivity:
  ☐ WiFi connectivity
  ☐ Mobile data (4G/5G) connectivity
  ☐ Network switching without issues
  ☐ Reconnection after network loss
```

---

## TestFlight Beta Distribution

### Step 1: Prepare App for Release

```bash
# Navigate to iOS project
cd ios

# Update version number in app.json
cat > app.json << 'EOF'
{
  "name": "WaveMeet",
  "displayName": "WaveMeet",
  "version": "1.0.0",
  "build": "1",
  "expo": {
    "plugins": [
      ["@react-native-firebase/app"],
      ["@react-native-firebase/messaging"],
      ["@react-native-async-storage/async-storage"]
    ]
  }
}
EOF
```

### Step 2: Set Up App Store Connect

```bash
# 1. Go to https://appstoreconnect.apple.com
# 2. Sign in with Apple Developer Account
# 3. Click "My Apps"
# 4. Click "+" button to create new app
# 5. Select platform: iOS
# 6. Fill in app information:
#    - App Name: WaveMeet
#    - Bundle ID: com.wavemeet.app (must be unique)
#    - SKU: wavemeet-001
#    - User Access: Full Access

# 7. Configure app capabilities:
#    - Push Notifications: Enable
#    - In-App Purchases: If needed
#    - Sign in with Apple: Enable
```

### Step 3: Create Release Build

```bash
# From iOS app directory
cd ios

# Build release version
cd ios
xcodebuild -workspace WaveMeet.xcworkspace \
  -scheme WaveMeet \
  -configuration Release \
  -archivePath /tmp/WaveMeet.xcarchive \
  archive

# Export IPA for TestFlight
xcodebuild -exportArchive \
  -archivePath /tmp/WaveMeet.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath /tmp/export
```

### Step 4: Upload to TestFlight

```bash
# Option 1: Using Xcode Organizer (GUI)
# 1. Open Xcode
# 2. Go to Window → Organizer
# 3. Select your archive
# 4. Click "Distribute App"
# 5. Select "TestFlight"
# 6. Follow the wizard

# Option 2: Using altool (Command Line)
xcrun altool --upload-app \
  --type ios \
  --file /tmp/export/WaveMeet.ipa \
  --username your-apple-id@example.com \
  --password your-app-specific-password
```

### Step 5: Manage TestFlight Testers

```bash
# 1. In App Store Connect
# 2. Go to TestFlight tab
# 3. Select Internal Testing
# 4. Add email addresses of testers
# 5. Or create public link for external testing
# 6. Send invite links to testers

# Testers receive email with TestFlight link
# They download TestFlight app from App Store
# Install WaveMeet from TestFlight
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue 1: "Cannot find module" errors

```bash
# Solution: Clear cache and reinstall
cd ios

# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall dependencies
npm install

# Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ../..
```

#### Issue 2: "Pod install fails"

```bash
# Solution: Update CocoaPods
sudo gem install cocoapods --pre

# Update pod repositories
pod repo update

# Remove pods and reinstall
cd ios
rm -rf Pods
pod install --repo-update
cd ../..
```

#### Issue 3: "Metro bundler not connecting"

```bash
# Solution: Clear Metro cache
cd ios

# Kill existing Metro process
lsof -i :8081
kill -9 <PID>

# Clear cache
rm -rf /tmp/metro-*

# Start fresh
npm start -- --reset-cache
```

#### Issue 4: "Simulator won't start"

```bash
# Solution: Reset simulator
xcrun simctl erase all

# Or restart specific simulator
xcrun simctl shutdown all
xcrun simctl boot "iPhone 15 Pro"
```

#### Issue 5: "Provisioning profile error on device"

```bash
# Solution: Fix signing
# In Xcode:
# 1. Go to Signing & Capabilities
# 2. Select your Team
# 3. Let Xcode auto-manage signing
# 4. Close and reopen Xcode
# 5. Try building again

# From command line:
cd ios/ios
rm -rf ~/Library/Developer/Xcode/DerivedData/*
open WaveMeet.xcworkspace
```

#### Issue 6: "Network errors connecting to backend"

```bash
# Solution: Verify backend is running and accessible

# Check if backend is running
curl http://localhost:3001/health

# Check firewall
# System Preferences → Security & Privacy → Firewall

# For physical device, use your Mac's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Update .env with correct URL
cat > ios/.env << 'EOF'
REACT_APP_API_URL=http://YOUR_MAC_IP:3001
REACT_APP_SOCKET_URL=http://YOUR_MAC_IP:3001
EOF
```

---

## Performance Testing

### Memory Profiling

```bash
# In Xcode:
# 1. Run app on device or simulator
# 2. Go to Xcode → Debug Navigator
# 3. Select "Memory" tab
# 4. Watch for memory spikes
# 5. Target: < 200MB during normal use

# Or use instruments
# 1. Xcode → Product → Profile (Cmd + I)
# 2. Select "Leaks" instrument
# 3. Test app workflows
# 4. Look for memory leaks
```

### Network Performance

```bash
# Test with Network Link Conditioner
# Download from Apple's Additional Tools

# Or simulate throttling in Xcode:
# 1. Product → Scheme → Edit Scheme
# 2. Run → Options
# 3. Network: WiFi (slowest)
# 4. Test app performance

# Test message sending speed
# Measure time from send to delivery
# Target: < 100ms latency
```

### UI Performance

```bash
# Measure frame rate
# In Xcode Debug Menu:
# 1. Debug → View Debugging → Show the Rendering Borders
# 2. Look for green frames (60 FPS)
# 3. Red frames indicate dropped frames

# Or use Instruments:
# 1. Product → Profile
# 2. Select "Core Animation"
# 3. Enable "Color Blended Layers"
# 4. Scroll and interact
# 5. Check for performance issues
```

---

## Testing Workflow Summary

### Day 1: Setup & Basic Testing

```bash
# 1. Install all prerequisites
# 2. Set up development environment
# 3. Test on simulator
# 4. Verify basic functionality (auth, chat, messages)
```

### Day 2: Device Testing

```bash
# 1. Test on physical device
# 2. Test network connectivity
# 3. Test push notifications
# 4. Test media uploads
```

### Day 3: Feature Testing

```bash
# 1. Test voice calls
# 2. Test video calls
# 3. Test typing indicators
# 4. Test contact management
```

### Day 4: Performance & Optimization

```bash
# 1. Memory profiling
# 2. Network performance testing
# 3. UI performance testing
# 4. Battery consumption testing
```

### Day 5: Beta Release

```bash
# 1. Build release version
# 2. Upload to TestFlight
# 3. Add testers
# 4. Send invitations
```

---

## Quick Reference Commands

```bash
# Install dependencies
cd ios && npm install && cd ios && pod install && cd ../..

# Start development
cd ios && npm start

# Run on simulator
cd ios && npm run ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"

# Run on physical device
cd ios && npx react-native run-ios --device

# Open Xcode
open ios/ios/WaveMeet.xcworkspace

# Clear cache
npm cache clean --force && rm -rf node_modules ios/ios/Pods ios/ios/Podfile.lock

# Build release
cd ios/ios && xcodebuild -workspace WaveMeet.xcworkspace -scheme WaveMeet -configuration Release -archivePath /tmp/WaveMeet.xcarchive archive
```

---

## Support & Documentation

### Related Files
- `MOBILE_SETUP_GUIDE.md` - General mobile setup
- `ARCHITECTURE.md` - App architecture
- `DEPLOYMENT.md` - Full deployment guide
- `SECURITY_TESTING_GUIDE.md` - Security testing

### External Resources
- [React Native Official Docs](https://reactnative.dev/)
- [Xcode Documentation](https://help.apple.com/xcode/)
- [iOS App Distribution](https://developer.apple.com/app-store/)
- [TestFlight Guide](https://developer.apple.com/testflight/)

---

## Next Steps

1. ✅ Complete prerequisite setup
2. ✅ Set up development environment
3. ✅ Test on simulator
4. ✅ Test on physical device
5. ✅ Complete performance testing
6. ✅ Prepare TestFlight beta
7. ✅ Distribute to testers
8. ✅ Iterate based on feedback
9. ✅ Prepare for App Store release

---

**Status:** ✅ Ready for Testing  
**Date:** February 15, 2026  
**Version:** 1.0

