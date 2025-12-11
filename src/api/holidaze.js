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
 * Docs: POST /auth/register
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
 * Docs: POST /auth/login?_holidaze=true
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

  // json.data contains profile info + accessToken
  return json.data;
}

/**
 * Get a profile including bookings and venues
 * Docs: GET /holidaze/profiles/{name}?_bookings=true&_venues=true
 */
export async function fetchProfileWithBookings(name, token) {
  const url = `${API_BASE}/holidaze/profiles/${name}?_bookings=true&_venues=true`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`, // authenticated endpoint
    },
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json.errors?.[0]?.message || "Failed to load profile data.";
    throw new Error(message);
  }

  return json.data; // contains bookings[] and venues[] if any
}
