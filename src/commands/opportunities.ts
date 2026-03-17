/**
 * Opportunities command handlers
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

export function registerOpportunitiesCommands(program: Command): void {
  const opportunities = program
    .command("opportunities")
    .alias("opportunity")
    .alias("opp")
    .description("Manage sales opportunities");

  // List opportunities
  opportunities
    .command("list")
    .alias("ls")
    .description("List opportunities")
    .option("-q, --query <query>", "Search query to filter opportunities")
    .option("--from <offset>", "Starting offset for pagination", "0")
    .option("--size <size>", "Number of results per page", "25")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const result = await client.opportunities.list({
          query: options.query,
          from: parseInt(options.from),
          size: parseInt(options.size),
        });

        if (options.format === "table") {
          formatListTable(
            result as { data?: unknown[]; total?: number },
            ["ID", "Title", "Value", "Stage", "Probability", "Close Date"],
            (item: unknown) => {
              const opp = item as Record<string, unknown>;
              return [
                String(opp.id || ""),
                String(opp.name || ""),
                opp.value ? `$${opp.value}` : "",
                String(opp.stage || ""),
                opp.probability ? `${opp.probability}%` : "",
                String(opp.expectedCloseDate || ""),
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

  // Get opportunity
  opportunities
    .command("get")
    .description("Get an opportunity by ID")
    .argument("<id>", "Opportunity ID")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const opportunity = await client.opportunities.get(id);

        if (options.format === "table") {
          formatRecordTable(opportunity as unknown as Record<string, unknown>);
        } else {
          output(opportunity, options.format as OutputFormat);
        }
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Create opportunity
  opportunities
    .command("create")
    .description("Create a new opportunity")
    .requiredOption("-t, --title <title>", "Opportunity title")
    .option("--company-id <id>", "Associated company ID")
    .option("--contact-id <id>", "Primary contact ID")
    .option("-v, --value <value>", "Estimated deal value", parseFloat)
    .option("-s, --stage <stage>", "Pipeline stage")
    .option("-p, --probability <probability>", "Win probability (0-100)", parseFloat)
    .option("--close-date <date>", "Expected close date (YYYY-MM-DD)")
    .option("--notes <notes>", "Additional notes")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const opportunity = await client.opportunities.create({
          name: options.title,
          companyId: options.companyId,
          contactId: options.contactId,
          value: options.value,
          stage: options.stage,
          probability: options.probability,
          expectedCloseDate: options.closeDate,
          description: options.notes,
        });

        if (options.format === "table") {
          formatRecordTable(opportunity as unknown as Record<string, unknown>);
        } else {
          output(opportunity, options.format as OutputFormat);
        }

        displaySuccess("Opportunity created successfully");
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Update opportunity
  opportunities
    .command("update")
    .description("Update an opportunity")
    .argument("<id>", "Opportunity ID")
    .option("-t, --title <title>", "Opportunity title")
    .option("--company-id <id>", "Associated company ID")
    .option("--contact-id <id>", "Primary contact ID")
    .option("-v, --value <value>", "Estimated deal value", parseFloat)
    .option("-s, --stage <stage>", "Pipeline stage")
    .option("-p, --probability <probability>", "Win probability (0-100)", parseFloat)
    .option("--close-date <date>", "Expected close date (YYYY-MM-DD)")
    .option("--notes <notes>", "Additional notes")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const opportunity = await client.opportunities.update(id, {
          name: options.title,
          companyId: options.companyId,
          contactId: options.contactId,
          value: options.value,
          stage: options.stage,
          probability: options.probability,
          expectedCloseDate: options.closeDate,
          description: options.notes,
        });

        if (options.format === "table") {
          formatRecordTable(opportunity as unknown as Record<string, unknown>);
        } else {
          output(opportunity, options.format as OutputFormat);
        }

        displaySuccess("Opportunity updated successfully");
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });
}
