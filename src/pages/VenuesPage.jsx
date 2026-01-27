// src/pages/VenuesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVenues, searchVenues } from "../api/holidaze.js";

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
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

    const t = setTimeout(load, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const sortedVenues = useMemo(() => {
    return [...venues].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [venues]);

  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">Browse venues</h1>

          {/* Search input */}
          <div className="max-w-xl">
            <label className="block text-sm mb-2" style={{ opacity: 0.85 }}>
              Search for a venue
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a venue name…"
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{ background: "rgba(255,255,255,0.7)" }}
            />
            {query.trim().length > 0 && (
              <button
                onClick={() => setQuery("")}
                className="mt-2 text-sm underline"
                style={{ opacity: 0.85 }}
              >
                Clear search
              </button>
            )}
          </div>
        </header>

        {loading && <p style={{ opacity: 0.85 }}>Loading venues…</p>}
        {error && <p style={{ color: "#b91c1c" }}>Error: {error}</p>}

        {!loading && !error && sortedVenues.length === 0 && (
          <p style={{ opacity: 0.85 }}>
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
                  className="block card overflow-hidden hover:opacity-95 transition"
                >
                  <div style={{ background: "rgba(0,0,0,0.08)" }}>
                    {img ? (
                      <img
                        src={img}
                        alt={alt}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="h-44 flex items-center justify-center text-sm" style={{ opacity: 0.8 }}>
                        No image
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2">
                    <h2 className="font-semibold text-lg truncate">{v.name}</h2>

                    {v.description && (
                      <p className="text-sm line-clamp-2" style={{ opacity: 0.85 }}>
                        {v.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm pt-2" style={{ opacity: 0.9 }}>
                      <span className="font-semibold">{v.price} NOK/night</span>
                      <span style={{ opacity: 0.85 }}>Max {v.maxGuests} guests</span>
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
