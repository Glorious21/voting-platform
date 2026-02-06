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
  for (const event of events) {
    try {
      // parsedJson may be missing
      if (!event.parsedJson) {
        console.warn('Skipping event: parsedJson is missing', event);
        continue;
      }

      const parsedEvent = event.parsedJson as EventElectionCreated;

      // Validate required fields
      if (!parsedEvent.election_id || !parsedEvent.name || !parsedEvent.creator) {
        console.error('Missing required fields in EventElectionCreated:', parsedEvent);
        continue;
      }

      const electionId = String(parsedEvent.election_id);
      const creatorAddress = String(parsedEvent.creator);
      const electionName = parsedEvent.name;
      const txDigest = event.id?.txDigest ?? 'unknown';

      // Check duplicates
      const existingElection = await prisma.election.findUnique({
        where: { electionId },
      });

      if (existingElection) {
        console.log(`Election ${electionId} already exists, skipping...`);
        continue;
      }

      await prisma.election.create({
        data: {
          electionId,
          name: electionName,
          creator: creatorAddress,
          txDigest,
        },
      });

      console.log(`✅ Successfully stored election ${electionId}: ${electionName}`);
    } catch (error) {
      console.error('Error handling EventElectionCreated:', error);
      console.error('Event data:', event);
    }
  }
}

/**
 * Handle EventElectionEnded events
 * Called when an election is concluded on-chain
 */
export async function handleElectionEnded(events: SuiEvent[]): Promise<void> {
  for (const event of events) {
    try {
      if (!event.parsedJson) {
        console.warn('Skipping event: parsedJson is missing', event);
        continue;
      }

      const parsedEvent = event.parsedJson as EventElectionEnded;

      if (!parsedEvent.election_id) {
        console.error('Missing election_id in EventElectionEnded:', parsedEvent);
        continue;
      }

      const electionId = String(parsedEvent.election_id);
      const totalVotes = Number(parsedEvent.total_votes ?? 0);

      const winnerAddress = parsedEvent.winner ? String(parsedEvent.winner) : null;
      const txDigest = event.id?.txDigest ?? 'unknown';

      // Ensure election exists
      const election = await prisma.election.findUnique({
        where: { electionId },
      });

      if (!election) {
        console.error(`Election ${electionId} not found in database`);
        continue;
      }

      /**
       * Avoid duplicate insert:
       * This assumes electionId is unique in electionResult.
       * If not, you should change your prisma schema or use findFirst.
       */
      const existingResult = await prisma.electionResult.findUnique({
        where: { electionId },
      });

      if (existingResult) {
        console.log(`Election result for ${electionId} already exists, skipping...`);
        continue;
      }

      await prisma.electionResult.create({
        data: {
          electionId,
          winner: winnerAddress,
          totalVotes,
          txDigest,

          // If your schema requires relation:
          // election: { connect: { electionId } },
        },
      });

      console.log(`✅ Successfully stored election result for ${electionId}`);
      console.log(`   Winner: ${winnerAddress ?? 'No winner'}, Total Votes: ${totalVotes}`);
    } catch (error) {
      console.error('Error handling EventElectionEnded:', error);
      console.error('Event data:', event);
    }
  }
}