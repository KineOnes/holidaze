// src/pages/ManageVenuesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchManagedVenues } from "../api/holidaze.js";

export default function ManageVenuesPage() {
  const { user, token, venueManager, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safety guard: if somehow not logged in or not a manager, send away
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!venueManager) {
      navigate("/profile");
    }
  }, [isLoggedIn, venueManager, navigate]);

  useEffect(() => {
    if (!user || !token || !venueManager) return;

    async function loadManagedVenues() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchManagedVenues(user.name, token);
        setVenues(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load your venues.");
      } finally {
        setIsLoading(false);
      }
    }

    loadManagedVenues();
  }, [user, token, venueManager]);

  // If user somehow isn’t allowed, don’t render while redirect effect runs
  if (!isLoggedIn || !venueManager) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage venues</h1>
            <p className="text-sm text-slate-300">
              View and manage the venues you own.
            </p>
          </div>

          {/* Placeholder for later: Create venue button */}
          <button
            type="button"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
            disabled
          >
            + Create venue (coming soon)
          </button>
        </header>

        {isLoading && (
          <p className="text-sm text-slate-300">Loading your venues…</p>
        )}

        {error && (
          <p className="text-sm text-red-400 mb-4">
            Could not load your venues: {error}
          </p>
        )}

        {!isLoading && !error && venues.length === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-300">
            <p>You don’t manage any venues yet.</p>
            <p className="mt-1">
              Once you create a venue, it will appear here.
            </p>
          </div>
        )}

        {!isLoading && !error && venues.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => {
              const firstImage = venue.media?.[0];

              return (
                <article
                  key={venue.id}
                  className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 flex flex-col"
                >
                  {firstImage ? (
                    <img
                      src={firstImage.url}
                      alt={firstImage.alt || venue.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 w-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm">
                      No image
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                      {venue.name}
                    </h2>
                    <p className="text-xs text-slate-300 mb-2 line-clamp-2">
                      {venue.description}
                    </p>

                    <div className="mt-auto space-y-2 text-xs text-slate-300">
                      <p>
                        <span className="font-semibold text-slate-100">
                          Price:
                        </span>{" "}
                        {venue.price} NOK/night
                      </p>
                      <p>
                        <span className="font-semibold text-slate-100">
                          Max guests:
                        </span>{" "}
                        {venue.maxGuests}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/venues/${venue.id}`}
                        className="flex-1 rounded-md border border-slate-600 px-3 py-1.5 text-center text-xs hover:bg-slate-700"
                      >
                        View
                      </Link>

                      {/* Placeholders for future edit/delete */}
                      <button
                        type="button"
                        className="flex-1 rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed"
                        disabled
                      >
                        Edit (later)
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
