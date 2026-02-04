# Issue #5: Event Handlers

## 🎯 Objective
Implement the event handlers that process blockchain events and store them in the database.

## 📋 Prerequisites
- Issues #1-4 completed
- Understanding of Prisma queries

## 📚 Learning Goals
- Parse blockchain event data
- Store data in PostgreSQL with Prisma
- Handle errors gracefully
- Implement idempotent operations

## ✅ Tasks

### 1. Implement `handleElectionCreated`
Located in `src/indexer/handlers/election.ts`.
**TODO:**
1. Loop through `events`.
2. Parse `event.parsedJson` as `EventElectionCreated`.
3. Check if election already exists in DB (`findUnique`).
4. If not, `create` it using data from the event.

### 2. Implement `handleCandidateRegistered`
Located in `src/indexer/handlers/candidate.ts`.
**TODO:**
1. Loop through `events`.
2. Parse as `EventCandidateRegistered`.
3. Check for duplicates (same election + same candidate address).
   - *Hint:* Use `@@unique` constraint logic in `findUnique`.
4. Create the candidate record.

### 3. Implement `handleVoterRegistered`
Located in `src/indexer/handlers/voter.ts`.
**TODO:**
1. Similar logic to candidate registration.
2. Use `EventVoterRegistered` type.

### 4. Implement `handleVoteCast`
Located in `src/indexer/handlers/vote.ts`.
**Critical:** Ensure you don't double count votes!
**TODO:**
1. Loop and parse `EventVoteCast`.
2. Check if vote exists (`findUnique` on election_voter compound key).
3. Only create if it doesn't exist.

### 5. Implement `handleElectionEnded`
Located in `src/indexer/handlers/election.ts`.
**TODO:**
1. Parse `EventElectionEnded`.
2. Create an `ElectionResult` record.
3. *Note:* You'll need to parse `total_votes` to an integer.

## 🧪 Testing Your Handlers
1. Start the backend: `npm run dev`
2. Create an election on the frontend (or via Sui CLI).
3. Watch the logs.
4. Verify data in Prisma Studio: `npm run db:studio`

## 📖 Key Files to Understand
| File | Purpose |
|------|---------|
| `src/indexer/handlers/*.ts` | The handler files |
| `src/types/index.ts` | Event type definitions |

## 🔗 Resources
- [Prisma CRUD Operations](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

## ✨ Bonus Challenge
1. Add an `EventLog` table that stores ALL raw events for debugging
2. Add timestamps from `event.timestampMs` instead of using `NOW()`

---
**Estimated Time:** 45 minutes
**Difficulty:** ⭐⭐ Medium
