# Project Context

**Generated:** 2026-04-05

## North Star
A developer or investor can enter any stock ticker and receive a structured AI-generated research brief in under 10 seconds.

## Tech Stack
Next.js 15 App Router, TypeScript, Tailwind CSS, Zustand for client state, SQLite, Drizzle ORM.

## Test Framework
Vitest + React Testing Library for unit/component tests.

## Integrations
- Alpha Vantage API (free tier) — stock price and fundamentals data
- Google Gemini API (free tier, gemini-2.0-flash) — AI research brief generation

## Data Shape
Primary input:  StockTicker (string, e.g. "AAPL")
Primary output: ResearchReport {
  id, ticker, companyName, price, priceChange,
  summary (AI-generated), sentiment (bullish/neutral/bearish),
  keyRisks (string[]), generatedAt
}

## Behavioural Constraints
- Never store raw API keys in the database
- Never call external APIs from Client Components
- All AI calls must be server-side only
- Reports older than 24 hours must be re-fetched, not served from cache
- No authentication required — all routes are public
