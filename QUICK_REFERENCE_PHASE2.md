# QUICK REFERENCE GUIDE - PHASE 2 ENHANCEMENTS

**Version:** 1.0  
**Last Updated:** February 15, 2026

---

## 🚀 Quick Links

### Documentation
- **CI/CD Setup:** [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md)
- **Features Guide:** [FEATURES_IMPLEMENTATION_GUIDE.md](FEATURES_IMPLEMENTATION_GUIDE.md)
- **Security Testing:** [SECURITY_TESTING_GUIDE.md](SECURITY_TESTING_GUIDE.md)
- **Privacy Policy:** [PRIVACY_POLICY.md](PRIVACY_POLICY.md)
- **Terms of Service:** [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md)
- **Copyright & License:** [COPYRIGHT_AND_LICENSE.md](COPYRIGHT_AND_LICENSE.md)

---

## 🔧 GitHub Actions Workflows

### Setup

```bash
# 1. Add GitHub secrets
gh secret set SNYK_TOKEN --body "your_token"
gh secret set SONARCLOUD_TOKEN --body "your_token"
gh secret set SLACK_WEBHOOK --body "https://hooks.slack.com/..."

# 2. Configure branch protection
# Settings → Branches → Add protection rule
# - Require status checks to pass
# - Require code reviews
# - Require branches to be up to date
```

### View Workflow Status

```bash
# List all workflows
gh run list

# View specific workflow
gh run view <run-id>

# Watch workflow in real-time
gh run watch <run-id>
```

### Troubleshoot Workflows

```bash
# Download logs
gh run download <run-id>

# View workflow file syntax
gh workflow view <workflow-name>

# Manually trigger workflow
gh workflow run <workflow-name> -r main
```

---

## 📲 Push Notifications Feature

### Environment Setup

```bash
# 1. Create Firebase project
# https://console.firebase.google.com

# 2. Get service account key
# Project Settings → Service Accounts → Create private key

# 3. Set environment variable
export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
```

### API Usage

```bash
# Register device
curl -X POST http://localhost:5001/api/notifications/register-device \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "device-token-from-fcm",
    "platform": "ios",
    "deviceName": "iPhone 14"
  }'

# Update preferences
curl -X POST http://localhost:5001/api/notifications/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "messages": true,
      "mentions": true,
      "calls": true,
      "sound": true,
      "doNotDisturb": {
        "enabled": false
      }
    }
  }'

# Test notification
curl -X POST http://localhost:5001/api/notifications/test \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"deviceToken": "device-token"}'
```

---

## 📂 Media Upload Feature

### Environment Configuration

```bash
# .env
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800  # 50MB

# AWS S3 (optional)
USE_S3=true
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=wavemeet-media
AWS_S3_REGION=us-east-1
```

### File Type Limits

| Type | Formats | Max Size |
|------|---------|----------|
| Image | JPEG, PNG, GIF, WebP | 10MB |
| Video | MP4, MOV, AVI | 50MB |
| Audio | MP3, WAV, OGG | 20MB |
| Doc | PDF, DOC, DOCX | 10MB |

### API Usage

```bash
# Upload single file
curl -X POST http://localhost:5001/api/media/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@photo.jpg"

# Upload multiple files
curl -X POST http://localhost:5001/api/media/upload-multiple \
  -H "Authorization: Bearer <token>" \
  -F "files=@photo1.jpg" \
  -F "files=@photo2.jpg"

# Get storage usage
curl -X GET http://localhost:5001/api/media/stats/usage \
  -H "Authorization: Bearer <token>"

# Delete file
curl -X DELETE http://localhost:5001/api/media/file-uuid \
  -H "Authorization: Bearer <token>"
```

### Test Upload

```bash
# Create test file
dd if=/dev/zero of=test.jpg bs=1M count=5

# Upload
curl -X POST http://localhost:5001/api/media/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@test.jpg"

# Clean up
rm test.jpg
```

---

## 📞 Voice/Video Calls Feature

### Socket Events

```javascript
// Initiate call
socket.emit('call:initiate', {
  callId: 'unique-id',
  calleeId: 'target-user-id',
  callType: 'video', // or 'audio'
  callerName: 'John'
});

// Accept call
socket.emit('call:accept', { callId: 'call-id' });

// Reject call
socket.emit('call:reject', {
  callId: 'call-id',
  reason: 'busy'
});

// Send WebRTC signal
socket.emit('call:signal', {
  callId: 'call-id',
  to: 'recipient-id',
  signal: sdpOffer
});

// Mute/unmute
socket.emit('call:mute-audio', { callId: 'call-id' });
socket.emit('call:unmute-audio', { callId: 'call-id' });
socket.emit('call:mute-video', { callId: 'call-id' });
socket.emit('call:unmute-video', { callId: 'call-id' });

// End call
socket.emit('call:end', { callId: 'call-id' });
```

### Listen for Events

```javascript
// Incoming call
socket.on('call:incoming', (data) => {
  console.log('Call from:', data.callerId);
  console.log('Type:', data.callType);
});

// Call accepted
socket.on('call:accepted', (data) => {
  console.log('Call accepted by:', data.acceptedBy);
});

// Call ended
socket.on('call:ended', (data) => {
  console.log('Call duration:', data.duration);
});

// Receive WebRTC signal
socket.on('call:signal', (data) => {
  console.log('Signal from:', data.from);
  // Process signal
});
```

### API Endpoints

```bash
# Get active calls
curl -X GET http://localhost:5001/api/calls/active \
  -H "Authorization: Bearer <token>"

# Get call history
curl -X GET "http://localhost:5001/api/calls/history?limit=50" \
  -H "Authorization: Bearer <token>"

# Get call statistics
curl -X GET "http://localhost:5001/api/calls/stats/usage?period=month" \
  -H "Authorization: Bearer <token>"

# Get specific call
curl -X GET http://localhost:5001/api/calls/call-id \
  -H "Authorization: Bearer <token>"

# Delete call from history
curl -X DELETE http://localhost:5001/api/calls/call-id \
  -H "Authorization: Bearer <token>"
```

---

## 🔐 Security Testing

### Quick Scan Commands

```bash
# Run ESLint
npm run lint

# Check dependencies
npm audit
npm audit fix  # Auto-fix

# Snyk scan
snyk test
snyk test --severity-threshold=high

# OWASP Dependency Check
dependency-check --project "WaveMeet" --scan ./

# Secrets detection
trufflehog filesystem . --json
gitleaks detect --source .

# Container scan
trivy image wavemeet-backend:latest
```

### Test Checklist

- [ ] All dependencies scanned for vulnerabilities
- [ ] No secrets found in codebase
- [ ] ESLint passes without errors
- [ ] SAST scan clean
- [ ] DAST scan on staging environment
- [ ] API security tests passed
- [ ] Database security verified
- [ ] Encryption working correctly
- [ ] CORS properly configured
- [ ] Rate limiting implemented

---

## 📋 Privacy & Compliance

### Privacy Policy Highlights

**User Data:**
- ✅ GDPR compliant
- ✅ CCPA compliant
- ✅ Data minimization enforced
- ✅ User deletion supported
- ✅ Encryption in transit (TLS 1.3)
- ✅ Encryption at rest

**User Rights:**
- Right to access data
- Right to delete account
- Right to data portability
- Right to opt-out
- Right to non-discrimination

**Retention:**
- Messages: Until deleted
- Media: Until deleted
- Backup data: 30 days
- Transaction logs: 7 years

### Terms of Service Key Points

- ✅ 13+ years old required
- ✅ Personal use only (commercial agreement required)
- ✅ Prohibited content policy
- ✅ IP protection terms
- ✅ Liability limitations
- ✅ Arbitration clause
- ✅ Modification rights reserved

### Copyright & License

- **License:** MIT (full text in COPYRIGHT_AND_LICENSE.md)
- **Trademark:** WaveMeet™ owned by WaveMeet Inc.
- **Dependencies:** All licenses documented
- **Contributors:** Welcome with CLA

---

## 📊 Monitoring & Alerts

### GitHub Actions Status

```bash
# Add status badge to README
![Backend Tests](https://github.com/rakeshkoripella/WaveMeet/workflows/Backend%20Tests%20&%20Build/badge.svg)
![Frontend Tests](https://github.com/rakeshkoripella/WaveMeet/workflows/Frontend%20Tests%20&%20Build/badge.svg)
![Code Quality](https://github.com/rakeshkoripella/WaveMeet/workflows/Code%20Quality%20&%20Security%20Analysis/badge.svg)
```

### Slack Notifications

```bash
# Configure webhook
gh secret set SLACK_WEBHOOK --body "https://hooks.slack.com/..."

# Workflow will send notifications on:
# - Test failures
# - Security findings
# - Deployment status
# - Performance changes
```

---

## 🐛 Troubleshooting

### CI/CD Issues

**Problem:** Workflow timeout
```bash
# Solution: Increase timeout
# In workflow: timeout-minutes: 60
```

**Problem:** Cache not working
```bash
# Solution: Commit lock file
git add package-lock.json
git commit -m "Update lock file"
```

**Problem:** Secrets not accessible
```bash
# Solution: Verify secret name matches exactly
# No spaces, case-sensitive
gh secret list
```

### Feature Issues

**Push Notifications not received:**
- [ ] Device token registered correctly
- [ ] Firebase configured
- [ ] Notification preferences enabled
- [ ] Network connectivity verified
- [ ] Device clock synchronized

**Media uploads failing:**
- [ ] File size within limit (check MAX_FILE_SIZE)
- [ ] File type supported
- [ ] Upload directory writable
- [ ] Disk space available
- [ ] Network timeout not exceeded

**Calls not connecting:**
- [ ] Both users online
- [ ] Socket.io connection established
- [ ] WebRTC ICE servers reachable
- [ ] Firewall/NAT allowing peer connections
- [ ] STUN/TURN servers configured

---

## 📚 Additional Resources

### Documentation Files

```
GITHUB_ACTIONS_GUIDE.md          (650 lines) - CI/CD setup & management
FEATURES_IMPLEMENTATION_GUIDE.md (720 lines) - Feature implementations
SECURITY_TESTING_GUIDE.md        (590 lines) - Security testing procedures
PRIVACY_POLICY.md                (560 lines) - Data protection policy
TERMS_OF_SERVICE.md              (480 lines) - Usage terms
COPYRIGHT_AND_LICENSE.md         (340 lines) - Licensing information
PHASE2_IMPLEMENTATION_SUMMARY.md (400 lines) - Phase 2 overview
```

### External Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Firebase Docs](https://firebase.google.com/docs)
- [WebRTC Docs](https://webrtc.org/getting-started/overview)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GDPR Guide](https://gdpr-info.eu/)

---

## 🔄 Common Workflows

### Deploy Backend Changes

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# ... edit files ...

# 3. Commit
git add .
git commit -m "Add new feature"

# 4. Push and create PR
git push origin feature/my-feature

# 5. CI/CD runs automatically
# Wait for all checks to pass

# 6. Get review and merge
# Workflows deploy to staging automatically
```

### Add New Notification Type

```bash
# 1. Update services
# backend/src/services/pushNotifications.js

# 2. Create route
# backend/src/routes/notifications.js

# 3. Test locally
curl -X POST http://localhost:5001/api/notifications/test \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"type":"my-type"}'

# 4. Deploy
git add .
git commit -m "Add new notification type"
git push origin main
```

### Run Security Scan

```bash
# Local scanning
npm audit
npm run lint
snyk test

# GitHub Actions scan (automatic)
# Push to main/develop branch
# Check Actions tab for results

# Manual trigger
gh workflow run code-quality.yml -r main
```

---

## 📞 Getting Help

### Issues & Support

- **GitHub Issues:** Report bugs and feature requests
- **Security:** [security@wavemeet.com](mailto:security@wavemeet.com)
- **Documentation:** Check relevant `.md` file
- **Troubleshooting:** See SECURITY_TESTING_GUIDE.md section 10

### Community

- **Discussions:** GitHub Discussions
- **Wiki:** [WaveMeet Wiki](https://github.com/rakeshkoripella/WaveMeet/wiki)
- **Contributing:** See CONTRIBUTING.md (when created)

---

**Version:** 1.0  
**Last Updated:** February 15, 2026  
**Status:** Active
