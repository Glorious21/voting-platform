# Issue #1: Project Setup & Configuration

## 🎯 Objective
Set up the Node.js/Express project with TypeScript and understand the project structure.

## 📋 Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- Basic understanding of TypeScript
- Git configured

## 📚 Learning Goals
- Understand Node.js project structure
- Learn about environment variables
- Configure TypeScript for a backend project
- Set up a development workflow

## ✅ Tasks

### 1. Clone and Install Dependencies
```bash
cd voting-platform/backend
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit the file with your values
nano .env
```

**Required variables:**
- `DATABASE_URL`: Your PostgreSQL connection string
- `PACKAGE_ID`: The deployed smart contract ID (check `voting-platform/constants.ts`)

### 3. Understand the Configuration
Review `src/config.ts` and understand:
- How environment variables are loaded
- How default values work
- Type safety for configuration

### 4. Test the Setup
```bash
# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

**Expected output:** Server should start and show connection messages.

## 📖 Key Files to Understand
| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `.env.example` | Environment template |
| `src/config.ts` | Configuration module |

## 🔗 Resources
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [dotenv Package](https://www.npmjs.com/package/dotenv)

## ✨ Bonus Challenge
Add a new environment variable `LOG_LEVEL` with values `debug`, `info`, `warn`, `error` and use it in the logging.

---
**Estimated Time:** 30 minutes
**Difficulty:** ⭐ Easy
