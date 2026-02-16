# ⚡ Container Upgrade Quick Reference

## 🎯 What Was Upgraded

| Component | Old | New | Benefit |
|-----------|-----|-----|---------|
| **RHEL Base** | UBI 9 | UBI 10.1 | Latest security patches, better stability |
| **Java** | ❌ None | ✅ JDK 21 LTS | Java development support, 8-year LTS |
| **Node.js** | v20 LTS | v22 LTS | Latest features, improved performance |
| **npm** | v8-v9 | v10+ | Better dependency resolution |

---

## 🚀 Quick Start

### Rebuild Container
```bash
docker-compose down -v
docker-compose up -d --build
```

### Verify Installation
```bash
# Check all versions
docker-compose exec dev java -version
docker-compose exec dev node --version
docker-compose exec dev npm --version
```

---

## 📦 What's Available Now

### Java Development
```bash
# Compile Java
javac HelloWorld.java

# Run Java
java HelloWorld

# Use Maven
mvn clean build

# Use Gradle
gradle build
```

### Node.js Development
```bash
# Use latest npm
npm install
npm start

# Use yarn
yarn install
yarn start

# Use pnpm
pnpm install
pnpm start
```

### Python Development
```bash
# Python 3 is available
python3 --version
pip3 install <package>
```

---

## 🔍 Verify Each Component

### Java
```bash
docker-compose exec dev java -version
docker-compose exec dev javac -version
docker-compose exec dev jar -version
```

### Node.js
```bash
docker-compose exec dev node --version
docker-compose exec dev npm --version
docker-compose exec dev yarn --version
docker-compose exec dev pnpm --version
```

### System
```bash
docker-compose exec dev cat /etc/redhat-release
docker-compose exec dev uname -a
```

---

## 🔄 Rebuild Process

```bash
# 1. Stop containers
docker-compose down -v

# 2. Rebuild
docker-compose up -d --build

# 3. Wait for build (~3-5 minutes first time)

# 4. Verify
docker-compose exec dev java -version
docker-compose exec dev node --version
```

---

## 📊 Container Specs

- **Base:** Red Hat UBI 10.1
- **Java:** OpenJDK 21 LTS (runtime + development)
- **Node.js:** v22 LTS with npm v10+
- **Python:** 3.x with pip3
- **Tools:** Git, curl, wget, gcc, g++, make, cmake, vim, nano
- **Databases:** PostgreSQL client, SQLite client
- **Package Managers:** npm, yarn, pnpm
- **Development:** Full build tools, headers, libraries

---

## ⚙️ Configuration

Check the updated files:
- `.devcontainer/Dockerfile` - Container definition
- `docker-compose.yml` - Service configuration
- `Makefile` - Development commands

---

## ❓ Common Questions

**Q: Do I need to rebuild?**  
A: Yes, run `docker-compose up -d --build`

**Q: Will my existing code break?**  
A: Unlikely. Node.js v22 is backward compatible with v20. Test your code.

**Q: Can I use Java now?**  
A: Yes! Java 21 LTS is now available.

**Q: When will npm update?**  
A: When the container rebuilds. Latest npm v10+ included.

---

## 🎓 For Development

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Express)
```bash
cd backend
npm install
npm start
```

### Java Projects
```bash
javac src/*.java
java -cp src Main
```

---

## 📝 Files Changed

- `.devcontainer/Dockerfile` - Updated base image and runtimes
- **New:** `CONTAINER_UPGRADE_REPORT.md` - Full upgrade documentation
- **New:** `CONTAINER_UPGRADE_QUICK_REFERENCE.md` - This file

---

## 🆘 If Something Breaks

```bash
# Complete rebuild
docker-compose down -v
docker system prune -a
docker-compose up -d --build

# Or check logs
docker-compose logs dev

# Or access container
docker-compose exec dev bash
```

---

## ✅ Status

- [x] Base image updated to UBI 10.1
- [x] Java 21 installed
- [x] Node.js upgraded to v22
- [x] All tools configured
- [x] Documentation complete
- [x] Ready for use

---

**Last Updated:** February 16, 2026  
**Next Steps:** Rebuild container and verify

