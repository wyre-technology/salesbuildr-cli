/**
 * Companies command handlers
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

export function registerCompaniesCommands(program: Command): void {
  const companies = program
    .command("companies")
    .alias("company")
    .description("Manage companies");

  // List companies
  companies
    .command("list")
    .alias("ls")
    .description("List companies")
    .option("-q, --query <query>", "Search query to filter companies")
    .option("--from <offset>", "Starting offset for pagination", "0")
    .option("--size <size>", "Number of results per page", "25")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const result = await client.companies.list({
          query: options.query,
          from: parseInt(options.from),
          size: parseInt(options.size),
        });

        if (options.format === "table") {
          formatListTable(
            result as { data?: unknown[]; total?: number },
            ["ID", "Name", "Domain", "City", "State"],
            (item: unknown) => {
              const company = item as Record<string, unknown>;
              return [
                String(company.id || ""),
                String(company.name || ""),
                String(company.domain || ""),
                String(company.city || ""),
                String(company.state || ""),
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

  // Get company
  companies
    .command("get")
    .description("Get a company by ID")
    .argument("<id>", "Company ID")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const company = await client.companies.get(id);

        if (options.format === "table") {
          formatRecordTable(company as unknown as Record<string, unknown>);
        } else {
          output(company, options.format as OutputFormat);
        }
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Create company
  companies
    .command("create")
    .description("Create a new company")
    .requiredOption("-n, --name <name>", "Company name")
    .option("-d, --domain <domain>", "Company domain")
    .option("-a, --address <address>", "Street address")
    .option("-c, --city <city>", "City")
    .option("-s, --state <state>", "State or province")
    .option("-z, --zip <zip>", "ZIP or postal code")
    .option("--country <country>", "Country")
    .option("-p, --phone <phone>", "Phone number")
    .option("-w, --website <website>", "Website URL")
    .option("--notes <notes>", "Additional notes")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const company = await client.companies.create({
          name: options.name,
          domain: options.domain,
          address: options.address,
          city: options.city,
          state: options.state,
          zipCode: options.zip,
          country: options.country,
          phone: options.phone,
          website: options.website,
          notes: options.notes,
        });

        if (options.format === "table") {
          formatRecordTable(company as unknown as Record<string, unknown>);
        } else {
          output(company, options.format as OutputFormat);
        }

        displaySuccess("Company created successfully");
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Update company
  companies
    .command("update")
    .description("Update a company")
    .argument("<id>", "Company ID")
    .option("-n, --name <name>", "Company name")
    .option("-d, --domain <domain>", "Company domain")
    .option("-a, --address <address>", "Street address")
    .option("-c, --city <city>", "City")
    .option("-s, --state <state>", "State or province")
    .option("-z, --zip <zip>", "ZIP or postal code")
    .option("--country <country>", "Country")
    .option("-p, --phone <phone>", "Phone number")
    .option("-w, --website <website>", "Website URL")
    .option("--notes <notes>", "Additional notes")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const company = await client.companies.update(id, {
          name: options.name,
          domain: options.domain,
          address: options.address,
          city: options.city,
          state: options.state,
          zipCode: options.zip,
          country: options.country,
          phone: options.phone,
          website: options.website,
          notes: options.notes,
        });

        if (options.format === "table") {
          formatRecordTable(company as unknown as Record<string, unknown>);
        } else {
          output(company, options.format as OutputFormat);
        }

        displaySuccess("Company updated successfully");
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Delete company
  companies
    .command("delete")
    .alias("rm")
    .description("Delete a company")
    .argument("<id>", "Company ID")
    .option("-y, --yes", "Skip confirmation")
    .action(async (id, options) => {
      try {
        if (!options.yes) {
          displayError(
            "This action cannot be undone. Use --yes to confirm deletion."
          );
          process.exit(1);
        }

        const client = getClient();
        await client.companies.delete(id);

        displaySuccess(`Company ${id} deleted successfully`);
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });
}
