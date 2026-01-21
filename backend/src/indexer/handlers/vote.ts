/**
 * Vote Event Handler
 * 
 * This file handles EventVoteCast events.
 * Students will learn about:
 * - Processing vote events
 * - Database relationships (vote -> election, candidate, voter)
 * 
 * TODO (Issue #5): Implement the event handler
 */

import { SuiEvent } from '@mysten/sui/client';
import { prisma } from '../../db/index.js';
import { EventVoteCast } from '../../types/index.js';

/**
 * Handle EventVoteCast events
 * Called when a vote is cast in an election
 */
export async function handleVoteCast(events: SuiEvent[]): Promise<void> {
  // TODO: Implement this handler
  // 1. Loop through events
  // 2. Parse event data
  // 3. Check for duplicates (prevent double counting is critical!)
  // 4. Create vote record

  for (const event of events) {
    // Your code here
  }
}
