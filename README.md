# SalesBuildr CLI

Command-line interface for SalesBuildr - manage quotes, products, clients, and sales pipeline from your terminal.

## Installation

```bash
npm install -g @wyre-technology/salesbuildr-cli
```

Or use with npx:

```bash
npx @wyre-technology/salesbuildr-cli companies list
```

## Configuration

### Authentication

Set your SalesBuildr API key as an environment variable:

```bash
export SALESBUILDR_API_KEY="your-api-key-here"
```

Optionally, set a tenant-specific base URL:

```bash
export SALESBUILDR_BASE_URL="https://your-tenant.salesbuildr.com"
```

### Persistent Configuration

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export SALESBUILDR_API_KEY="your-api-key-here"
export SALESBUILDR_BASE_URL="https://your-tenant.salesbuildr.com"
```

## Usage

```bash
salesbuildr <resource> <action> [options]
```

### Output Formats

By default, all commands output JSON. Use `--format table` for human-readable tabular output:

```bash
# JSON output (default)
salesbuildr companies list

# Table output
salesbuildr companies list --format table
```

## Commands

### Companies

Manage companies/accounts in SalesBuildr.

```bash
# List companies
salesbuildr companies list
salesbuildr companies list --query "acme"
salesbuildr companies list --format table

# Get a specific company
salesbuildr companies get <company-id>

# Create a company
salesbuildr companies create \
  --name "Acme Corp" \
  --domain "acme.com" \
  --city "New York" \
  --state "NY"

# Update a company
salesbuildr companies update <company-id> \
  --phone "555-1234" \
  --website "https://acme.com"

# Delete a company
salesbuildr companies delete <company-id> --yes
```

**Aliases:** `company`

**Options:**
- `-q, --query <query>` - Search filter
- `--from <offset>` - Pagination offset (default: 0)
- `--size <size>` - Results per page (default: 25)
- `-f, --format <format>` - Output format: json or table

### Contacts

Manage contacts in SalesBuildr.

```bash
# List contacts
salesbuildr contacts list
salesbuildr contacts list --query "john"
salesbuildr contacts list --company-id <company-id>

# Get a specific contact
salesbuildr contacts get <contact-id>

# Create a contact
salesbuildr contacts create \
  --first-name "John" \
  --last-name "Doe" \
  --email "john@acme.com" \
  --title "CTO" \
  --company-id <company-id>

# Update a contact
salesbuildr contacts update <contact-id> \
  --phone "555-5678" \
  --title "VP of Engineering"

# Delete a contact
salesbuildr contacts delete <contact-id> --yes
```

**Aliases:** `contact`

**Options:**
- `-q, --query <query>` - Search filter
- `--company-id <id>` - Filter by company
- `--from <offset>` - Pagination offset
- `--size <size>` - Results per page
- `-f, --format <format>` - Output format

### Products

Browse the product catalog.

```bash
# List products
salesbuildr products list
salesbuildr products list --query "microsoft"
salesbuildr products list --format table

# Get a specific product
salesbuildr products get <product-id>
```

**Aliases:** `product`

**Options:**
- `-q, --query <query>` - Search filter
- `--from <offset>` - Pagination offset
- `--size <size>` - Results per page
- `-f, --format <format>` - Output format

### Opportunities

Manage sales opportunities and pipeline.

```bash
# List opportunities
salesbuildr opportunities list
salesbuildr opportunities list --query "migration"
salesbuildr opportunities list --format table

# Get a specific opportunity
salesbuildr opportunities get <opportunity-id>

# Create an opportunity
salesbuildr opportunities create \
  --title "Cloud Migration Project" \
  --company-id <company-id> \
  --value 50000 \
  --stage "qualification" \
  --probability 60 \
  --close-date "2026-06-30"

# Update an opportunity
salesbuildr opportunities update <opportunity-id> \
  --stage "proposal" \
  --probability 75
```

**Aliases:** `opportunity`, `opp`

**Options:**
- `-q, --query <query>` - Search filter
- `--from <offset>` - Pagination offset
- `--size <size>` - Results per page
- `-f, --format <format>` - Output format

### Quotes

Manage quotes with line items.

```bash
# List quotes
salesbuildr quotes list
salesbuildr quotes list --company-id <company-id>
salesbuildr quotes list --opportunity-id <opportunity-id>

# Get a specific quote
salesbuildr quotes get <quote-id>

# Create a quote
salesbuildr quotes create \
  --title "Q1 2026 Proposal" \
  --company-id <company-id> \
  --valid-until "2026-04-30" \
  --items '[
    {
      "name": "Microsoft 365 E3",
      "quantity": 50,
      "unitPrice": 36.00,
      "recurringPrice": 36.00,
      "billingCycle": "monthly"
    }
  ]'
```

**Aliases:** `quote`

**Options:**
- `-q, --query <query>` - Search filter
- `--company-id <id>` - Filter by company
- `--opportunity-id <id>` - Filter by opportunity
- `--from <offset>` - Pagination offset
- `--size <size>` - Results per page
- `-f, --format <format>` - Output format

## Examples

### Complete Workflow

```bash
# 1. Create a company
COMPANY_ID=$(salesbuildr companies create \
  --name "Tech Startup Inc" \
  --domain "techstartup.io" \
  --city "San Francisco" \
  --state "CA" \
  | jq -r '.id')

# 2. Add a contact
CONTACT_ID=$(salesbuildr contacts create \
  --first-name "Jane" \
  --last-name "Smith" \
  --email "jane@techstartup.io" \
  --title "CEO" \
  --company-id "$COMPANY_ID" \
  | jq -r '.id')

# 3. Create an opportunity
OPP_ID=$(salesbuildr opportunities create \
  --title "Microsoft 365 Migration" \
  --company-id "$COMPANY_ID" \
  --contact-id "$CONTACT_ID" \
  --value 25000 \
  --stage "qualification" \
  --probability 50 \
  | jq -r '.id')

# 4. Create a quote
salesbuildr quotes create \
  --title "M365 Migration Proposal" \
  --company-id "$COMPANY_ID" \
  --opportunity-id "$OPP_ID" \
  --items '[
    {
      "name": "Microsoft 365 Business Premium",
      "quantity": 25,
      "unitPrice": 22.00,
      "recurringPrice": 22.00,
      "billingCycle": "monthly"
    },
    {
      "name": "Migration Services",
      "quantity": 1,
      "unitPrice": 5000,
      "description": "One-time migration and setup"
    }
  ]' \
  --format table
```

### Batch Operations

```bash
# Export all companies to CSV
salesbuildr companies list --size 100 \
  | jq -r '.data[] | [.id, .name, .domain, .city, .state] | @csv'

# Find all opportunities over $10,000
salesbuildr opportunities list --size 100 \
  | jq '.data[] | select(.value > 10000)'

# List all contacts for a specific company
salesbuildr contacts list --company-id <company-id> --format table
```

## Development

```bash
# Clone the repository
git clone https://github.com/wyre-technology/salesbuildr-cli.git
cd salesbuildr-cli

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start -- companies list

# Type check
npm run typecheck

# Lint
npm run lint
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SALESBUILDR_API_KEY` | Yes | - | Your SalesBuildr API key |
| `SALESBUILDR_BASE_URL` | No | Library default | Tenant-specific base URL |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and contribution instructions.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/wyre-technology/salesbuildr-cli/issues)
- **Documentation:** [SalesBuildr API Docs](https://docs.salesbuildr.com)

## Related Projects

- [@wyre-technology/node-salesbuildr](https://github.com/wyre-technology/node-salesbuildr) - Node.js client library
- [@wyre-technology/salesbuildr-mcp](https://github.com/wyre-technology/salesbuildr-mcp) - MCP server for AI assistants
