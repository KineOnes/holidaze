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

  // 1) Load venues you manage
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

        // auto-select first venue
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

  // 2) When venue changes, load its bookings
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
    // sort upcoming first
    return [...list].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }, [venueWithBookings]);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Manage bookings</h1>
          <p className="text-slate-300">
            View bookings for the venues you manage.
          </p>

          {!venueManager && (
            <p className="text-sm text-amber-400">
              Only venue managers can view venue bookings.
            </p>
          )}
        </header>

        {venueManager && (
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Select venue</h2>
                <p className="text-sm text-slate-300">
                  Choose a venue to see its bookings.
                </p>
              </div>

              <div className="min-w-[260px]">
                <select
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
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

            {error && <p className="text-sm text-red-400">{error}</p>}

            {loadingVenues && (
              <p className="text-sm text-slate-300">Loading your venues…</p>
            )}

            {!loadingVenues && venues.length === 0 && !error && (
              <p className="text-sm text-slate-300">
                You don’t manage any venues yet. Create a venue first.
              </p>
            )}
          </section>
        )}

        {venueManager && venues.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              Bookings for:{" "}
              <span className="text-emerald-300">
                {venueWithBookings?.name ?? "…"}
              </span>
            </h2>

            {loadingBookings && (
              <p className="text-sm text-slate-300">Loading bookings…</p>
            )}

            {!loadingBookings && !error && bookings.length === 0 && (
              <p className="text-sm text-slate-300">
                No bookings yet for this venue.
              </p>
            )}

            {!loadingBookings && !error && bookings.length > 0 && (
              <div className="grid gap-4">
                {bookings.map((b) => (
                  <article
                    key={b.id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-1"
                  >
                    <p className="text-sm text-slate-200">
                      <span className="font-semibold">From:</span>{" "}
                      {new Date(b.dateFrom).toLocaleDateString()}
                      {"  "}
                      <span className="font-semibold">To:</span>{" "}
                      {new Date(b.dateTo).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-300">
                      Guests: <span className="text-slate-100">{b.guests}</span>
                    </p>

                    {/* If the API returns customer info on booking, show it */}
                    {b.customer?.name && (
                      <p className="text-sm text-slate-300">
                        Customer:{" "}
                        <span className="text-slate-100">{b.customer.name}</span>
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
