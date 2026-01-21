/**
 * Elections Router
 * 
 * This file defines API endpoints for elections.
 * Students will learn about:
 * - Express routers
 * - RESTful API design
 * - Database queries with Prisma
 * - Error handling in APIs
 * 
 * TODO (Issue #6): Implement the API endpoints
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../db/index.js';

const router = Router();

/**
 * GET /api/elections
 * Get all elections with counts
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const elections = await prisma.election.findMany({
      include: {
        _count: {
          select: {
            candidates: true,
            voters: true,
            votes: true,
          },
        },
        result: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data for API response
    const response = elections.map((election) => ({
      id: election.id,
      electionId: election.electionId,
      name: election.name,
      creator: election.creator,
      createdAt: election.createdAt.toISOString(),
      candidateCount: election._count.candidates,
      voterCount: election._count.voters,
      voteCount: election._count.votes,
      hasEnded: !!election.result,
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
});

/**
 * GET /api/elections/:electionId
 * Get a specific election by its on-chain ID
 */
router.get('/:electionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { electionId } = req.params;

    const election = await prisma.election.findUnique({
      where: { electionId },
      include: {
        candidates: true,
        voters: true,
        _count: {
          select: {
            votes: true,
          },
        },
        result: true,
      },
    });

    if (!election) {
      res.status(404).json({ error: 'Election not found' });
      return;
    }

    res.json({
      id: election.id,
      electionId: election.electionId,
      name: election.name,
      creator: election.creator,
      createdAt: election.createdAt.toISOString(),
      candidates: election.candidates.map((c) => c.candidateAddress),
      voters: election.voters.map((v) => v.voterAddress),
      voteCount: election._count.votes,
      hasEnded: !!election.result,
      result: election.result
        ? {
            winner: election.result.winner,
            totalVotes: election.result.totalVotes,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching election:', error);
    res.status(500).json({ error: 'Failed to fetch election' });
  }
});

/**
 * GET /api/elections/:electionId/candidates
 * Get all candidates for an election with their vote counts
 */
router.get('/:electionId/candidates', async (req: Request, res: Response): Promise<void> => {
  try {
    const { electionId } = req.params;

    const candidates = await prisma.candidate.findMany({
      where: { electionId },
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    const response = candidates.map((candidate) => ({
      candidateAddress: candidate.candidateAddress,
      voteCount: candidate._count.votes,
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

/**
 * GET /api/elections/:electionId/voters
 * Get all voters for an election with their vote status
 */
router.get('/:electionId/voters', async (req: Request, res: Response): Promise<void> => {
  try {
    const { electionId } = req.params;

    const voters = await prisma.voter.findMany({
      where: { electionId },
      include: {
        votes: {
          where: { electionId },
        },
      },
    });

    const response = voters.map((voter) => ({
      voterAddress: voter.voterAddress,
      hasVoted: voter.votes.length > 0,
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching voters:', error);
    res.status(500).json({ error: 'Failed to fetch voters' });
  }
});

/**
 * GET /api/elections/:electionId/votes
 * Get all votes for an election
 */
router.get('/:electionId/votes', async (req: Request, res: Response): Promise<void> => {
  try {
    const { electionId } = req.params;

    const votes = await prisma.vote.findMany({
      where: { electionId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response = votes.map((vote) => ({
      voterAddress: vote.voterAddress,
      candidateAddress: vote.candidateAddress,
      txDigest: vote.txDigest,
      createdAt: vote.createdAt.toISOString(),
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

/**
 * GET /api/elections/:electionId/results
 * Get the results for an election
 */
router.get('/:electionId/results', async (req: Request, res: Response): Promise<void> => {
  try {
    const { electionId } = req.params;

    // Get candidates with vote counts
    const candidates = await prisma.candidate.findMany({
      where: { electionId },
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
    });

    // Get total votes
    const totalVotes = await prisma.vote.count({
      where: { electionId },
    });

    // Check if election has ended
    const result = await prisma.electionResult.findUnique({
      where: { electionId },
    });

    res.json({
      electionId,
      hasEnded: !!result,
      winner: result?.winner || null,
      totalVotes,
      candidates: candidates.map((c) => ({
        candidateAddress: c.candidateAddress,
        voteCount: c._count.votes,
        percentage: totalVotes > 0
          ? ((c._count.votes / totalVotes) * 100).toFixed(2)
          : '0.00',
      })),
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
