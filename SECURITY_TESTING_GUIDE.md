# SECURITY TESTING GUIDE

**Version:** 1.0  
**Last Updated:** February 15, 2026  
**Status:** Active

---

## 1. Introduction

This document provides comprehensive security testing procedures for the WaveMeet application. It covers vulnerability assessment, penetration testing, and compliance validation.

---

## 2. Security Testing Framework

### 2.1 Testing Phases

1. **Pre-Deployment Testing**
   - Static code analysis
   - Dependency scanning
   - Secrets detection
   - SAST (Static Application Security Testing)

2. **Staging Environment Testing**
   - Dynamic application security testing (DAST)
   - API security testing
   - Authentication/authorization testing
   - Database security testing

3. **Continuous Testing**
   - Regular vulnerability scans
   - Dependency updates
   - Security monitoring
   - Incident response drills

### 2.2 Testing Tools

| Tool | Purpose | Frequency |
|------|---------|-----------|
| Snyk | Dependency vulnerabilities | Weekly |
| SonarQube | Code quality & security | On commit |
| OWASP ZAP | Dynamic security scanning | Monthly |
| Trivy | Container scanning | Per build |
| TruffleHog | Secrets detection | Per commit |
| Burp Suite | Manual penetration testing | Quarterly |
| Semgrep | Pattern-based scanning | On commit |

---

## 3. Static Application Security Testing (SAST)

### 3.1 Code Analysis

**Configuration:**
```yaml
# .eslintrc.json additions for security
{
  "extends": ["plugin:security/recommended"],
  "plugins": ["security"],
  "rules": {
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-unsafe-regex": "warn",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "warn"
  }
}
```

**Run Command:**
```bash
npm run lint
npm run sast
```

### 3.2 Focus Areas

- **Injection Flaws:** SQL injection, NoSQL injection, Command injection
- **Broken Authentication:** Weak password validation, token vulnerabilities
- **Sensitive Data Exposure:** Unencrypted storage, logging secrets
- **Broken Access Control:** Privilege escalation, authorization bypasses
- **XXE:** XML External Entity attacks
- **CSRF:** Cross-Site Request Forgery vulnerabilities
- **Insecure Deserialization:** Unsafe object deserialization
- **Using Components with Known Vulnerabilities:** Outdated dependencies

---

## 4. Dependency Vulnerability Scanning

### 4.1 NPM Audit

**Run automated audit:**
```bash
npm audit
npm audit --json > audit-report.json
```

**Remediation:**
```bash
npm audit fix
npm audit fix --force  # For major version updates
```

### 4.2 Snyk Integration

**Installation:**
```bash
npm install -g snyk
snyk auth
```

**Scanning:**
```bash
# Scan for vulnerabilities
snyk test

# Monitor continuously
snyk monitor

# Test Docker images
snyk container test wavemeet-backend:latest

# Test open source vulnerabilities
snyk test --severity-threshold=high
```

**Configuration (.snyk):**
```yaml
version: v1.25.0
# Ignore specific vulnerabilities
ignore:
  SNYK-JS-EXAMPLE-123456:
    - '*':
        reason: Patched in newer version
        expires: 2026-12-31
```

### 4.3 OWASP Dependency-Check

**Installation:**
```bash
npm install -D dependency-check
```

**Running:**
```bash
dependency-check --project "WaveMeet" --scan ./ --format JSON
```

---

## 5. Secrets Detection

### 5.1 TruffleHog

**Installation:**
```bash
pip install truffleHog
```

**Scanning:**
```bash
trufflehog filesystem . --json --fail --max-depth=5
trufflehog git https://github.com/rakeshkoripella/WaveMeet --json
```

### 5.2 Gitleaks

**Installation:**
```bash
npm install -g gitleaks
```

**Scanning:**
```bash
gitleaks detect --source . --report-path=gitleaks-report.json
```

### 5.3 .gitignore Security

**Critical patterns to ignore:**
```
# Environment files
.env
.env.local
.env.*.local
.env.production

# Secrets
**/secrets/**
**/*secret*
**/*password*
**/*key*
**/*token*

# API Keys
config/keys/**
credentials/**

# Database dumps
*.sql
*.dump

# SSH Keys
*.pem
*.pub
id_rsa*

# API tokens
.api-keys
.tokens
```

---

## 6. Dynamic Application Security Testing (DAST)

### 6.1 OWASP ZAP

**Installation:**
```bash
# Docker
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000
```

**Scan Configuration:**
```bash
# Baseline scan (quick)
./zap.sh -cmd -quickurl http://localhost:3000 -quickout report.html

# Full scan
./zap.sh -cmd -url http://localhost:3000 -quickout report.html
```

### 6.2 Burp Suite Community

**Manual Testing Checklist:**
- [ ] SQL Injection testing
- [ ] XSS injection testing
- [ ] CSRF token validation
- [ ] Authentication bypass attempts
- [ ] Authorization testing
- [ ] Input validation testing
- [ ] Rate limiting testing
- [ ] Session management testing

---

## 7. API Security Testing

### 7.1 Authentication Testing

**Test Cases:**

```bash
# 1. Missing auth token
curl -X GET http://localhost:5001/api/conversations \
  -H "Content-Type: application/json"
# Expected: 401 Unauthorized

# 2. Invalid token
curl -X GET http://localhost:5001/api/conversations \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized

# 3. Expired token
curl -X GET http://localhost:5001/api/conversations \
  -H "Authorization: Bearer expired_token"
# Expected: 401 Unauthorized

# 4. Token tampering
curl -X GET http://localhost:5001/api/conversations \
  -H "Authorization: Bearer tampered_token"
# Expected: 401 Unauthorized
```

### 7.2 Authorization Testing

```bash
# Test access to other user's data
curl -X GET http://localhost:5001/api/users/other-user-id \
  -H "Authorization: Bearer valid_token"
# Expected: 403 Forbidden
```

### 7.3 Input Validation Testing

```bash
# SQL Injection attempt
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com\" OR \"1\"=\"1", "password": "anything"}'
# Expected: 400 Bad Request or safe error

# XSS attempt
curl -X POST http://localhost:5001/api/users/profile \
  -H "Authorization: Bearer valid_token" \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(1)</script>"}'
# Expected: 400 Bad Request
```

### 7.4 Rate Limiting Testing

```bash
# Test login rate limiting
for i in {1..20}; do
  curl -X POST http://localhost:5001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "wrong"}'
done
# Expected: 429 Too Many Requests after threshold
```

---

## 8. Database Security Testing

### 8.1 PostgreSQL Security

**Test Cases:**

```sql
-- Check for weak passwords
SELECT * FROM users WHERE password IS NULL;

-- Check for encrypted fields
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users';

-- Verify column-level encryption
SELECT * FROM users LIMIT 1;
```

### 8.2 SQL Injection Testing

**Vulnerable code check:**
```bash
grep -r "SELECT.*+" backend/src --include="*.js"
grep -r "template.*\`" backend/src --include="*.js"
grep -r "eval\|Function" backend/src --include="*.js"
```

---

## 9. Encryption and Hashing Testing

### 9.1 Password Hashing Verification

```javascript
// Test bcryptjs strength
const bcrypt = require('bcryptjs');

const testPassword = 'TestPassword123!';
const testHash = await bcrypt.hash(testPassword, 10);
const isValid = await bcrypt.compare(testPassword, testHash);

console.log('Hash validation:', isValid); // Should be true

// Verify salt rounds
const costFactor = testHash.split('$')[2];
console.log('Cost factor:', costFactor); // Should be 10
```

### 9.2 JWT Token Verification

```javascript
const jwt = require('jsonwebtoken');

// Test token expiration
const token = jwt.sign(
  { userId: '123' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Try to verify expired token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('Valid token:', decoded);

// Test invalid signature
const tamperedToken = token.substring(0, token.length - 5) + '00000';
try {
  jwt.verify(tamperedToken, process.env.JWT_SECRET);
} catch (error) {
  console.log('Tampered token rejected'); // Expected
}
```

---

## 10. Network Security Testing

### 10.1 HTTPS/TLS Verification

```bash
# Test SSL/TLS configuration
nmap --script ssl-enum-ciphers -p 443 example.com

# Check certificate
openssl s_client -connect example.com:443

# Test TLS version
openssl s_client -connect example.com:443 -tls1
```

### 10.2 CORS Testing

```bash
# Test CORS headers
curl -H "Origin: http://malicious.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:3000/api/test -v

# Expected: Should NOT allow malicious origin
```

### 10.3 CSP Testing

```bash
# Check Content Security Policy headers
curl -I http://localhost:3000 | grep Content-Security-Policy
```

---

## 11. Authentication & Authorization Testing

### 11.1 Multi-Factor Authentication

- [ ] Test MFA implementation
- [ ] Test MFA bypass attempts
- [ ] Test backup codes functionality
- [ ] Test recovery options

### 11.2 Session Management

```bash
# Test session timeout
curl -X GET http://localhost:3000/api/me \
  -H "Cookie: sessionId=old_session_id"
# Expected: 401 Unauthorized

# Test concurrent sessions
# Login twice, verify both sessions work
# Logout one session, verify other still works
```

---

## 12. Mobile App Security Testing

### 12.1 iOS Security

```bash
# Check for hardcoded credentials
grep -r "password\|API_KEY\|secret" ios/src --include="*.js"

# Verify secure storage
# - AsyncStorage is NOT for sensitive data
# - Use Keychain for tokens
```

### 12.2 Android Security

```bash
# Check for hardcoded credentials
grep -r "password\|API_KEY\|secret" android/src --include="*.js"

# Verify secure storage
# - Use Android Keystore
# - SharedPreferences with encryption for non-sensitive data
```

---

## 13. Compliance Testing

### 13.1 GDPR Compliance

- [ ] Data minimization verified
- [ ] Consent mechanisms working
- [ ] Data deletion functionality tested
- [ ] Data portability working
- [ ] Right to be forgotten implemented
- [ ] Privacy policy accessible
- [ ] DPA in place

### 13.2 CCPA Compliance

- [ ] User access rights working
- [ ] Data deletion capability verified
- [ ] Opt-out mechanism tested
- [ ] Privacy notice provided
- [ ] Non-discrimination verified

### 13.3 HIPAA Compliance (if applicable)

- [ ] Encryption at rest
- [ ] Encryption in transit
- [ ] Access controls
- [ ] Audit logging
- [ ] BAA in place

---

## 14. Security Testing Checklist

### Pre-Deployment

- [ ] All SAST scans passed
- [ ] Dependency vulnerabilities resolved
- [ ] No secrets in codebase
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation verified
- [ ] Authentication working
- [ ] Authorization tested
- [ ] Encryption enabled
- [ ] Logging configured (no sensitive data)
- [ ] Error messages don't leak info
- [ ] Database hardened
- [ ] Backup encryption verified

### Staging Environment

- [ ] DAST scan completed
- [ ] API security tests passed
- [ ] Authentication tests passed
- [ ] Authorization tests passed
- [ ] Database security verified
- [ ] Network security verified
- [ ] Session management tested
- [ ] Manual penetration testing completed
- [ ] Performance under load tested
- [ ] Disaster recovery tested

### Production

- [ ] All previous checks passed
- [ ] Monitoring and alerting enabled
- [ ] Incident response plan ready
- [ ] Security team trained
- [ ] Legal review completed
- [ ] Insurance in place

---

## 15. Vulnerability Management

### 15.1 Severity Levels

| Severity | CVSS | Response Time | Examples |
|----------|------|---------------|----------|
| Critical | 9.0-10.0 | 1 day | RCE, auth bypass |
| High | 7.0-8.9 | 3 days | SQL injection |
| Medium | 4.0-6.9 | 1 week | XSS, CSRF |
| Low | 0.1-3.9 | 1 month | Info disclosure |

### 15.2 Remediation Process

1. **Identify:** Detect vulnerability through scans/reports
2. **Assess:** Evaluate impact and exploitability
3. **Plan:** Create remediation plan
4. **Develop:** Fix vulnerability with security review
5. **Test:** Verify fix doesn't break functionality
6. **Deploy:** Roll out fix to production
7. **Monitor:** Track for regression

---

## 16. Security Incident Response

### 16.1 Incident Response Plan

1. **Detection:** Monitor for suspicious activity
2. **Analysis:** Determine scope and impact
3. **Containment:** Stop the attack/breach
4. **Eradication:** Remove the threat
5. **Recovery:** Restore systems to normal
6. **Lessons Learned:** Document and improve

### 16.2 Contact Information

- **Security Team:** [security@wavemeet.com](mailto:security@wavemeet.com)
- **Emergency:** [emergency-security@wavemeet.com](mailto:emergency-security@wavemeet.com)
- **Report Security Issues:** [report@wavemeet.com](mailto:report@wavemeet.com)

---

## 17. References

### 17.1 Standards and Frameworks

- **OWASP Top 10:** https://owasp.org/Top10/
- **CWE Top 25:** https://cwe.mitre.org/top25/
- **NIST Cybersecurity Framework:** https://www.nist.gov/cyberframework
- **ISO 27001:** Information Security Management

### 17.2 Tools Documentation

- **Snyk:** https://docs.snyk.io/
- **OWASP ZAP:** https://www.zaproxy.org/
- **Trivy:** https://github.com/aquasecurity/trivy
- **Semgrep:** https://semgrep.dev/

---

**Document Version:** 1.0  
**Last Reviewed:** February 15, 2026  
**Next Review:** August 15, 2026  
**Owner:** Security Team
