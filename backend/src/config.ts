/**
 * Configuration Module
 * 
 * This file loads environment variables and exports them as a typed config object.
 * Students will learn about:
 * - Environment variables
 * - Type safety for configuration
 * - Default values
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
function getEnvVar(name: string, defaultValue?: string): string {
    const value = process.env[name] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

// Export typed configuration object
export const CONFIG = {
    // Database
    DATABASE_URL: getEnvVar('DATABASE_URL'),

    // Sui Network
    SUI_NETWORK: getEnvVar('SUI_NETWORK', 'testnet'),
    SUI_RPC_URL: getEnvVar('SUI_RPC_URL', 'https://fullnode.testnet.sui.io:443'),

    // Package ID from deployed contract
    PACKAGE_ID: getEnvVar('PACKAGE_ID'),
    MODULE_NAME: 'vote',

    // Server
    PORT: parseInt(getEnvVar('PORT', '3001')),

    // Indexer
    POLLING_INTERVAL_MS: parseInt(getEnvVar('POLLING_INTERVAL_MS', '5000')),
} as const;

// Type for the config object
export type Config = typeof CONFIG;
