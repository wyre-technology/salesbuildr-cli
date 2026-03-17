/**
 * SalesBuildr client singleton
 */

import { SalesbuildrClient } from "@wyre-technology/node-salesbuildr";

let client: SalesbuildrClient | null = null;

/**
 * Get or create SalesBuildr client instance
 */
export function getClient(): SalesbuildrClient {
  if (!client) {
    const apiKey = process.env.SALESBUILDR_API_KEY;
    const baseUrl = process.env.SALESBUILDR_BASE_URL;

    if (!apiKey) {
      throw new Error(
        "SALESBUILDR_API_KEY environment variable is required. Set it with your SalesBuildr API key."
      );
    }

    client = new SalesbuildrClient({
      apiKey,
      ...(baseUrl && { baseUrl }),
    });
  }

  return client;
}

/**
 * Reset the client (useful for testing or credential changes)
 */
export function resetClient(): void {
  client = null;
}
