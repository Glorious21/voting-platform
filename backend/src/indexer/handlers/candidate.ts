/**
 * Candidate Event Handler
 * 
 * This file handles EventCandidateRegistered events.
 * Students will learn about:
 * - Processing candidate registration events
 * - Database relationships (candidate -> election)
 * 
 * TODO (Issue #5): Implement the event handler
 */

import { SuiEvent } from '@mysten/sui/client';
import { prisma } from '../../db/index.js';
import { EventCandidateRegistered } from '../../types/index.js';

/**
 * Handle EventCandidateRegistered events
 * Called when a candidate is registered for an election
 */
export async function handleCandidateRegistered(events: SuiEvent[]): Promise<void> {
    // TODO: Implement this handler
    // 1. Loop through events
    // 2. Parse event data (event.parsedJson as EventCandidateRegistered)
    // 3. Check for duplicates in DB (idempotency)
    // 4. Create candidate record in DB

    for (const event of events) {
        // Your code here
        /*
        const data = event.parsedJson as EventCandidateRegistered;
        console.log(`Processing Candidate: ${data.candidate}`);
        */
    }
}
