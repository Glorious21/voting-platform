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
 * 
 * @param events - An array of events fetched from the Sui blockchain
 */
export async function handleCandidateRegistered(events: SuiEvent[]): Promise<void> {
    // -------------------------------------------------------------------------
    // STEP 1: Loop through the events
    // -------------------------------------------------------------------------
    // The blockchain can emit many events at once. We receive them as an array (list).
    // We use a 'for...of' loop to process each event one by one.
    for (const event of events) {
        
        // ---------------------------------------------------------------------
        // STEP 2: Extract the data
        // ---------------------------------------------------------------------
        // The 'event' object contains a lot of metadata (like transaction ID, timestamp).
        // The actual data we care about (election_id, candidate address) is inside 'parsedJson'.
        //
        // We use 'as EventCandidateRegistered' to tell TypeScript: 
        // "Trust me, this JSON looks like a Candidate Registered event."
        // This gives us autocomplete for 'data.election_id' and 'data.candidate'.
        const data = event.parsedJson as EventCandidateRegistered;

        // Log what we're doing so we can see it in the terminal
        console.log(`📝 Processing Candidate: ${data.candidate} for Election: ${data.election_id}`);

        // ---------------------------------------------------------------------
        // STEP 3: Save to the Database (Safely!)
        // ---------------------------------------------------------------------
        // We use a special function called 'upsert' (Update + Insert).
        // 
        // WHY? 
        // In distributed systems, it's possible for an event to be processed twice 
        // (e.g., if the server restarts). If we just used 'create', the second time 
        // would cause a crash because the candidate already exists.
        // 
        // 'upsert' handles this gracefully:
        // - IF the candidate exists: Do nothing (or update fields if we wanted to).
        // - IF the candidate is new: Create it.
        await prisma.candidate.upsert({
            // 1. Check if this specific candidate is already in this specific election
            // We use the composite unique key defined in schema.prisma (@@unique([electionId, candidateAddress]))
            where: {
                electionId_candidateAddress: {
                    electionId: data.election_id,
                    candidateAddress: data.candidate
                }
            },
            
            // 2. If found, do nothing (empty object) because the data hasn't changed
            update: {},
            
            // 3. If NOT found, create a new record
            create: {
                electionId: data.election_id,     // Map the event field 'election_id' to our DB column 'electionId'
                candidateAddress: data.candidate, // Map the event field 'candidate' to our DB column 'candidateAddress'
                
                // We also save the 'txDigest' (Transaction Digest/Hash).
                // This is like a receipt ID for the blockchain transaction.
                // It helps us find the transaction on a block explorer later.
                txDigest: event.id.txDigest
            }
        });
        
        // The 'await' keyword means "wait for the database to finish saving before moving to the next event".
    }
}
