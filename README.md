# RiskGuard — On-Chain Risk Verifier

RiskGuard is a read-only pre-transaction safety filter for wallets and smart contracts. It turns on-chain context into a simple decision: **proceed, review, or avoid**.

> This repository contains the Pharos demo build. The current scanner uses clearly labeled local demo data so reviewers can explore the clean and suspicious examples without connecting a wallet.

## What it checks

RiskGuard presents five signals in plain language:

1. Address or contract age
2. Verified source code
3. Interactions with flagged addresses
4. Unusual approval patterns
5. Recent fund activity

The result includes a low, medium, or high risk level, evidence for each signal, a practical recommendation, and a shareable report copied through the browser Clipboard API.

## Demo

- Live app: https://riskguard-dvy6wdrm.manus.space
- Presentation video: [`demo/riskguard-demo-en.mp4`](./demo/riskguard-demo-en.mp4)

The live demo includes two shortcuts: **Example 01 · Clean** and **Example 02 · Watch**. The scanner is read-only and does not request a wallet connection, signature, password, or permission.

## Run locally

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm check      # TypeScript validation
pnpm test       # Test suite
pnpm build      # Production build
pnpm start      # Serve the production build
```

The development server uses port `3000` by default and respects the `PORT` environment variable.

## Project structure

```text
client/       React frontend, styles, route manifest, and logo
server/       Express + tRPC server and platform helpers
shared/       Shared constants and types
drizzle/      Database schema and migrations
components/   Shared UI primitives
public/demo/  Presentation assets
plan.md       Product and design plan
TODO.md       Delivery criteria
```

Dependencies, build output, environment files, IDE folders, and local runtime artifacts are excluded through `.gitignore`. Never commit API keys or `.env` files.

## Next integration step

The demo analysis layer is intentionally local and typed. A production version can replace the demo resolver with a Pharos-compatible indexer while keeping the same signal cards, risk explanation, recommendation, and report interface.
