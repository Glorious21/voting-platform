# Issue #6: REST API Endpoints

## 🎯 Objective
Understand and test the REST API endpoints that serve data to the frontend.

## 📋 Prerequisites
- Issues #1-5 completed
- Understanding of RESTful APIs

## 📚 Learning Goals
- Build RESTful API endpoints
- Query database with Prisma
- Return JSON responses
- Handle errors in APIs

## ✅ Tasks

### 1. Understand Express Routing
Review the route structure in `src/routes/`:

```
routes/
├── index.ts          # Combines all routes
├── health.ts         # Health check
└── elections.ts      # Election CRUD operations
```

### 2. Understand the Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/health` | Health check | `{ status: "healthy" }` |
| GET | `/api/elections` | List all elections | Array of elections |
| GET | `/api/elections/:id` | Get one election | Election details |
| GET | `/api/elections/:id/candidates` | Get candidates | Array with vote counts |
| GET | `/api/elections/:id/voters` | Get voters | Array with vote status |
| GET | `/api/elections/:id/votes` | Get votes | Vote history |
| GET | `/api/elections/:id/results` | Get results | Results with percentages |

### 3. Test the API

Start the server:
```bash
npm run dev
```

Test with curl:
```bash
# Health check
curl http://localhost:3001/api/health

# List elections
curl http://localhost:3001/api/elections

# Get specific election
curl http://localhost:3001/api/elections/{electionId}

# Get results
curl http://localhost:3001/api/elections/{electionId}/results
```

Or use a tool like Postman or Thunder Client.

### 4. Understand Prisma Queries
Review how Prisma is used in `src/routes/elections.ts`:

```typescript
// Include related data
const elections = await prisma.election.findMany({
  include: {
    _count: {
      select: { candidates: true, voters: true, votes: true },
    },
  },
});

// Find with unique constraint
const election = await prisma.election.findUnique({
  where: { electionId },
});

// Count related records
const totalVotes = await prisma.vote.count({
  where: { electionId },
});
```

### 5. Understand Response Transformation
Raw database data → Clean API response:

```typescript
// Transform for API
const response = elections.map((election) => ({
  id: election.id,
  electionId: election.electionId,
  name: election.name,
  candidateCount: election._count.candidates,  // Computed value
  hasEnded: !!election.result,                 // Boolean conversion
}));
```

### 6. Test Error Handling
Try accessing a non-existent election:
```bash
curl http://localhost:3001/api/elections/nonexistent
# Should return 404 with error message
```

## 📖 Key Files to Understand
| File | Purpose |
|------|---------|
| `src/routes/index.ts` | Route aggregator |
| `src/routes/elections.ts` | Election endpoints |
| `src/routes/health.ts` | Health check |
| `src/index.ts` | Express app setup |

## 🔗 Resources
- [Express Routing](https://expressjs.com/en/guide/routing.html)
- [Prisma Queries](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [RESTful API Design](https://restfulapi.net/)

## ✨ Bonus Challenge
1. Add pagination to `/api/elections` with `?page=1&limit=10`
2. Add search by election name with `?search=myElection`
3. Add a POST endpoint that accepts election IDs and returns bulk data

---
**Estimated Time:** 1 hour
**Difficulty:** ⭐⭐ Medium
