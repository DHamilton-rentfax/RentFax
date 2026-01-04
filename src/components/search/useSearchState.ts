import { useReducer } from "react";

/* -------------------------------------------------------------------------- */
/*                                   STATES                                   */
/* -------------------------------------------------------------------------- */

export type SearchState =
  | "IDLE"
  | "SEARCH_INPUT"
  | "SEARCHING"
  | "MULTI_MATCH"
  | "MATCH_CONTEXT"
  | "VERIFICATION_DECISION"
  | "CHECKOUT_REDIRECT"
  | "REPORT_UNLOCKED"
  | "ERROR";

/* -------------------------------------------------------------------------- */
/*                                   EVENTS                                   */
/* -------------------------------------------------------------------------- */

export type SearchEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SUBMIT_SEARCH" }
  | { type: "SEARCH_SUCCESS"; matchType: "single" | "multi" | "none" }
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

export function searchReducer(
  state: SearchState,
  event: SearchEvent
): SearchState {
  switch (state) {
    case "IDLE":
      return event.type === "OPEN" ? "SEARCH_INPUT" : state;

    case "SEARCH_INPUT":
      if (event.type === "SUBMIT_SEARCH") return "SEARCHING";
      if (event.type === "CLOSE") return "IDLE";
      return state;

    case "SEARCHING":
      if (event.type === "SEARCH_SUCCESS") {
        return event.matchType === "multi"
          ? "MULTI_MATCH"
          : "MATCH_CONTEXT";
      }
      if (event.type === "SEARCH_ERROR") return "ERROR";
      return state;

    case "MULTI_MATCH":
      if (event.type === "SELECT_CANDIDATE") return "MATCH_CONTEXT";
      if (event.type === "BACK") return "SEARCH_INPUT";
      return state;

    case "MATCH_CONTEXT":
      if (event.type === "VERIFY") return "VERIFICATION_DECISION";
      if (event.type === "BACK") return "SEARCH_INPUT";
      return state;

    case "VERIFICATION_DECISION":
      if (event.type === "CHECKOUT_STARTED") return "CHECKOUT_REDIRECT";
      if (event.type === "BACK") return "MATCH_CONTEXT";
      return state;

    case "CHECKOUT_REDIRECT":
      if (event.type === "UNLOCKED") return "REPORT_UNLOCKED";
      return state;

    case "REPORT_UNLOCKED":
      if (event.type === "CLOSE") return "IDLE";
      return state;

    case "ERROR":
      if (event.type === "BACK") return "SEARCH_INPUT";
      return state;

    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   HOOK                                     */
/* -------------------------------------------------------------------------- */

/**
 * Canonical hook for SearchRenterModal
 * Encapsulates reducer + form data
 */
export function useSearchState() {
  const [uiState, dispatch] = useReducer(searchReducer, "IDLE");

  return {
    uiState,
    dispatch,
    initialSearchState,
  };
}
