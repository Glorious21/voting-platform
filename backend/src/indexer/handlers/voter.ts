/**
 * Voter Event Handler
 * 
 * This file handles EventVoterRegistered events.
 * Students will learn about:
 * - Processing voter registration events
 * - Database relationships (voter -> election)
 * 
 * TODO (Issue #5): Implement the event handler
 */

import { SuiEvent } from '@mysten/sui/client';
import { prisma } from '../../db/index.js';
import { EventVoterRegistered } from '../../types/index.js';

/**
 * Handle EventVoterRegistered events
 * Called when a voter is registered for an election
 */
export async function handleVoterRegistered(events: SuiEvent[]): Promise<void> {
    // TODO: Implement this handler
    // 1. Loop through events
    // 2. Parse event data
    // 3. Check for duplicates
    // 4. Create voter record

    for (const event of events) {
        // Your code here
    }
}
