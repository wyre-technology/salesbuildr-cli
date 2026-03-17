# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-03-17

### Added
- Initial release of SalesBuildr CLI
- Companies management commands (list, get, create, update, delete)
- Contacts management commands (list, get, create, update, delete)
- Products catalog commands (list, get)
- Opportunities pipeline commands (list, get, create, update)
- Quotes management commands (list, get, create)
- JSON output by default with `--format table` option for tabular display
- Environment variable authentication via `SALESBUILDR_API_KEY`
- Support for optional `SALESBUILDR_BASE_URL` for tenant-specific endpoints
- Command aliases for common operations (e.g., `ls`, `rm`, `opp`)
- Pagination support with `--from` and `--size` options
- Search/filter capabilities across all list commands
- Comprehensive CLI help documentation

[Unreleased]: https://github.com/wyre-technology/salesbuildr-cli/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/wyre-technology/salesbuildr-cli/releases/tag/v1.0.0
