# ⚡ iOS App Store Deployment - Quick Reference

**Updated:** February 16, 2026

---

## 🚀 Fast Track to App Store Submission

### Step 1: Pre-Submission Verification (15 minutes)
```bash
# Verify dependencies
npm list react-native
pod --version
xcode-select -p

# Run tests
npm test -- --coverage --watchAll=false

# Run linting
npm run lint

# Check for secrets/hardcoded values
grep -r "password\|secret\|api_key" --include="*.js" --include="*.ts" ios/ | grep -v node_modules
```

### Step 2: Version Updates (5 minutes)
```bash
# Update app.json
cat > app.json << 'EOF'
{
  "name": "WaveMeet",
  "displayName": "WaveMeet",
  "version": "1.0.0",
  "build": "1"
}
EOF

# Update in Xcode:
# - Product → Scheme → Build Settings
# - Version Number: 1.0.0
# - Build Number: 1
```

### Step 3: Build Release (10 minutes)
```bash
# Clean old builds
npm cache clean --force
rm -rf ios/ios/Pods ios/ios/Podfile.lock ~/Library/Developer/Xcode/DerivedData/*

# Install fresh dependencies
npm install
cd ios && pod install && cd ..

# Archive
open ios/WaveMeet.xcworkspace
# Product → Archive
```

### Step 4: App Store Connect Setup (15 minutes)
```
1. https://appstoreconnect.apple.com
2. "My Apps" → "+" → "New App"
3. Fill:
   - App Name: WaveMeet
   - Bundle ID: com.wavemeet.app
   - SKU: wavemeet-001
4. Configure capabilities:
   ✓ Push Notifications
   ✓ Sign In with Apple
5. Add URLs:
   - Privacy: https://www.wavemeet.app/privacy
   - Support: https://support.wavemeet.app
```

### Step 5: Submit (5 minutes)
```bash
# Option A: Xcode GUI (Recommended)
# 1. Xcode → Window → Organizer
# 2. Select archive
# 3. "Distribute App" → "App Store"
# 4. Follow prompts

# Option B: Command Line
xcrun altool --upload-app \
  -f /tmp/export/WaveMeet.ipa \
  -t ios \
  -u your-apple-id@example.com \
  --password your-app-specific-password
```

### Step 6: Monitor Status
```
Timeline:
• Minutes 0-5:    Processing
• Minutes 5-30:   Waiting for Review Queue
• Hours 1-24:     In Review
• Hours 24-48:    Review Complete

Check at: https://appstoreconnect.apple.com
App Status: "Ready for Sale" = Approved!
```

---

## 📋 Critical Checklist

### Technical ✓
- [ ] Xcode 15+
- [ ] iOS SDK 13+
- [ ] All dependencies installed
- [ ] Tests passing
- [ ] No compile warnings

### Content ✓
- [ ] App icon (1024x1024, PNG, sRGB)
- [ ] Screenshots (2-10 per device)
- [ ] App description
- [ ] Release notes
- [ ] Privacy policy URL
- [ ] Support URL

### Compliance ✓
- [ ] Privacy policy reviewed
- [ ] No hardcoded secrets
- [ ] Permissions justified
- [ ] Age rating appropriate
- [ ] Content meets guidelines

### Account ✓
- [ ] Developer account active
- [ ] App ID created
- [ ] Signing certificate valid
- [ ] Provisioning profile ready
- [ ] Tax/banking completed

---

## 🔧 Build Commands Quick Reference

```bash
# Clean everything
npm cache clean --force && rm -rf node_modules ios/ios/Pods ios/ios/Podfile.lock

# Install dependencies
npm install && cd ios && pod install && cd ..

# Test everything
npm test -- --coverage --watchAll=false && npm run lint

# Open Xcode
open ios/WaveMeet.xcworkspace

# Build archive (command line)
cd ios && xcodebuild -workspace WaveMeet.xcworkspace \
  -scheme WaveMeet -configuration Release \
  -archivePath /tmp/WaveMeet.xcarchive archive

# Validate
xcrun altool --validate-app -f /tmp/WaveMeet.ipa \
  -t ios -u your-apple-id@example.com \
  --password your-app-specific-password
```

---

## 📲 Asset Requirements

### App Icon
```
Dimensions:  1024 × 1024 pixels
Format:      PNG
Color Space: sRGB
Corners:     Square (iOS applies rounding)
Alpha:       No transparency
File:        AppIcon.png
```

### Screenshots (iPhone 15 Pro Max as example)
```
Size:        1290 × 2796 pixels
Format:      PNG or JPG
Quantity:    2-10 recommended (3-5 ideal)
Content:     Show key features
Text:        Keep large and readable
```

### Localization
```
English (required)
Spanish, French, German, Japanese, Mandarin (recommended)
Create separate screenshots for each language showing:
  1. Authentication screen
  2. Main messaging screen
  3. Call screen
  4. Profile/settings
  5. Contact management
```

---

## 📝 Content Templates

### App Description (max 170 chars for display)
```
WaveMeet - Connect, chat, and call your friends 
and family with crystal-clear video and voice.
```

### Release Notes
```
🎉 WaveMeet v1.0.0 Launch!

✓ User registration and authentication
✓ Instant messaging
✓ Voice calling
✓ Video calling
✓ Media sharing
✓ Contact management
✓ Real-time notifications

For feedback: support@wavemeet.app
```

---

## ⚠️ Top Rejection Reasons & Fixes

| Issue | Fix |
|-------|-----|
| App crashes on launch | Test on iOS 13, 14, 15, 16, 17 |
| High memory usage | Profile with Instruments, optimize |
| Privacy policy missing | Add URL to privacy policy page |
| Hardcoded API keys | Remove, use environment variables |
| No internet handling | Add offline support, error messages |
| Excessive notifications | Respect user preference settings |
| Guideline violation | Review App Store Review Guidelines |

---

## 🎯 Success Indicators

✅ **Submission Successful When:**
- Build uploads without errors
- Build status: "Waiting for Review" (in 5-30 min)
- You receive approval email (24-48 hours typical)
- Status changes to "Ready for Sale"
- App appears in App Store search

✅ **Post-Launch Monitoring:**
- No crashes in first 24 hours
- Download numbers increasing
- User ratings appearing
- Support emails monitored
- Analytics tracking working

---

## 🔑 Important URLs

```
App Store Connect:
https://appstoreconnect.apple.com

Apple Developer Account:
https://developer.apple.com/account

App Store (Search for app):
https://apps.apple.com

Review Guidelines:
https://developer.apple.com/app-store/review/guidelines/

TestFlight (Beta testing):
https://testflight.apple.com
```

---

## 📞 Quick Help

**Problem: Build not showing in App Store Connect?**
```
Wait 5-10 minutes, then refresh browser
Check email for upload errors
Verify upload completed in Xcode
```

**Problem: Validation failed?**
```
Check Organizer for error message
Fix identified issue (usually signing)
Clean derived data: rm -rf ~/Library/Developer/Xcode/DerivedData/*
Rebuild archive
```

**Problem: Rejected by Apple?**
```
Read rejection email carefully
Review app against App Store Review Guidelines
Fix identified issue
Increment build number (1 → 2)
Resubmit with new build
```

**Problem: Can't find build in App Store Connect?**
```
Builds take 5-30 minutes to process
Check "Builds" tab
If still missing, check email for error
May need to retry upload
```

---

## 📅 Timeline Estimate

| Step | Time | Total |
|------|------|-------|
| Preparation | 15 min | 15 min |
| Build & Test | 10 min | 25 min |
| App Store Connect | 15 min | 40 min |
| Submit | 5 min | 45 min |
| **Processing** | **5-30 min** | **50-75 min** |
| **Waiting for Review** | **1-24 hrs** | **1-24 hrs** |
| **In Review** | **24-48 hrs** | **48-72 hrs** |
| **Approved** | Instant | **48-72 hrs** |

**Total time from start to App Store:** ~3-5 days

---

## 🚀 Deploy Now Checklist

Quick verification before final submit:

```bash
# 1. Code ready?
npm test -- --coverage --watchAll=false

# 2. No secrets exposed?
grep -r "password\|secret\|key" ios/ | grep -v node_modules | grep -v ".xcarchive"

# 3. Version updated?
grep "version\|build" app.json

# 4. Archive built?
ls -lh /tmp/WaveMeet.xcarchive 2>/dev/null || echo "Not built yet"

# 5. App Store Connected?
open https://appstoreconnect.apple.com

# 6. Ready to submit?
echo "✓ All checks passed, ready to submit!"
```

---

## 💡 Pro Tips

1. **Test on real device** before submission
2. **Read rejection reason carefully** if rejected
3. **Monitor first 24 hours** after approval
4. **Respond to user reviews** immediately
5. **Keep build numbers sequential** (1, 2, 3...)
6. **Have privacy policy URL ready** before submission
7. **Take professional screenshots** with text overlay
8. **Test on iOS 13** - minimum supported version
9. **Keep backup of signing certificates** and profiles
10. **Plan for 3-5 days** total from start to live

---

**Last Updated:** February 16, 2026  
**For Full Details:** See `APP_STORE_DEPLOYMENT_GUIDE.md`  
**Support:** support@wavemeet.app
