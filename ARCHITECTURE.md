# RentFAX Architecture Contract

This project has STRICT constraints. Any code or config changes MUST respect the following rules.

SUPER ADMIN
- Full platform visibility
- Cross-org data
- Billing, risk, audit, enforcement

SUPPORT STAFF
- Case-based access
- Disputes, incidents, identity review
- No billing, no property ownership

CLIENT COMPANY
- Renter management
- Incident creation
- Dispute responses
- Searches & reports

RENTER
- View reports
- Submit disputes
- Upload evidence


## Runtime
- Next.js 16+
- App Router ONLY
- Webpack dev mode (no Turbopack)
- Firebase Studio preview environment

## Module System
- ES Modules ONLY
- "type": "module" is required in package.json
- No CommonJS syntax (require, module.exports)

## Routing
- App Router only (`/src/app`)
- NO `/pages` directory
- NO `_document.js`
- Root route is `/src/app/page.tsx`
- Redirects handled via App Router (`next/navigation`)

## Config
- `next.config.js` MUST be ES module
- DO NOT override Node core fallbacks
- DO NOT disable SWC
- DO NOT add legacy webpack loaders unless approved

## Middleware
- NO legacy `middleware.ts`
- Use App Router–compatible patterns only

## Tests
- Tests live outside routing
- Tests must NOT import from Next router internals
- Tests must not create `/pages` artifacts

## Environment
- Only ONE `next dev` process may run at a time
- Firebase Studio manages preview lifecycle

Any tool or contributor MUST follow this document.
