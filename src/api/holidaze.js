// src/api/holidaze.js

// Base URL from the Noroff v2 API docs
const API_BASE = "https://v2.api.noroff.dev";

/**
 * Get a list of venues
 * Docs: GET /holidaze/venues
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
 * Get a single venue by id
 * Docs: GET /holidaze/venues/{id}
 */
export async function fetchVenue(id) {
  const response = await fetch(`${API_BASE}/holidaze/venues/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to load venue (status ${response.status})`);
  }

  const json = await response.json();
  return json.data;
}

/**
 * Register a new user
 * Docs: POST /auth/register :contentReference[oaicite:0]{index=0}
 */
export async function registerUser({ name, email, password, venueManager }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      venueManager,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json.errors?.[0]?.message || "Registration failed. Please try again.";
    throw new Error(message);
  }

  // Returns the newly created profile (no token here)
  return json.data;
}

/**
 * Log in a user
 * Docs: POST /auth/login (with optional _holidaze=true to include venueManager etc) :contentReference[oaicite:1]{index=1}
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE}/auth/login?_holidaze=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json.errors?.[0]?.message || "Login failed. Please check your details.";
    throw new Error(message);
  }

  // json.data contains name, email, accessToken, venueManager, etc.
  return json.data;
}
