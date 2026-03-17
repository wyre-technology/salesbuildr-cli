/**
 * Quotes command handlers
 */

import { Command } from "commander";
import { getClient } from "../utils/client.js";
import {
  output,
  formatListTable,
  formatRecordTable,
  displayError,
  displaySuccess,
  type OutputFormat,
} from "../utils/output.js";

export function registerQuotesCommands(program: Command): void {
  const quotes = program
    .command("quotes")
    .alias("quote")
    .description("Manage quotes");

  // List quotes
  quotes
    .command("list")
    .alias("ls")
    .description("List quotes")
    .option("-q, --query <query>", "Search query to filter quotes")
    .option("--company-id <id>", "Filter by company ID")
    .option("--opportunity-id <id>", "Filter by opportunity ID")
    .option("--from <offset>", "Starting offset for pagination", "0")
    .option("--size <size>", "Number of results per page", "25")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const result = await client.quotes.list({
          query: options.query,
          companyId: options.companyId,
          opportunityId: options.opportunityId,
          from: parseInt(options.from),
          size: parseInt(options.size),
        });

        if (options.format === "table") {
          formatListTable(
            result as { data?: unknown[]; total?: number },
            ["ID", "Title", "Company ID", "Total", "Expires At", "Status"],
            (item: unknown) => {
              const quote = item as Record<string, unknown>;
              return [
                String(quote.id || ""),
                String(quote.title || ""),
                String(quote.companyId || ""),
                quote.total ? `$${quote.total}` : "",
                String(quote.expiresAt || ""),
                String(quote.status || ""),
              ];
            }
          );
        } else {
          output(result, options.format as OutputFormat);
        }
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Get quote
  quotes
    .command("get")
    .description("Get a quote by ID")
    .argument("<id>", "Quote ID")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const quote = await client.quotes.get(id);

        if (options.format === "table") {
          formatRecordTable(quote as unknown as Record<string, unknown>);
        } else {
          output(quote, options.format as OutputFormat);
        }
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Create quote
  quotes
    .command("create")
    .description("Create a new quote")
    .requiredOption("-t, --title <title>", "Quote title")
    .option("--company-id <id>", "Associated company ID")
    .option("--contact-id <id>", "Associated contact ID")
    .option("--opportunity-id <id>", "Associated opportunity ID")
    .option("--notes <notes>", "Additional notes")
    .option("--valid-until <date>", "Quote expiration date (YYYY-MM-DD)")
    .option("--items <json>", "Line items as JSON string")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();

        let items;
        if (options.items) {
          try {
            items = JSON.parse(options.items);
          } catch {
            displayError("Invalid JSON format for --items. Must be valid JSON array.");
            process.exit(1);
          }
        }

        const quote = await client.quotes.create({
          title: options.title,
          companyId: options.companyId,
          contactId: options.contactId,
          opportunityId: options.opportunityId,
          notes: options.notes,
          expiresAt: options.validUntil,
          items,
        });

        if (options.format === "table") {
          formatRecordTable(quote as unknown as Record<string, unknown>);
        } else {
          output(quote, options.format as OutputFormat);
        }

        displaySuccess("Quote created successfully");
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });
}
