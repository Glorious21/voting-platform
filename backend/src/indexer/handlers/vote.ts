/**
 * Vote Event Handler
 * 
 * This file handles EventVoteCast events.
 * Students will learn about:
 * - Processing vote events
 * - Database relationships (vote -> election, candidate, voter)
 * - Preventing double voting using database constraints
 */

import { SuiEvent } from '@mysten/sui/client';
import { prisma } from '../../db/index.js';
import { EventVoteCast } from '../../types/index.js';

/**
 * Handle EventVoteCast events
 * Called when a vote is cast in an election
 * 
 * @param events - An array of events fetched from the Sui blockchain
 */
export async function handleVoteCast(events: SuiEvent[]): Promise<void> {
  // -------------------------------------------------------------------------
  // STEP 1: Loop through all vote events
  // -------------------------------------------------------------------------
  for (const event of events) {

    // -----------------------------------------------------------------------
    // STEP 2: Extract the event data
    // -----------------------------------------------------------------------
    const data = event.parsedJson as EventVoteCast;

    console.log(
      `🗳️ Processing Vote | Election: ${data.election_id}, Voter: ${data.voter}`
    );

    // -----------------------------------------------------------------------
    // STEP 3: Save the vote safely using UPSERT
    // -----------------------------------------------------------------------
    // WHY UPSERT?
    // - Blockchain indexers can reprocess the same event
    // - A voter must only vote ONCE per election
    // - Prisma enforces this with @@unique([electionId, voterAddress])
    //
    // Behavior:
    // - If the vote already exists → do nothing
    // - If it does NOT exist → create it
    await prisma.vote.upsert({
      // Composite unique key: one vote per voter per election
      where: {
        electionId_voterAddress: {
          electionId: data.election_id,
          voterAddress: data.voter,
        },
      },

      // If the vote already exists, we do nothing
      update: {},

      // If it's a new vote, create it
      create: {
        electionId: data.election_id,
        voterAddress: data.voter,
        candidateAddress: data.candidate,

        // Store transaction digest for audit & debugging
        txDigest: event.id.txDigest,
      },
    });

    console.log(`✅ Vote processed for voter: ${data.voter}`);
  }
}
