import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchManagedVenues, fetchVenueWithBookings } from "../api/holidaze.js";

export default function ManageBookingsPage() {
  const { user, token, venueManager } = useAuth();

  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState(null);

  const [venueWithBookings, setVenueWithBookings] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    if (!venueManager) {
      setLoadingVenues(false);
      setVenues([]);
      return;
    }

    async function load() {
      setLoadingVenues(true);
      setError(null);

      try {
        const managed = await fetchManagedVenues(user.name, token);
        setVenues(managed);

        if (managed.length > 0) {
          setSelectedVenueId(managed[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingVenues(false);
      }
    }

    load();
  }, [user, token, venueManager]);

  useEffect(() => {
    if (!selectedVenueId || !token) return;

    async function loadBookings() {
      setLoadingBookings(true);
      setError(null);

      try {
        const venue = await fetchVenueWithBookings(selectedVenueId, token);
        setVenueWithBookings(venue);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBookings(false);
      }
    }

    loadBookings();
  }, [selectedVenueId, token]);

  const bookings = useMemo(() => {
    const list = venueWithBookings?.bookings ?? [];
    return [...list].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }, [venueWithBookings]);

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Manage bookings</h1>
          <p style={{ opacity: 0.85 }}>View bookings for the venues you manage.</p>

          {!venueManager && (
            <p className="text-sm" style={{ opacity: 0.85 }}>
              Only venue managers can view venue bookings.
            </p>
          )}
        </header>

        {venueManager && (
          <section className="card space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Select venue</h2>
                <p className="text-sm" style={{ opacity: 0.85 }}>
                  Choose a venue to see its bookings.
                </p>
              </div>

              <div className="min-w-[260px]">
                <select
                  className="w-full rounded-md px-3 py-2 text-sm border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  disabled={loadingVenues || venues.length === 0}
                >
                  {venues.length === 0 ? (
                    <option value="">No venues yet</option>
                  ) : (
                    venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {error && <p className="text-sm" style={{ color: "#b91c1c" }}>{error}</p>}

            {loadingVenues && <p className="text-sm" style={{ opacity: 0.85 }}>Loading your venues…</p>}

            {!loadingVenues && venues.length === 0 && !error && (
              <p className="text-sm" style={{ opacity: 0.85 }}>
                You don’t manage any venues yet. Create a venue first.
              </p>
            )}
          </section>
        )}

        {venueManager && venues.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              Bookings for:{" "}
              <span style={{ opacity: 0.9 }}>{venueWithBookings?.name ?? "…"}</span>
            </h2>

            {loadingBookings && (
              <p className="text-sm" style={{ opacity: 0.85 }}>Loading bookings…</p>
            )}

            {!loadingBookings && !error && bookings.length === 0 && (
              <p className="text-sm" style={{ opacity: 0.85 }}>
                No bookings yet for this venue.
              </p>
            )}

            {!loadingBookings && !error && bookings.length > 0 && (
              <div className="grid gap-4">
                {bookings.map((b) => (
                  <article key={b.id} className="card">
                    <p className="text-sm">
                      <span className="font-semibold">From:</span>{" "}
                      {new Date(b.dateFrom).toLocaleDateString()}
                      {"  "}
                      <span className="font-semibold">To:</span>{" "}
                      {new Date(b.dateTo).toLocaleDateString()}
                    </p>

                    <p className="text-sm" style={{ opacity: 0.85 }}>
                      Guests: <span className="font-semibold">{b.guests}</span>
                    </p>

                    {b.customer?.name && (
                      <p className="text-sm" style={{ opacity: 0.85 }}>
                        Customer: <span className="font-semibold">{b.customer.name}</span>
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
