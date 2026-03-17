#!/usr/bin/env node
/**
 * SalesBuildr CLI
 *
 * Command-line interface for interacting with the SalesBuildr API.
 * Supports companies, contacts, products, opportunities, and quotes.
 *
 * Authentication: Set SALESBUILDR_API_KEY environment variable
 */

import { Command } from "commander";
import { registerCompaniesCommands } from "./commands/companies.js";
import { registerContactsCommands } from "./commands/contacts.js";
import { registerProductsCommands } from "./commands/products.js";
import { registerOpportunitiesCommands } from "./commands/opportunities.js";
import { registerQuotesCommands } from "./commands/quotes.js";

const program = new Command();

program
  .name("salesbuildr")
  .description("SalesBuildr CLI - Manage quotes, products, clients, and sales pipeline")
  .version("1.0.0");

// Register domain commands
registerCompaniesCommands(program);
registerContactsCommands(program);
registerProductsCommands(program);
registerOpportunitiesCommands(program);
registerQuotesCommands(program);

// Parse and execute
program.parse();
