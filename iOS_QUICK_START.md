# iOS Testing - Quick Start Guide

**WaveMeet Phase 2 - iOS Deployment**  
**Date:** February 15, 2026

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites Check
```bash
# Make sure you have installed:
# 1. Xcode (from App Store)
# 2. Node.js 16+ (from nodejs.org)
# 3. CocoaPods: sudo gem install cocoapods

# Verify:
node --version        # Should be v16 or higher
npm --version         # Should be v7 or higher
pod --version         # Should be installed
```

### 3-Step Deployment

**Step 1: Setup (Run once)**
```bash
cd /path/to/WaveMeet
./deploy-ios.sh setup
```

**Step 2: Run on Simulator**
```bash
./deploy-ios.sh simulator
# Wait for app to load (30-60 seconds first time)
```

**Step 3: Test the App**
```
In the simulator:
1. Tap "Register" if new user
2. Create an account
3. Login
4. Try creating a chat
5. Send a message
```

---

## 🚀 Detailed Deployment Methods

### Method 1: Automatic Script (Recommended)

```bash
# Navigate to project
cd /path/to/WaveMeet

# Option A: Deploy to Simulator (Easiest)
./deploy-ios.sh simulator

# Option B: Deploy to Physical Device
./deploy-ios.sh device

# Option C: Build for TestFlight
./deploy-ios.sh testflight
```

### Method 2: Manual Steps (if script doesn't work)

```bash
# Step 1: Navigate to iOS app directory
cd /path/to/WaveMeet/ios

# Step 2: Install dependencies
npm install
cd ios && pod install && cd ..

# Step 3: Start Metro bundler (in Terminal 1)
npm start

# Step 4: Build and run on simulator (in Terminal 2)
npx react-native run-ios

# OR run on physical device (in Terminal 2)
npx react-native run-ios --device
```

### Method 3: Using Xcode (GUI)

```bash
# Step 1: Open Xcode project
open /path/to/WaveMeet/ios/ios/WaveMeet.xcworkspace

# Step 2: In Xcode, select your target:
# - Simulator: Click top left simulator selector
# - Device: Connect iPhone, it will appear in selector

# Step 3: Click "Play" button (Cmd + R) to build and run

# Step 4: In another terminal, start Metro bundler
cd /path/to/WaveMeet/ios
npm start
```

---

## 📱 Testing Checklist

### Basic Functionality
- [ ] App launches without crashing
- [ ] Login screen appears
- [ ] Can create account (Register)
- [ ] Can login with credentials
- [ ] Profile page displays

### Chat Features
- [ ] Chat list loads
- [ ] Can create new chat
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Can receive messages

### Real-Time Features
- [ ] Typing indicator shows when other person types
- [ ] Online/offline status updates
- [ ] New messages appear instantly

### Media Features
- [ ] Can upload images
- [ ] Can upload files
- [ ] Media displays in chat

### Push Notifications
- [ ] Notifications appear when app in background
- [ ] Notifications show message preview

---

## 🔧 Troubleshooting

### Issue: "command not found: pod"
```bash
# Solution: Install CocoaPods
sudo gem install cocoapods
pod --version  # Verify
```

### Issue: "Pod install fails"
```bash
# Solution: Update CocoaPods
sudo gem install cocoapods --pre
pod repo update
cd ios/ios && pod install --repo-update && cd ../..
```

### Issue: "Metro bundler errors"
```bash
# Solution: Clear cache and restart
npm cache clean --force
rm -rf /tmp/metro-*
npm start -- --reset-cache
```

### Issue: "Cannot connect to backend"
```bash
# Solution: Check backend is running
curl http://localhost:3001/health

# For physical device, update IP in .env
# Get your Mac's IP:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Edit ios/.env and update REACT_APP_API_URL
```

### Issue: "Simulator won't start"
```bash
# Solution: Reset simulator
xcrun simctl erase all
xcrun simctl boot "iPhone 15 Pro"
```

### Issue: "Device not recognized"
```bash
# Solution: Trust computer on device
# On iPhone: Settings → Developer → Trust [Your Computer]

# Or unlock device and try again
# Kill existing processes:
lsof -i :8081
kill -9 <PID>
```

---

## 📊 Testing Scenarios

### Scenario 1: Single User Testing
```
1. Deploy app to simulator
2. Create account (e.g., user1@test.com / password123)
3. Login with account
4. View profile
5. Create mock data for testing UI
```

### Scenario 2: Multi-Device Testing (Recommended)
```
1. Deploy to simulator (Chrome for web, optional)
2. Deploy to physical device
3. Create 2 different accounts:
   - Simulator: user1@test.com
   - Device: user2@test.com
4. Send messages between them
5. Test real-time features
6. Test push notifications
```

### Scenario 3: Network Testing
```
1. Deploy on physical device
2. Test with WiFi on
3. Turn off WiFi, turn on Mobile Data
4. Verify app reconnects
5. Test message buffering
6. Turn WiFi back on
```

---

## 🎯 Performance Metrics to Track

| Metric | Target | How to Measure |
|--------|--------|---|
| App Launch | < 3 sec | Time from tap to home screen |
| Message Send | < 100 ms | Time from send to appear on screen |
| Message Receive | < 100 ms | Time from send to appear on receiver |
| Chat List Load | < 1 sec | Time to display list |
| Scroll Smoothness | 60 FPS | Use Xcode Debug Gauges |
| Memory Usage | < 200 MB | Monitor in Xcode |
| Battery Drain | <10% per hour | Normal use test |

---

## 📝 Testing Report Template

```
WaveMeet iOS Testing Report
Date: ____________
Tester: ____________
Device: ____________
iOS Version: ____________

Features Tested:
- [ ] Authentication (Login/Register)
- [ ] Chat (Create/Send/Receive)
- [ ] Media (Upload images/files)
- [ ] Calls (Voice/Video)
- [ ] Notifications (Push)
- [ ] Profile (View/Edit)

Issues Found:
1. ______________________________________
2. ______________________________________
3. ______________________________________

Performance:
- App Launch Time: ______ seconds
- Message Send Time: ______ ms
- Memory Usage: ______ MB

Overall Rating: _____ / 5 stars
Recommended for Production: [ ] Yes [ ] No
```

---

## 🔗 Next Steps

1. **Setup** (15 min)
   - Install prerequisites
   - Run setup script
   - Verify environment

2. **Test on Simulator** (1 hour)
   - Deploy to simulator
   - Test basic features
   - Check logs

3. **Test on Physical Device** (2 hours)
   - Connect iPhone
   - Deploy to device
   - Test real-world scenario

4. **Beta Testing** (1 week)
   - Build TestFlight version
   - Invite external testers
   - Collect feedback

5. **Production Release** (After testing)
   - Fix critical issues
   - Build final version
   - Submit to App Store

---

## 💡 Pro Tips

1. **Keep two terminals open**
   - Terminal 1: Metro bundler (npm start)
   - Terminal 2: Build commands

2. **Use Device for Real Testing**
   - Simulator doesn't test push notifications properly
   - Network behavior different on device
   - Battery drain not measurable on simulator

3. **Test with Multiple Accounts**
   - More realistic testing
   - Can test messaging, calls, etc.
   - Better coverage of features

4. **Monitor Network Activity**
   - Xcode → Debug → Network → Show Network Activity
   - Watch API calls and WebSocket connections
   - Check for unnecessary requests

5. **Save Test Credentials**
   ```
   Test Account 1: user1@test.com / password123
   Test Account 2: user2@test.com / password456
   Test Account 3: user3@test.com / password789
   ```

---

## 📞 Support Resources

- **iOS Deployment Guide:** `iOS_DEPLOYMENT_GUIDE.md`
- **Mobile Setup Guide:** `MOBILE_SETUP_GUIDE.md`
- **Architecture Guide:** `ARCHITECTURE.md`
- **Deployment Guide:** `DEPLOYMENT.md`

---

## ✅ Deployment Checklist

```
Prerequisites:
  [ ] Xcode installed
  [ ] Node.js 16+ installed
  [ ] CocoaPods installed
  [ ] Git configured

Development Setup:
  [ ] Project cloned/downloaded
  [ ] npm dependencies installed
  [ ] Pod dependencies installed
  [ ] .env file configured

Simulator Testing:
  [ ] Setup script completed
  [ ] App runs on simulator
  [ ] Basic features work
  [ ] No critical errors

Device Testing:
  [ ] Device connected and trusted
  [ ] App deployed to device
  [ ] All features tested
  [ ] Performance acceptable

Beta Distribution:
  [ ] TestFlight app built
  [ ] Testers added
  [ ] Invitations sent
  [ ] Feedback collected
```

---

**Ready to test? Start with:**
```bash
cd /path/to/WaveMeet
./deploy-ios.sh setup
./deploy-ios.sh simulator
```

**Questions or issues? Check `iOS_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.**

---

**Status:** ✅ Ready for Testing  
**Date:** February 15, 2026  
**Version:** 1.0

