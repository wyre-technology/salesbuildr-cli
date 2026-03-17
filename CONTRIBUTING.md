# Contributing to SalesBuildr CLI

Thank you for your interest in contributing to SalesBuildr CLI! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/salesbuildr-cli.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode (watch for changes)
npm run dev
```

### Testing

Set up your test environment:

```bash
# Set required environment variables
export SALESBUILDR_API_KEY="your-test-api-key"
export SALESBUILDR_BASE_URL="https://your-tenant.salesbuildr.com"  # optional
```

Run the CLI locally:

```bash
# After building
node dist/index.js companies list --help

# Or use npm start
npm start -- companies list
```

### Code Quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Run tests
npm test
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in `tsconfig.json`
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Follow existing patterns in the codebase

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(companies): add search filter support

Add ability to filter companies by domain name and location.

Closes #123
```

```
fix(quotes): handle empty line items array

Prevent crash when creating quotes with no line items.
```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format
3. Ensure all tests pass and code passes linting
4. Update documentation for any changed functionality
5. Request review from maintainers

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Include tests for new functionality
- Update documentation as needed
- Ensure CI passes before requesting review
- Respond to feedback in a timely manner

## Adding New Commands

When adding a new command:

1. Create a new file in `src/commands/` (e.g., `src/commands/newresource.ts`)
2. Follow the pattern established in existing command files
3. Register the command in `src/index.ts`
4. Add appropriate error handling
5. Support both `--format json` and `--format table` output
6. Update README.md with usage examples
7. Update CHANGELOG.md

Example command structure:

```typescript
import { Command } from "commander";
import { getClient } from "../utils/client.js";
import { output, displayError, type OutputFormat } from "../utils/output.js";

export function registerNewResourceCommands(program: Command): void {
  const resource = program
    .command("resource")
    .description("Manage resources");

  resource
    .command("list")
    .description("List resources")
    .option("-f, --format <format>", "Output format (json|table)", "json")
    .action(async (options) => {
      try {
        const client = getClient();
        const result = await client.resource.list();
        output(result, options.format as OutputFormat);
      } catch (error) {
        displayError(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });
}
```

## Questions?

If you have questions, please:
- Check existing [issues](https://github.com/wyre-technology/salesbuildr-cli/issues)
- Open a new issue with the `question` label
- Contact the maintainers

Thank you for contributing!
