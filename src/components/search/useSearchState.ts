import { useReducer } from "react";

/* -------------------------------------------------------------------------- */
/*                                   STATES                                   */
/* -------------------------------------------------------------------------- */

export type SearchState =
  | "IDLE"
  | "SEARCH_INPUT"
  | "SEARCHING"
  | "MULTI_MATCH"
  | "VERIFICATION_DECISION"
  | "UNLOCK_REPORT"
  | "VERIFIED_NO_REPORT"
  | "CHECKOUT_REDIRECT"
  | "REPORT_UNLOCKED"
  | "ERROR";

/* -------------------------------------------------------------------------- */
/*                                   OUTCOMES                                 */
/* -------------------------------------------------------------------------- */

export type SearchOutcome =
  | "NOT_FOUND"
  | "FOUND_UNVERIFIED_NO_REPORT"
  | "FOUND_VERIFIED_NO_REPORT"
  | "FOUND_WITH_REPORT";

/* -------------------------------------------------------------------------- */
/*                                   EVENTS                                   */
/* -------------------------------------------------------------------------- */

export type SearchEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SUBMIT_SEARCH" }
  | { type: "SEARCH_SUCCESS"; outcome: SearchOutcome }
  | { type: "SEARCH_ERROR" }
  | { type: "SELECT_CANDIDATE" }
  | { type: "VERIFY" }
  | { type: "CHECKOUT_STARTED" }
  | { type: "UNLOCKED" }
  | { type: "BACK" };

/* -------------------------------------------------------------------------- */
/*                             SEARCH FORM CONTEXT                            */
/* -------------------------------------------------------------------------- */

export type SearchFormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

/**
 * ✅ REQUIRED EXPORT
 * Used by SearchRenterModal and other consumers
 */
export const initialSearchState: SearchFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

/* -------------------------------------------------------------------------- */
/*                                  REDUCER                                   */
/* -------------------------------------------------------------------------- */

/**
 * IMPORTANT GUARANTEES:
 * - Reducer is PURE (no side effects)
 * - No state mutation
 * - No unreachable states
 * - BACK always leads to SEARCH_INPUT
 * - CLOSE always leads to IDLE
 */
export function searchReducer(
  state: SearchState,
  event: SearchEvent
): SearchState {
  switch (state) {
    /* ------------------------------ IDLE ------------------------------ */
    case "IDLE":
      if (event.type === "OPEN") return "SEARCH_INPUT";
      return state;

    /* -------------------------- SEARCH INPUT -------------------------- */
    case "SEARCH_INPUT":
      if (event.type === "SUBMIT_SEARCH") return "SEARCHING";
      if (event.type === "CLOSE") return "IDLE";
      return state;

    /* --------------------------- SEARCHING ---------------------------- */
    case "SEARCHING":
      if (event.type === "SEARCH_SUCCESS") {
        switch (event.outcome) {
          case "NOT_FOUND":
          case "FOUND_UNVERIFIED_NO_REPORT":
            return "VERIFICATION_DECISION";

          case "FOUND_VERIFIED_NO_REPORT":
            return "VERIFIED_NO_REPORT";

          case "FOUND_WITH_REPORT":
            return "UNLOCK_REPORT";

          default: {
            const _exhaustive: never = event.outcome;
            return "ERROR";
          }
        }
      }

      if (event.type === "SEARCH_ERROR") return "ERROR";
      if (event.type === "BACK") return "SEARCH_INPUT";
      return state;

    /* -------------------------- MULTI MATCH ---------------------------- */
    case "MULTI_MATCH":
      if (event.type === "SELECT_CANDIDATE") return "SEARCHING";
      if (event.type === "BACK") return "SEARCH_INPUT";
      return state;

    /* ---------------------- VERIFICATION DECISION ---------------------- */
    case "VERIFICATION_DECISION":
      if (event.type === "CHECKOUT_STARTED") return "CHECKOUT_REDIRECT";
      if (event.type === "BACK") return "SEARCH_INPUT";
      if (event.type === "CLOSE") return "IDLE";
      return state;

    /* --------------------------- UNLOCK REPORT ------------------------- */
    case "UNLOCK_REPORT":
      if (event.type === "CHECKOUT_STARTED") return "CHECKOUT_REDIRECT";
      if (event.type === "BACK") return "SEARCH_INPUT";
      if (event.type === "CLOSE") return "IDLE";
      return state;

    /* ----------------------- VERIFIED NO REPORT ------------------------ */
    case "VERIFIED_NO_REPORT":
      if (event.type === "VERIFY") return "VERIFICATION_DECISION";
      if (event.type === "BACK") return "SEARCH_INPUT";
      if (event.type === "CLOSE") return "IDLE";
      return state;

    /* ------------------------ CHECKOUT REDIRECT ------------------------ */
    case "CHECKOUT_REDIRECT":
      if (event.type === "UNLOCKED") return "REPORT_UNLOCKED";
      return state;

    /* ------------------------- REPORT UNLOCKED ------------------------- */
    case "REPORT_UNLOCKED":
      if (event.type === "CLOSE") return "IDLE";
      return state;

    /* ------------------------------ ERROR ------------------------------ */
    case "ERROR":
      if (event.type === "BACK") return "SEARCH_INPUT";
      if (event.type === "CLOSE") return "IDLE";
      return state;

    /* --------------------------- EXHAUSTIVE ---------------------------- */
    default: {
      const _exhaustive: never = state;
      return state;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                   HOOK                                     */
/* -------------------------------------------------------------------------- */

/**
 * Canonical hook for SearchRenterModal
 * This is the ONLY supported state machine for renter search
 */
export function useSearchState() {
  const [uiState, dispatch] = useReducer(searchReducer, "IDLE");

  return {
    uiState,
    dispatch,
    initialSearchState,
  };
}
