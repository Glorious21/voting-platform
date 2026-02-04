/**
 * Main Application Entry Point
 * 
 * This file sets up the Express server and starts all services.
 * Students will learn about:
 * - Express application setup
 * - Middleware configuration
 * - Server initialization
 * - Graceful shutdown
 * 
 * TODO (Issue #1): Complete the server setup
 */

import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { connectDatabase, disconnectDatabase } from './db/index.js';
import routes from './routes/index.js';
import { setupEventListeners } from './indexer/event-indexer.js';

// Create Express application
const app = express();

// ==================== MIDDLEWARE ====================

// Enable CORS for frontend requests
app.use(cors({
    origin: '*',  // In production, specify your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// ==================== ROUTES ====================

// Mount API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Voting Platform Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            elections: '/api/elections',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// ==================== SERVER STARTUP ====================

async function startServer(): Promise<void> {
    try {
        console.log('🔄 Starting Voting Platform Backend...\n');

        // Connect to database
        await connectDatabase();

        // Start the event indexer
        await setupEventListeners();

        // Start Express server
        app.listen(CONFIG.PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${CONFIG.PORT}`);
            console.log(`📚 API Documentation: http://localhost:${CONFIG.PORT}/api/health`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// ==================== GRACEFUL SHUTDOWN ====================

async function gracefulShutdown(): Promise<void> {
    console.log('\n🛑 Shutting down gracefully...');
    await disconnectDatabase();
    process.exit(0);
}

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
startServer();
