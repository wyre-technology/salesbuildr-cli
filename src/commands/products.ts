/**
 * Products command handlers
 */

import { Command } from "commander";
import { getClient } from "../utils/client.js";
import {
  output,
  formatListTable,
  formatRecordTable,
  displayError,
  type OutputFormat,
} from "../utils/output.js";

export function registerProductsCommands(program: Command): void {
  const products = program
    .command("products")
    .alias("product")
    .description("Browse product catalog");

  // List products
  products
    .command("list")
    .alias("ls")
    .description("List products")
    .option("-q, --query <query>", "Search query to filter products")
    .option("--from <offset>", "Starting offset for pagination", "0")
    .option("--size <size>", "Number of results per page", "25")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const result = await client.products.list({
          query: options.query,
          from: parseInt(options.from),
          size: parseInt(options.size),
        });

        if (options.format === "table") {
          formatListTable(
            result as { data?: unknown[]; total?: number },
            ["ID", "Name", "SKU", "Category", "Price"],
            (item: unknown) => {
              const product = item as Record<string, unknown>;
              return [
                String(product.id || ""),
                String(product.name || ""),
                String(product.sku || ""),
                String(product.category || ""),
                String(product.price || ""),
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

  // Get product
  products
    .command("get")
    .description("Get a product by ID")
    .argument("<id>", "Product ID")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (id, options) => {
      try {
        const client = getClient();
        const product = await client.products.get(id);

        if (options.format === "table") {
          formatRecordTable(product as unknown as Record<string, unknown>);
        } else {
          output(product, options.format as OutputFormat);
        }
      } catch (error) {
        displayError(
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });
}
