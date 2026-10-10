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

## Implementation update

Badge audits collect malformed URLs as report issues instead of aborting the whole audit. Non-string color values are rejected before SVG generation.

Credits for this fork's updates: [brunnodev.store](https://brunnodev.store). Original authors retain their respective attribution.

Contribution trailer: `Co-authored-by: nyctophile <329826984+ineedfoundmyway@users.noreply.github.com>`.

## Execution proof

[![Executable proof](https://github.com/brunnojob/Badges4-README.md-Profile/actions/workflows/proof.yml/badge.svg)](https://github.com/brunnojob/Badges4-README.md-Profile/actions/workflows/proof.yml)

[Recorded execution and downloadable evidence](https://github.com/brunnojob/Badges4-README.md-Profile/actions/workflows/proof.yml)

Run `python .proof/record.py` after installing the prerequisites above. The scenarios execute repository code and verify exit codes and expected output. CI publishes `execution-proof` with the transcript, input fingerprints and source commit. The downloadable report identifies the exact tested version; the workflow badge tracks the latest run.
