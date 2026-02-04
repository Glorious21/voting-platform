# Issue #2: Database Schema with Prisma

## 🎯 Objective
Set up the PostgreSQL database using Prisma ORM and understand database schema design.

## 📋 Prerequisites
- Issue #1 completed
- PostgreSQL running locally
- Environment variables configured

## 📚 Learning Goals
- Understand Prisma ORM basics
- Learn database schema design
- Understand relationships between tables
- Run database migrations

## ✅ Tasks

### 1. Understand the Prisma Schema
Review `prisma/schema.prisma` and understand:
- Generators and datasources
- Model definitions
- Field types (`Int`, `String`, `DateTime`, etc.)
- Relations (`@relation`)
- Unique constraints (`@unique`, `@@unique`)
- Indexes and mapping (`@map`, `@@map`)

### 2. Create the Database
```bash
# Push the schema to your database
npm run db:push

# Verify tables were created
npm run db:studio
```

Prisma Studio should open in your browser showing all tables.

### 3. Understand the Schema Design

**Tables and their purpose:**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `elections` | Stores election data from EventElectionCreated | electionId, name, creator |
| `candidates` | Stores candidate registrations | electionId, candidateAddress |
| `voters` | Stores voter registrations | electionId, voterAddress |
| `votes` | Stores cast votes | electionId, voterAddress, candidateAddress |
| `election_results` | Stores final results | electionId, winner, totalVotes |
| `cursors` | Tracks indexer position | id, txDigest, eventSeq |

### 4. Explore Relationships
The schema has these relationships:
- Election → Candidates (one-to-many)
- Election → Voters (one-to-many)
- Election → Votes (one-to-many)
- Candidate → Votes (one-to-many)
- Voter → Votes (one-to-many)

### 5. Test the Database Connection
Review `src/db/index.ts` and understand:
- Prisma client initialization
- Singleton pattern
- Connection/disconnection functions

## 📖 Key Files to Understand
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema definition |
| `src/db/index.ts` | Prisma client setup |

## 🔗 Resources
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Database Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

## ✨ Bonus Challenge
Add a `createdBy` field to track which admin created each candidate/voter entry.

---
**Estimated Time:** 45 minutes
**Difficulty:** ⭐⭐ Medium
