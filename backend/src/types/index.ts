/**
 * Type Definitions
 * 
 * This file contains TypeScript types for the application.
 * Students will learn about:
 * - TypeScript interfaces
 * - Type safety
 * - Matching types with smart contract events
 */

// ==================== Event Types (from smart contract) ====================

/**
 * Event emitted when a new election is created
 * Matches: EventElectionCreated in vote.move
 */
export interface EventElectionCreated {
  election_id: string;
  name: string;
  creator: string;
}

/**
 * Event emitted when a voter is registered
 * Matches: EventVoterRegistered in vote.move
 */
export interface EventVoterRegistered {
  election_id: string;
  voter: string;
}

/**
 * Event emitted when a candidate is registered
 * Matches: EventCandidateRegistered in vote.move
 */
export interface EventCandidateRegistered {
  election_id: string;
  candidate: string;
}

/**
 * Event emitted when a vote is cast
 * Matches: EventVoteCast in vote.move
 */
export interface EventVoteCast {
  election_id: string;
  voter: string;
  candidate: string;
}

/**
 * Event emitted when an election ends
 * Matches: EventElectionEnded in vote.move
 */
export interface EventElectionEnded {
  election_id: string;
  winner: string | null;
  total_votes: string;
}

// ==================== API Response Types ====================

export interface ElectionResponse {
  id: number;
  electionId: string;
  name: string;
  creator: string;
  createdAt: string;
  candidateCount: number;
  voterCount: number;
  voteCount: number;
  hasEnded: boolean;
}

export interface CandidateResponse {
  candidateAddress: string;
  voteCount: number;
}

export interface VoterResponse {
  voterAddress: string;
  hasVoted: boolean;
}

export interface ResultsResponse {
  electionId: string;
  winner: string | null;
  totalVotes: number;
  candidates: CandidateResponse[];
}

// ==================== Indexer Types ====================

export interface EventCursor {
  txDigest: string;
  eventSeq: string;
}
