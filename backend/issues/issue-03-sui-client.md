# Issue #3: Sui Blockchain Client

## 🎯 Objective
Set up the connection to the Sui blockchain and understand how to interact with it.

## 📋 Prerequisites
- Issues #1 and #2 completed
- Understanding of what the smart contract does

## 📚 Learning Goals
- Understand RPC clients
- Learn about Sui networks (testnet, mainnet, devnet)
- Understand event types on Sui
- Query blockchain data

## ✅ Tasks

### 1. Understand the Sui Client Setup
Review `src/sui/client.ts` and understand:
- How `SuiClient` connects to the network
- Singleton pattern for client reuse
- Helper functions for event types

### 2. Understand Event Types
The smart contract emits these events:
```typescript
// When election is created
EventElectionCreated { election_id, name, creator }

// When candidate is registered
EventCandidateRegistered { election_id, candidate }

// When voter is registered
EventVoterRegistered { election_id, voter }

// When vote is cast
EventVoteCast { election_id, voter, candidate }

// When election ends
EventElectionEnded { election_id, winner, total_votes }
```

### 3. Review Type Definitions
Check `src/types/index.ts` to see how events are typed in TypeScript.

### 4. Test Sui Connection
Create a simple test script to verify connection:

```typescript
// Create file: src/test-sui.ts
import { getSuiClient, PACKAGE_ID } from './sui/client.js';

async function testConnection() {
  const client = getSuiClient();
  
  // Get network info
  const chain = await client.getChainIdentifier();
  console.log('Connected to:', chain);
  
  // Try to query events
  const events = await client.queryEvents({
    query: {
      MoveModule: {
        package: PACKAGE_ID,
        module: 'vote',
      },
    },
    limit: 5,
  });
  
  console.log('Found events:', events.data.length);
  events.data.forEach(e => {
    console.log('Event type:', e.type);
    console.log('Data:', e.parsedJson);
  });
}

testConnection();
```

Run with: `npx tsx src/test-sui.ts`

### 5. Understand the Full Event Type Path
The full event type format is:
```
{PACKAGE_ID}::{MODULE_NAME}::{EVENT_NAME}
```
Example:
```
0x5b430b046ff910bbfc634dd1de31601ecd8846b9e8a8fa3e31dfbda681c44d28::vote::EventElectionCreated
```

## 📖 Key Files to Understand
| File | Purpose |
|------|---------|
| `src/sui/client.ts` | Sui RPC client setup |
| `src/types/index.ts` | Event type definitions |
| `src/config.ts` | Network configuration |

## 🔗 Resources
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [Sui RPC Methods](https://docs.sui.io/references/sui-api)
- [Sui Events Documentation](https://docs.sui.io/guides/developer/sui-101/using-events)

## ✨ Bonus Challenge
Write a function that reads the current state of an election directly from the blockchain using `client.getObject()`.

---
**Estimated Time:** 45 minutes
**Difficulty:** ⭐⭐ Medium
