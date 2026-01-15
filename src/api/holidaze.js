// src/api/holidaze.js

// Base URL from the Noroff v2 API docs
const API_BASE = "https://v2.api.noroff.dev";

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
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json.errors?.[0]?.message || "Login failed. Please check your details.";
    throw new Error(message);
  }

  return json.data; // profile info + accessToken
}

/**
 * Get a profile including bookings and venues
 * Docs: GET /holidaze/profiles/{name}?_bookings=true&_venues=true
 * (Requires Bearer token + API key)
 */
export async function fetchProfileWithBookings(name, token) {
  const url = `${API_BASE}/holidaze/profiles/${encodeURIComponent(
    name
  )}?_bookings=true&_venues=true`;

  const response = await fetch(url, {
    headers: withApiKey({
      Authorization: `Bearer ${token}`,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    const message = json.errors?.[0]?.message || "Failed to load profile data.";
    throw new Error(message);
  }

  return json.data;
}

/**
 * Get venues owned by a specific profile
 * Docs: GET /holidaze/profiles/{name}/venues
 * (Requires Bearer token + API key)
 */
export async function fetchManagedVenues(profileName, accessToken) {
  const response = await fetch(
    `${API_BASE}/holidaze/profiles/${encodeURIComponent(profileName)}/venues`,
    {
      headers: withApiKey({
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    const message =
      json.errors?.[0]?.message ||
      `Failed to load managed venues (status ${response.status})`;
    throw new Error(message);
  }

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
    headers: withApiKey({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
    body: JSON.stringify(venueData),
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json.errors?.[0]?.message || "Failed to create venue. Please try again.";
    throw new Error(message);
  }

  return json.data;
}

/**
 * Get a venue including its bookings (for Venue Manager)
 * Docs: GET /holidaze/venues/{id}?_bookings=true
 * (Requires Bearer token + API key)
 */
export async function fetchVenueWithBookings(venueId, accessToken) {
  const response = await fetch(
    `${API_BASE}/holidaze/venues/${encodeURIComponent(
      venueId
    )}?_bookings=true`,
    {
      headers: withApiKey({
        Authorization: `Bearer ${accessToken}`,
      }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    const message =
      json.errors?.[0]?.message || "Failed to load venue bookings.";
    throw new Error(message);
  }

  return json.data; // venue object including bookings[]
}
/**
 * Create a booking (Customer)
 * Docs: POST /holidaze/bookings
 * (Requires Bearer token + API key)
 */
export async function createBooking(accessToken, bookingData) {
    const response = await fetch(`${API_BASE}/holidaze/bookings`, {
      method: "POST",
      headers: withApiKey({
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }),
      body: JSON.stringify(bookingData),
    });
  
    const json = await response.json();
  
    if (!response.ok) {
      const message =
        json.errors?.[0]?.message || "Failed to create booking. Please try again.";
      throw new Error(message);
    }
  
    return json.data; // created booking
  }
  
  /**
 * Update a profile avatar
 * Docs: PUT /holidaze/profiles/{name}
 * (Requires Bearer token + API key)
 */
export async function updateAvatar(profileName, accessToken, avatarUrl, avatarAlt = "") {
    const response = await fetch(
      `${API_BASE}/holidaze/profiles/${encodeURIComponent(profileName)}`,
      {
        method: "PUT",
        headers: withApiKey({
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }),
        body: JSON.stringify({
          avatar: {
            url: avatarUrl,
            alt: avatarAlt,
          },
        }),
      }
    );
  
    const json = await response.json();
  
    if (!response.ok) {
      const message =
        json.errors?.[0]?.message || "Failed to update avatar. Please try again.";
      throw new Error(message);
    }
  
    return json.data; // updated profile
  }
  