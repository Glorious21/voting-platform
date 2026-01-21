# Issue #4: Event Indexer (Polling Loop)

## 🎯 Objective
Implement the event indexer that polls the Sui blockchain for new events.

## 📋 Prerequisites
- Issues #1, #2, and #3 completed
- Understanding of blockchain events

## 📚 Learning Goals
- Understand polling patterns
- Learn about cursor-based pagination
- Handle continuous background processing
- Implement idempotent operations

## ✅ Tasks

### 1. Understand the Indexer Architecture
Review `src/indexer/event-indexer.ts`. Key parts are already set up:
- `EVENTS_TO_TRACK` array
- Cursor management
- `setupEventListeners` function

### 2. Implement `executeEventJob`
This function is responsible for a single polling action.
**TODO:**
1. Log that polling is starting for the tracker type.
2. Query events using `client.queryEvents`:
   - Use `tracker.filter`
   - Use the provided `cursor`
   - Set order to `'ascending'`
3. If `data.length > 0`:
   - Log the count
   - Call `await tracker.callback(data)` to process them
   - If `nextCursor` exists, call `saveLatestCursor`
   - Return `{ cursor: nextCursor, hasNextPage }`
4. Handle errors with try/catch

**Hint:**
```typescript
const { data, hasNextPage, nextCursor } = await client.queryEvents({
  query: tracker.filter,
  cursor,
  order: 'ascending',
});
```

### 3. Implement `runEventJob`
This function creates the infinite polling loop.
**TODO:**
1. Call `await executeEventJob(...)`
2. Schedule the next run using `setTimeout`:
   - If `result.hasNextPage` is true, schedule immediately (`0` ms) to catch up.
   - Otherwise, use `CONFIG.POLLING_INTERVAL_MS`.

**Hint:**
```typescript
setTimeout(
  () => runEventJob(client, tracker, result.cursor),
  delay
);
```

### 4. Run and Verify
```bash
npm run indexer
```
You should see logs indicating it is polling (even if no events are found yet).

## 📖 Key Files to Understand
| File | Purpose |
|------|---------|
| `src/indexer/event-indexer.ts` | Main indexer logic |
| `prisma/schema.prisma` | Cursor table definition |

## 🔗 Resources
- [Sui queryEvents API](https://docs.sui.io/references/sui-api/sui-api-reference#suix_queryevents)

## ✨ Bonus Challenge
1. Add a "catch-up mode" that processes all historical events faster on first run
2. Add metrics to track events per second

---
**Estimated Time:** 1 hour
**Difficulty:** ⭐⭐⭐ Medium-Hard
