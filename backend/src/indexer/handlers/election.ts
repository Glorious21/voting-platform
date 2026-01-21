/**
 * Election Event Handler
 * 
 * This file handles EventElectionCreated and EventElectionEnded events.
 * Students will learn about:
 * - Parsing blockchain event data
 * - Storing data in the database
 * - Error handling
 * 
 * TODO (Issue #5): Implement the event handlers
 */

import { SuiEvent } from '@mysten/sui/client';
import { prisma } from '../../db/index.js';
import { EventElectionCreated, EventElectionEnded } from '../../types/index.js';

/**
 * Handle EventElectionCreated events
 * Called when a new election is created on-chain
 */
export async function handleElectionCreated(events: SuiEvent[]): Promise<void> {
    // TODO: Implement this handler
    // 1. Loop through events
    // 2. Parse data
    // 3. Check duplicates
    // 4. Create election record

    for (const event of events) {
        // Your code here
    }
}

/**
 * Handle EventElectionEnded events
 * Called when an election is concluded on-chain
 */
export async function handleElectionEnded(events: SuiEvent[]): Promise<void> {
    // TODO: Implement this handler
    // 1. Loop through events
    // 2. Parse data
    // 3. Check duplicates
    // 4. Create election result record

    for (const event of events) {
        // Your code here
    }
}
