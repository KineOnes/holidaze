// src/pages/VenuesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVenues, searchVenues } from "../api/holidaze.js";

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Load venues (and re-load when query changes)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // If user typed something -> search endpoint
        // If empty -> normal list
        const data =
          query.trim().length > 0
            ? await searchVenues(query.trim())
            : await fetchVenues();

        if (!cancelled) setVenues(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Small delay so it doesn't call API on every single keystroke instantly
    const t = setTimeout(load, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  // Optional: sort results A → Z (nicer)
  const sortedVenues = useMemo(() => {
    return [...venues].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [venues]);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">Browse venues</h1>

          {/* Search input */}
          <div className="max-w-xl">
            <label className="block text-sm text-slate-300 mb-2">
              Search for a venue
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a venue name…"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
            {query.trim().length > 0 && (
              <button
                onClick={() => setQuery("")}
                className="mt-2 text-sm text-slate-300 hover:text-slate-100 underline"
              >
                Clear search
              </button>
            )}
          </div>
        </header>

        {loading && <p className="text-slate-300">Loading venues…</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && sortedVenues.length === 0 && (
          <p className="text-slate-300">
            {query.trim().length > 0
              ? "No venues matched your search."
              : "No venues found."}
          </p>
        )}

        {!loading && !error && sortedVenues.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedVenues.map((v) => {
              const img = v.media?.[0]?.url;
              const alt = v.media?.[0]?.alt || v.name;

              return (
                <Link
                  key={v.id}
                  to={`/venues/${v.id}`}
                  className="block bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition"
                >
                  <div className="h-44 bg-slate-700">
                    {img ? (
                      <img
                        src={img}
                        alt={alt}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h2 className="font-semibold text-lg truncate">{v.name}</h2>

                    {v.description && (
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {v.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-slate-200 pt-2">
                      <span className="font-semibold">
                        {v.price} NOK/night
                      </span>
                      <span className="text-slate-300">
                        Max {v.maxGuests} guests
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
