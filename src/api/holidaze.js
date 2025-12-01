// Base URL from the Noroff v2 API docs
const API_BASE = "https://v2.api.noroff.dev";

/**
 * Get a list of venues.
 */
export async function fetchVenues() {
  const response = await fetch(`${API_BASE}/holidaze/venues`);

  if (!response.ok) {
    throw new Error(`Failed to fetch venues (status ${response.status})`);
  }

  const json = await response.json();
  return json.data;
}

/**
 * Get a single venue by id.
 */
export async function fetchVenue(id) {
  const response = await fetch(`${API_BASE}/holidaze/venues/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load venue");
  }

  const json = await response.json();
  return json.data;
}
