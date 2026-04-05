# Project Context

**Generated:** 2026-04-05

## North Star
To build a centralized, blazingly fast Next.js dashboard where our engineering team can log system incidents, track their live resolution status, and generate standardized post-mortem reports.

## Tech Stack
- Framework: Next.js 14+ (App Router strict).
- Language: TypeScript.
- Styling: Tailwind CSS v4.
- State Management: Zustand (for client-side UI only).
- Database/ORM: PostgreSQL accessed via Prisma ORM.

## Integrations
None

## Data Shape
The primary data lives in PostgreSQL. The initial schema will consist of two primary entities:
- Incident: ID, Title, Severity (Low, Med, High), Status (Open, Investigating, Resolved), CreatedAt.
- PostMortem: ID, IncidentID, RootCause, ActionItems (String Array).

## Behavioural Constraints
- Strict Cache Invalidation: Any Server Action that mutates the database (like creating an incident) must explicitly call revalidatePath() to prevent stale UI data.
- Data Layer Isolation: Database calls (Prisma logic) are strictly forbidden inside React component files. All database access must be routed through isolated /lib/services/ or dedicated Server Actions.
