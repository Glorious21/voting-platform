/**
 * Health Router
 * 
 * Simple health check endpoint to verify the server is running.
 * Students will learn about:
 * - Health checks for production systems
 * - Status endpoints
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../db/index.js';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: 'Database connection failed',
        });
    }
});

export default router;
