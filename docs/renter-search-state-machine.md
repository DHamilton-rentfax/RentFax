# RentFAX Renter Search — State Machine

This document explains how renter search works in RentFAX.
It is enforced in code and must not be bypassed.

## Core Principles
- Searches are unlimited
- Verification is per renter, not per user
- No dead ends
- Every flow creates an audit trail

## High-Level Flow
SEARCH → CONTEXT → VERIFICATION → REPORT

## States Explained

### SEARCH_INPUT
User enters renter info. No limits.

### SEARCHING
Backend lookup in progress.

### MULTI_MATCH
Multiple possible renters found.
User selects correct individual.

### MATCH_CONTEXT
Single match OR no history.
User is prompted to verify renter.

### VERIFICATION_DECISION
User chooses:
- Instant verification ($4.99)
- Self verification (free)
- Legacy attestation (partners only)

### CHECKOUT_REDIRECT
External verification or Stripe.

### REPORT_UNLOCKED
Renter report is unlocked and auditable.

### ERROR
Recoverable failure. User can retry or exit.

## Forbidden States
The following are NOT allowed:
- "No match found" dead ends
- "Search limit reached"
- "Try again later" screens
