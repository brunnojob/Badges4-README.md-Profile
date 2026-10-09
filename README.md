# Badge Toolkit

Local SVG badge rendering and Markdown URL auditing. Text and attributes are escaped; colors and dimensions are validated.

## Run

Requirement: Node.js 24.

```sh
node --test tests/*.test.mjs
node tools/badge.mjs render build passing build.svg green
node tools/badge.mjs audit README.md
```

The auditor detects insecure transport, embedded credentials, oversized fields, and invalid styles. Rendering works without an external service.

## Catalog

The original catalog is in [docs/catalog.md](docs/catalog.md). This repository derives from Badges4-README.md-Profile; the original license and attribution files are preserved.
