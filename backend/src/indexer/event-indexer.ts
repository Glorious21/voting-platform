/**
 * Event Indexer
 * 
 * This is the main indexer that polls the Sui blockchain for events
 * and processes them using the appropriate handlers.
 * 
 * Students will learn about:
 * - Polling patterns
 * - Event filtering
 * - Cursor-based pagination
 * - Continuous background processing
 * 
 * TODO (Issue #4): Complete the event indexer implementation
 */

import { SuiClient, SuiEvent, SuiEventFilter, EventId } from '@mysten/sui/client';
import { CONFIG } from '../config.js';
import { prisma } from '../db/index.js';
import { getSuiClient, PACKAGE_ID, MODULE_NAME } from '../sui/client.js';
import { handleElectionCreated, handleElectionEnded } from './handlers/election.js';
import { handleCandidateRegistered } from './handlers/candidate.js';
import { handleVoterRegistered } from './handlers/voter.js';
import { handleVoteCast } from './handlers/vote.js';

// Type for cursor
type SuiEventsCursor = EventId | null | undefined;

// Type for tracking results
type EventExecutionResult = {
    cursor: SuiEventsCursor;
    hasNextPage: boolean;
};

// Type for event trackers
type EventTracker = {
    type: string;                                           // Unique identifier for this tracker
    filter: SuiEventFilter;                                 // Filter to query events
    callback: (events: SuiEvent[]) => Promise<void>;        // Handler function
};

/**
 * Define all events we want to track
 * Each event type has its own filter and handler
 */
const EVENTS_TO_TRACK: EventTracker[] = [
    {
        type: 'EventElectionCreated',
        filter: {
            MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::EventElectionCreated`,
        },
        callback: handleElectionCreated,
    },
    {
        type: 'EventCandidateRegistered',
        filter: {
            MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::EventCandidateRegistered`,
        },
        callback: handleCandidateRegistered,
    },
    {
        type: 'EventVoterRegistered',
        filter: {
            MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::EventVoterRegistered`,
        },
        callback: handleVoterRegistered,
    },
    {
        type: 'EventVoteCast',
        filter: {
            MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::EventVoteCast`,
        },
        callback: handleVoteCast,
    },
    {
        type: 'EventElectionEnded',
        filter: {
            MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::EventElectionEnded`,
        },
        callback: handleElectionEnded,
    },
];

/**
 * Execute a single event polling job
 * Fetches events from Sui and processes them
 */
async function executeEventJob(
    client: SuiClient,
    tracker: EventTracker,
    cursor: SuiEventsCursor,
): Promise<EventExecutionResult> {
    // TODO: Implement this function
    // 1. Log that we are polling
    // 2. Query events using client.queryEvents
    // 3. If new events found:
    //    - Log count
    //    - Call tracker.callback(data)
    //    - Save nextCursor if present
    //    - Return new cursor and hasNextPage
    // 4. If error, log it

    // Placeholder return
    return {
        cursor,
        hasNextPage: false,
    };
}

/**
 * Run the event polling job in a loop
 * Uses setTimeout to prevent blocking
 */
async function runEventJob(
    client: SuiClient,
    tracker: EventTracker,
    cursor: SuiEventsCursor,
): Promise<void> {
    // TODO: Implement this function
    // 1. Call executeEventJob
    // 2. Schedule next run using setTimeout
    //    - If hasNextPage is true, use 0 delay (catch up)
    //    - Otherwise use CONFIG.POLLING_INTERVAL_MS
}

/**
 * Get the last saved cursor from database
 * This allows resuming from where we left off
 */
async function getLatestCursor(tracker: EventTracker): Promise<SuiEventsCursor> {
    const cursor = await prisma.cursor.findUnique({
        where: { id: tracker.type },
    });

    if (cursor) {
        return {
            txDigest: cursor.txDigest,
            eventSeq: cursor.eventSeq,
        };
    }

    return undefined;
}

/**
 * Save the cursor position to database
 * This allows resuming from where we left off after restart
 */
async function saveLatestCursor(tracker: EventTracker, cursor: EventId): Promise<void> {
    await prisma.cursor.upsert({
        where: { id: tracker.type },
        update: {
            txDigest: cursor.txDigest,
            eventSeq: cursor.eventSeq,
        },
        create: {
            id: tracker.type,
            txDigest: cursor.txDigest,
            eventSeq: cursor.eventSeq,
        },
    });
}

/**
 * Start all event listeners
 * Called when the indexer starts
 */
export async function setupEventListeners(): Promise<void> {
    console.log('\n🚀 Starting Event Indexer...');
    console.log(`📦 Package ID: ${PACKAGE_ID}`);
    console.log(`⏱️ Polling Interval: ${CONFIG.POLLING_INTERVAL_MS}ms`);
    console.log(`🔗 Network: ${CONFIG.SUI_NETWORK}`);
    console.log('');

    const client = getSuiClient();

    // Start a polling loop for each event type
    for (const tracker of EVENTS_TO_TRACK) {
        const cursor = await getLatestCursor(tracker);
        console.log(`📡 Starting listener for ${tracker.type}`);

        // Start the polling loop (non-blocking)
        runEventJob(client, tracker, cursor);
    }

    console.log('\n✅ All event listeners started!');
}

// Allow running the indexer standalone
// Run with: npm run indexer
if (process.argv[1].includes('event-indexer')) {
    import('../db/index.js').then(({ connectDatabase }) => {
        connectDatabase().then(() => {
            setupEventListeners();
        });
    });
}
