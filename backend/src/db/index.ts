/**
 * Database Module
 * 
 * This file sets up the Prisma client for database operations.
 * Students will learn about:
 * - Prisma client initialization
 * - Singleton pattern for database connections
 * - Proper connection handling
 */

import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client instance
// This prevents creating multiple connections during development with hot reload
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Function to test database connection
export async function connectDatabase(): Promise<void> {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}

// Function to disconnect from database
export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
    console.log('📤 Database disconnected');
}
