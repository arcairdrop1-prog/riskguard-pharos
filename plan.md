# RiskGuard — implementation and design plan

## Scope

Build a pre-transaction safety filter for wallets and contracts. The product demonstrates five on-chain signals, classifies risk as low/medium/high, explains each flag in plain English, shows a clean example and a problematic example, provides an actionable recommendation, and generates a shareable report.

The first version uses local demo data so the presentation is honest without pretending to have a live on-chain indexer. The copy clearly labels demo mode; the query layer remains isolated for a future indexer connection.

## Implementation

React + TypeScript power the frontend. The main page contains the address scanner, demo shortcuts, result overview, five signal cards, recommendation panel, and Clipboard API report action. The static route manifest exposes `/`. The server remains ready for a future indexer integration without requiring external credentials.

## Design

The chosen direction is editorial security with operational precision: an ivory canvas, deep navy type, electric-blue actions, mint for clear signals, amber for caution, and coral for high risk. The layout uses an asymmetric narrative-and-decision split, a vertical “PRE-TRANSACTION” rail, and evidence cards instead of decorative charts. The voice is direct and protective: “See the signals before you sign.” and “Risk is not an opinion — it is context for a better decision.”

Typography uses DM Sans for body copy and Space Grotesk for headlines and metrics. Motion is restrained: scanner focus, short loading feedback, and a clear reveal from verdict to evidence to recommendation.

## Structure

`client/src/pages/Home.tsx` contains the functional experience and typed demo analysis. `client/src/index.css` contains the responsive visual system. `client/public/manus-routes.json` declares the page route. `client/public/logo.svg` is the project mark. `app.config.ts` stores durable project branding. `TODO.md` records delivery criteria.
