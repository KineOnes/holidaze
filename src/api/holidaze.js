// src/api/holidaze.js

// Base URL from the Noroff v2 API docs
const API_BASE = "https://v2.api.noroff.dev";
//const API_KEY = import.meta.env.VITE_API_KEY;


// Read the API key from your .env.local file
// VITE_API_KEY="your-key-here"
const API_KEY = import.meta.env.VITE_API_KEY;

// Helper to attach the X-Noroff-API-Key header when we need it
function withApiKey(headers = {}) {
  if (!API_KEY) return headers;

  return {
    ...headers,
    "X-Noroff-API-Key": API_KEY,
  };
}

/**
 * Get a list of venues
 * Docs: GET /holidaze/venues
 * (Public – no auth needed)
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
 * (Public – no auth needed)
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
 * (Requires Bearer token + API key)
 */
/**
 * Get a profile including bookings and venues
 * Docs: GET /holidaze/profiles/{name}?_bookings=true&_venues=true
 */
export async function fetchProfileWithBookings(name, token) {
    const url = `${API_BASE}/holidaze/profiles/${name}?_bookings=true&_venues=true`;
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // authenticated endpoint
        "X-Noroff-API-Key": API_KEY,
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
  

/**
 * Get venues owned by a specific profile
 * Docs: GET /holidaze/profiles/{name}/venues
 * Used for Manage Venues page
 * (Requires Bearer token + API key)
 */
// Get venues owned by a specific profile (used for Manage Venues page)
export async function fetchManagedVenues(profileName, accessToken) {
    const response = await fetch(
      `${API_BASE}/holidaze/profiles/${encodeURIComponent(profileName)}/venues`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );
  
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      const message =
        json.errors?.[0]?.message ||
        `Failed to load managed venues (status ${response.status})`;
      throw new Error(message);
    }
  
    const json = await response.json();
    return json.data; // array of venues
  }
  

/**
 * Create a new venue
 * Docs: POST /holidaze/venues
 * (Requires Bearer token + API key)
 */

export async function createVenue(accessToken, venueData) {
    const response = await fetch(`${API_BASE}/holidaze/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(venueData),
    });
  
    const json = await response.json();
  
    if (!response.ok) {
      const message =
        json.errors?.[0]?.message || "Failed to create venue. Please try again.";
      throw new Error(message);
    }
  
    return json.data; // the created venue object
  }
  
