# Voting Platform Backend

Backend API for the Sui Move Voting Platform. This project is designed for learning backend development with Express.js, TypeScript, Prisma, and blockchain event indexing.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── index.ts                 # Express app entry point
│   ├── config.ts                # Environment configuration
│   ├── db/
│   │   └── index.ts             # Prisma database client
│   ├── indexer/
│   │   ├── event-indexer.ts     # Polls Sui for events
│   │   └── handlers/
│   │       ├── election.ts      # Handle election events
│   │       ├── candidate.ts     # Handle candidate events
│   │       ├── voter.ts         # Handle voter events
│   │       └── vote.ts          # Handle vote events
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── elections.ts         # Election endpoints
│   │   └── health.ts            # Health check endpoint
│   ├── sui/
│   │   └── client.ts            # Sui RPC client setup
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── prisma/
│   └── schema.prisma            # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database URL and package ID
nano .env

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/elections` | List all elections |
| GET | `/api/elections/:id` | Get election details |
| GET | `/api/elections/:id/candidates` | Get candidates |
| GET | `/api/elections/:id/voters` | Get voters |
| GET | `/api/elections/:id/votes` | Get vote history |
| GET | `/api/elections/:id/results` | Get results |

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run indexer` | Run indexer standalone |

## 📚 Learning Path (Issues)

This project is split into 6 issues for students:

1. **Issue #1: Project Setup** - Initialize and configure the project
2. **Issue #2: Database Schema** - Set up Prisma and tables
3. **Issue #3: Sui Client** - Connect to Sui blockchain
4. **Issue #4: Event Indexer** - Build the polling loop
5. **Issue #5: Event Handlers** - Process different events
6. **Issue #6: REST API** - Create API endpoints

## 🔗 Related

- [Smart Contract](/vote) - Sui Move voting contract
- [Frontend](/frontend) - React frontend (coming soon)
