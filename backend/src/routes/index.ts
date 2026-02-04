/**
 * Routes Index
 * 
 * This file combines all route modules and exports them.
 * Students will learn about:
 * - Modular routing
 * - Route organization
 */

import { Router } from 'express';
import electionsRouter from './elections.js';
import healthRouter from './health.js';

const router = Router();

// Mount routes
router.use('/health', healthRouter);
router.use('/elections', electionsRouter);

export default router;
