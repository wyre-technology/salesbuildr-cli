/**
 * Contacts command handlers
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

export function registerContactsCommands(program: Command): void {
  const contacts = program
    .command("contacts")
    .alias("contact")
    .description("Manage contacts");

  // List contacts
  contacts
    .command("list")
    .alias("ls")
    .description("List contacts")
    .option("-q, --query <query>", "Search query to filter contacts")
    .option("--company-id <id>", "Filter by company ID")
    .option("--from <offset>", "Starting offset for pagination", "0")
    .option("--size <size>", "Number of results per page", "25")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const result = await client.contacts.list({
          query: options.query,
          companyId: options.companyId,
          from: parseInt(options.from),
          size: parseInt(options.size),
        });

        if (options.format === "table") {
          formatListTable(
            result as { data?: unknown[]; total?: number },
            ["ID", "Name", "Email", "Phone", "Title", "Company ID"],
            (item: unknown) => {
              const contact = item as Record<string, unknown>;
              const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
              return [
                String(contact.id || ""),
                fullName,
                String(contact.email || ""),
                String(contact.phone || ""),
                String(contact.title || ""),
                String(contact.companyId || ""),
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

  // Get contact
  contacts
    .command("get")
    .description("Get a contact by ID")
    .argument("<id>", "Contact ID")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const contact = await client.contacts.get(id);

        if (options.format === "table") {
          formatRecordTable(contact as unknown as Record<string, unknown>);
        } else {
          output(contact, options.format as OutputFormat);
        }
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Create contact
  contacts
    .command("create")
    .description("Create a new contact")
    .requiredOption("--first-name <name>", "First name")
    .requiredOption("--last-name <name>", "Last name")
    .option("-e, --email <email>", "Email address")
    .option("-p, --phone <phone>", "Phone number")
    .option("-t, --title <title>", "Job title")
    .option("--company-id <id>", "Associated company ID")
    .option("--notes <notes>", "Additional notes")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const contact = await client.contacts.create({
          firstName: options.firstName,
          lastName: options.lastName,
          email: options.email,
          phone: options.phone,
          jobTitle: options.title,
          companyId: options.companyId,
          notes: options.notes,
        });

        if (options.format === "table") {
          formatRecordTable(contact as unknown as Record<string, unknown>);
        } else {
          output(contact, options.format as OutputFormat);
        }

        displaySuccess("Contact created successfully");
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Update contact
  contacts
    .command("update")
    .description("Update a contact")
    .argument("<id>", "Contact ID")
    .option("--first-name <name>", "First name")
    .option("--last-name <name>", "Last name")
    .option("-e, --email <email>", "Email address")
    .option("-p, --phone <phone>", "Phone number")
    .option("-t, --title <title>", "Job title")
    .option("--company-id <id>", "Associated company ID")
    .option("--notes <notes>", "Additional notes")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const contact = await client.contacts.update(id, {
          firstName: options.firstName,
          lastName: options.lastName,
          email: options.email,
          phone: options.phone,
          jobTitle: options.title,
          companyId: options.companyId,
          notes: options.notes,
        });

        if (options.format === "table") {
          formatRecordTable(contact as unknown as Record<string, unknown>);
        } else {
          output(contact, options.format as OutputFormat);
        }

        displaySuccess("Contact updated successfully");
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // Delete contact
  contacts
    .command("delete")
    .alias("rm")
    .description("Delete a contact")
    .argument("<id>", "Contact ID")
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
        await client.contacts.delete(id);

        displaySuccess(`Contact ${id} deleted successfully`);
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });
}
