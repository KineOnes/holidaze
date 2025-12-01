// src/api/holidaze.js

// Base URL from the Noroff v2 API docs
const API_BASE = "https://v2.api.noroff.dev";

/**
 * Get a list of venues.
 * This matches the docs: GET /holidaze/venues
 * https://docs.noroff.dev/docs/v2/holidaze/venues
 */
export async function fetchVenues() {
  const response = await fetch(`${API_BASE}/holidaze/venues`);

  if (!response.ok) {
    throw new Error(`Failed to fetch venues (status ${response.status})`);
  }

  const json = await response.json();

  // The Noroff API wraps data like: { data: [...], meta: {...} }
  return json.data;
}
