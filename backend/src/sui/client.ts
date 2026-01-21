/**
 * Sui Client Module
 * 
 * This file sets up the connection to the Sui blockchain.
 * Students will learn about:
 * - RPC client setup
 * - Connecting to blockchain networks
 * - Network configuration (testnet, mainnet, devnet)
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { CONFIG } from '../config.js';

// Create a singleton Sui client instance
let suiClient: SuiClient | null = null;

/**
 * Get the Sui client instance
 * Uses singleton pattern to reuse the same connection
 */
export function getSuiClient(): SuiClient {
  if (!suiClient) {
    suiClient = new SuiClient({
      url: CONFIG.SUI_RPC_URL,
    });
    console.log(`🔗 Sui client connected to: ${CONFIG.SUI_RPC_URL}`);
  }
  return suiClient;
}

/**
 * Get Sui client for a specific network
 * Useful for testing on different networks
 */
export function getClientForNetwork(network: 'mainnet' | 'testnet' | 'devnet' | 'localnet'): SuiClient {
  return new SuiClient({
    url: getFullnodeUrl(network),
  });
}

// Export the package ID and module name for convenience
export const PACKAGE_ID = CONFIG.PACKAGE_ID;
export const MODULE_NAME = CONFIG.MODULE_NAME;

/**
 * Helper to get the full event type string
 * Example: "0x123...::vote::EventElectionCreated"
 */
export function getEventType(eventName: string): string {
  return `${PACKAGE_ID}::${MODULE_NAME}::${eventName}`;
}
