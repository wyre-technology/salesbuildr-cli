/**
 * Output formatting utilities
 */

import Table from "cli-table3";
import chalk from "chalk";

export type OutputFormat = "json" | "table";

/**
 * Output data in the specified format
 */
export function output(data: unknown, format: OutputFormat = "json"): void {
  if (format === "json") {
    console.log(JSON.stringify(data, null, 2));
  } else {
    // Table format requires custom handling per data type
    console.log(JSON.stringify(data, null, 2));
  }
}

/**
 * Create a formatted table from data
 */
export function createTable(
  headers: string[],
  rows: string[][]
): Table.Table {
  return new Table({
    head: headers.map((h) => chalk.cyan(h)),
    style: {
      head: [],
      border: [],
    },
  });
}

/**
 * Format table output for list results
 */
export function formatListTable(
  data: { data?: unknown[]; total?: number },
  headers: string[],
  rowMapper: (item: unknown) => string[]
): void {
  if (!data.data || data.data.length === 0) {
    console.log(chalk.yellow("No results found."));
    return;
  }

  const table = createTable(headers, []);

  for (const item of data.data) {
    table.push(rowMapper(item));
  }

  console.log(table.toString());

  if (data.total !== undefined) {
    console.log(chalk.gray(`\nTotal: ${data.total}`));
  }
}

/**
 * Format a single record for table output
 */
export function formatRecordTable(data: Record<string, unknown>): void {
  const table = new Table({
    style: {
      head: [],
      border: [],
    },
  });

  for (const [key, value] of Object.entries(data)) {
    const formattedValue =
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : String(value);
    table.push({ [chalk.cyan(key)]: formattedValue });
  }

  console.log(table.toString());
}

/**
 * Display error message
 */
export function displayError(message: string): void {
  console.error(chalk.red(`Error: ${message}`));
}

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
  console.log(chalk.green(message));
}
