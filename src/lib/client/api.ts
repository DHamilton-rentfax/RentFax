import { auth } from "@/firebase/client";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function authedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const user = auth.currentUser;

  if (!user) {
    throw new ApiError("Not authenticated", 401);
  }

  // Force refresh so role changes are respected immediately
  const token = await user.getIdToken(true);

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      message = payload.error || payload.message || message;
    } catch {
      // Non-JSON response (CSV, text, etc.)
    }

    throw new ApiError(message, response.status);
  }

  return response;
}
