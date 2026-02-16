# GITHUB ACTIONS CI/CD PIPELINE DOCUMENTATION

**Version:** 1.0  
**Last Updated:** February 15, 2026  
**Status:** Active

---

## 1. Overview

WaveMeet uses GitHub Actions for automated testing, building, security scanning, and deployment. This document provides comprehensive documentation for all CI/CD workflows.

---

## 2. Workflow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Push/PR Event                    │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Backend      │ │ Frontend     │ │ Mobile       │
    │ Tests        │ │ Tests        │ │ Tests        │
    └──────────────┘ └──────────────┘ └──────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Code Quality & Security│
              │     Analysis           │
              └────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   Build & Artifacts    │
              └────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Deploy to Staging     │
              │  (on merge/schedule)   │
              └────────────────────────┘
```

---

## 3. Workflow Configuration

### 3.1 Backend Tests Workflow

**File:** `.github/workflows/backend-tests.yml`

**Triggers:**
- Push to `main`, `develop` branches
- Pull requests to `main`, `develop` branches
- Paths: `backend/**`, `.github/workflows/backend-tests.yml`

**Jobs:**

1. **test**
   - Runtime: ubuntu-latest
   - Services: PostgreSQL, Redis
   - Steps:
     - Checkout code
     - Setup Node.js 18
     - Install dependencies
     - Run ESLint
     - Run tests
     - Upload coverage

2. **build**
   - Runs after: test (if passed)
   - Steps:
     - Build application
     - Build Docker image
     - Run Trivy security scan
     - Upload SARIF results

3. **security-scan**
   - Steps:
     - npm audit
     - Snyk scan

**Configuration:**
```yaml
# Environment-specific variables
env:
  NODE_VERSION: '18'
  DB_HOST: localhost
  REDIS_HOST: localhost
```

### 3.2 Frontend Tests Workflow

**File:** `.github/workflows/frontend-tests.yml`

**Triggers:**
- Push to `main`, `develop` branches
- Pull requests to `main`, `develop` branches
- Paths: `frontend/**`

**Jobs:**

1. **test**
   - ESLint checks
   - Jest unit tests

2. **build**
   - Build production bundle
   - Upload artifacts

3. **security-scan**
   - npm audit
   - OWASP dependency check

### 3.3 iOS Build Workflow

**File:** `.github/workflows/ios-build.yml`

**Triggers:**
- Push to `ios-app`, `main` branches
- Pull requests to `ios-app`, `main` branches
- Paths: `ios/**`

**Jobs:**

1. **test**
   - ESLint validation
   - TypeScript type checking

2. **build**
   - macOS latest
   - Install pods
   - Build React Native
   - Security scan

3. **security-scan**
   - OWASP dependency check

### 3.4 Android Build Workflow

**File:** `.github/workflows/android-build.yml`

**Triggers:**
- Push to `android-app`, `main` branches
- Pull requests to `android-app`, `main` branches
- Paths: `android/**`

**Jobs:**

1. **test**
   - ESLint validation
   - TypeScript type checking

2. **build**
   - Java 11 setup
   - Android SDK setup
   - Build React Native
   - Security scan

3. **security-scan**
   - OWASP dependency check

4. **code-quality**
   - SonarCloud scan

### 3.5 Code Quality & Security Workflow

**File:** `.github/workflows/code-quality.yml`

**Triggers:**
- Push to main/develop/feature branches
- Pull requests
- Weekly schedule (Sundays at 00:00 UTC)

**Jobs:**

1. **codeql**
   - Languages: JavaScript, TypeScript
   - Advanced security scanning

2. **semgrep**
   - Pattern-based vulnerability detection
   - SAST for security patterns

3. **sonarcloud**
   - Code quality metrics
   - Technical debt analysis
   - Security hotspots

4. **container-scan**
   - Trivy image scanning
   - Container vulnerability detection

5. **dependency-check**
   - OWASP Dependency-Check
   - Known vulnerability detection

6. **secret-scan**
   - TruffleHog secrets detection
   - Gitleaks scanning

7. **license-check**
   - License compliance validation
   - Deprecated license detection

### 3.6 Deployment Workflow

**File:** `.github/workflows/deploy-staging.yml`

**Triggers:**
- Push to `develop` branch
- Pull requests merged to `main`

**Jobs:**

1. **deploy-backend**
   - Build backend
   - Deploy to staging
   - Health checks

2. **deploy-frontend**
   - Build SPA bundle
   - Deploy to CDN/hosting

3. **test-staging**
   - Smoke tests
   - Integration tests
   - Slack notifications

---

## 4. Environment Variables and Secrets

### 4.1 GitHub Secrets Configuration

Required secrets in GitHub repository settings:

```
SNYK_TOKEN              - Snyk authentication token
SONARCLOUD_TOKEN        - SonarCloud analysis token
SLACK_WEBHOOK           - Slack notifications
AWS_ACCESS_KEY_ID       - AWS credentials
AWS_SECRET_ACCESS_KEY   - AWS credentials
STAGING_DEPLOY_KEY      - SSH key for staging
DATABASE_URL            - Staging database URL
```

### 4.2 Setting Up Secrets

```bash
# Using GitHub CLI
gh secret set SNYK_TOKEN --body "your_token"
gh secret set SONARCLOUD_TOKEN --body "your_token"
gh secret set SLACK_WEBHOOK --body "https://hooks.slack.com/..."
```

### 4.3 Environment File

Create `.env.example` for repository:

```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/wavemeet
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key_here
API_PORT=5001
NODE_ENV=development

# Firebase (for push notifications)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# File uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800

# Frontend
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_SOCKET_URL=http://localhost:8000

# Mobile apps
REACT_NATIVE_API_URL=https://api.wavemeet.com/api
REACT_NATIVE_SOCKET_URL=https://ws.wavemeet.com
```

---

## 5. Workflow Status and Monitoring

### 5.1 Status Badges

Add to README.md:

```markdown
# WaveMeet

![Backend Tests](https://github.com/rakeshkoripella/WaveMeet/workflows/Backend%20Tests%20&%20Build/badge.svg)
![Frontend Tests](https://github.com/rakeshkoripella/WaveMeet/workflows/Frontend%20Tests%20&%20Build/badge.svg)
![iOS Build](https://github.com/rakeshkoripella/WaveMeet/workflows/iOS%20App%20Build%20&%20Test/badge.svg)
![Android Build](https://github.com/rakeshkoripella/WaveMeet/workflows/Android%20App%20Build%20&%20Test/badge.svg)
![Code Quality](https://github.com/rakeshkoripella/WaveMeet/workflows/Code%20Quality%20&%20Security%20Analysis/badge.svg)
```

### 5.2 Monitoring Workflow Runs

View workflow status:
- GitHub Actions tab in repository
- Action history and logs
- Branch protection rules verification

### 5.3 Notifications

**Slack Notifications:**
- Workflow failures
- Security findings
- Deployment status
- Test coverage changes

---

## 6. Branch Protection Rules

### 6.1 Main Branch Protection

```yaml
# Requires:
- Passing status checks (all workflows)
- Pull request reviews (2 reviewers minimum)
- Dismissal of stale reviews
- Require branches to be up to date
- Require code quality checks
```

### 6.2 Develop Branch Protection

```yaml
# Requires:
- Passing status checks
- 1 pull request review
- Up-to-date branches
```

### 6.3 Feature Branch Rules

```yaml
# Recommended:
- Clear naming: feature/*, fix/*, docs/*
- Require pull requests before merge
- Automatic branch deletion on merge
```

---

## 7. Artifact Management

### 7.1 Build Artifacts

**Frontend artifacts:**
- Location: `frontend/dist/`
- Retention: 5 days
- Size: ~2-5 MB

**iOS build artifacts:**
- Location: `ios/build/`
- Retention: 7 days

**Android build artifacts:**
- Location: `android/build/`
- Retention: 7 days

### 7.2 Downloading Artifacts

```bash
# Using GitHub CLI
gh run download <run-id> -n frontend-build

# Manual download from Actions tab
# Select workflow → Run → Download artifact
```

---

## 8. Security Scanning Details

### 8.1 CodeQL Analysis

**Configuration:**
- Language: JavaScript, TypeScript
- Queries: Default security & quality queries
- Results: Viewable in Security tab

**Running Locally:**
```bash
# Download CodeQL
curl https://github.com/github/codeql-action/releases/download/codeql-bundle-20240115/codeql-bundle-linux64.zip -O

# Initialize database
./codeql database create wavemeet-db --language=javascript

# Run queries
./codeql database analyze wavemeet-db \
  codeql/javascript-queries:codeql/javascript-security-and-quality.qls \
  --format=sarif-latest --output=results.sarif
```

### 8.2 Semgrep Scanning

**Configuration:**
- Rules: OWASP, React, Node.js specific
- Severity: Error on high/critical
- Format: SARIF upload to GitHub

**Running Locally:**
```bash
# Install semgrep
brew install semgrep  # macOS
sudo apt install semgrep  # Linux

# Run scan
semgrep --config=p/owasp-top-ten --config=p/nodejs --json > results.json
```

### 8.3 Trivy Container Scanning

**Configuration:**
- Scan type: Image
- Severity: CRITICAL, HIGH
- Format: SARIF upload

**Running Locally:**
```bash
# Install Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh

# Scan image
trivy image wavemeet-backend:latest --format sarif --output results.sarif
```

---

## 9. Performance Metrics

### 9.1 Build Times

Expected workflow execution times:

| Workflow | Time |
|----------|------|
| Backend tests | 3-5 min |
| Frontend tests | 2-3 min |
| iOS build | 15-20 min |
| Android build | 10-15 min |
| Code quality | 5-10 min |
| Security scans | 10-15 min |

### 9.2 Optimization Tips

```yaml
# Cache dependencies
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# Parallel job execution
strategy:
  matrix:
    node-version: [16, 18, 20]
  max-parallel: 3
```

---

## 10. Troubleshooting

### 10.1 Common Issues

**Issue:** Cache miss on every run
```bash
# Solution: Ensure package-lock.json is committed
git add package-lock.json
git commit -m "Update package lock"
```

**Issue:** Node version conflicts
```yaml
# Solution: Specify exact version
- uses: actions/setup-node@v4
  with:
    node-version: '18.0.0'
    cache: 'npm'
```

**Issue:** Service timeouts
```yaml
# Solution: Increase wait time
services:
  postgres:
    options: >-
      --health-cmd pg_isready
      --health-interval 5s
      --health-timeout 10s
      --health-retries 10
```

### 10.2 Debugging

**View workflow logs:**
```bash
# Download logs
gh run download <run-id>

# View in real-time
gh run watch <run-id>
```

---

## 11. Cost Optimization

### 11.1 Action Limits

- Free tier: 2,000 minutes/month
- Optimization: Disable unnecessary scans on PRs
- Caching: Save ~30% build time

### 11.2 Cost Reduction Strategies

1. Run expensive scans only on main branch
2. Cache Docker layers
3. Use matrix strategy efficiently
4. Disable workflows for documentation changes

```yaml
# Skip workflows for docs
- name: Check if docs only
  if: |
    contains(fromJson('["README.md", "PRIVACY_POLICY.md"]'), github.event.head_commit.modified[0])
  run: exit 0
```

---

## 12. Compliance and Auditing

### 12.1 Audit Logging

All workflow runs are audited:
- Run timestamp
- Triggering event
- Actor/user
- Changes applied
- Results

### 12.2 Compliance Reports

Generate reports:
```bash
# Weekly security report
gh api repos/rakeshkoripella/WaveMeet/actions/runs \
  --paginate \
  -q '.workflow_runs[] | .conclusion' > security_report.json
```

---

## 13. Future Enhancements

### 13.1 Planned Improvements

- [ ] Add load testing to CI/CD
- [ ] Implement Blue-Green deployment
- [ ] Add performance benchmarking
- [ ] Create deployment approval workflow
- [ ] Add automated rollback on failure
- [ ] Implement canary deployments

### 13.2 Integration Opportunities

- [ ] Slack status updates
- [ ] Email notifications on failures
- [ ] JIRA issue creation for failures
- [ ] Grafana monitoring integration
- [ ] DataDog APM integration

---

**Document Version:** 1.0  
**Last Updated:** February 15, 2026  
**Next Review:** August 15, 2026  
**Owner:** DevOps/CI-CD Team
