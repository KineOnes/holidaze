// src/pages/VenuesPage.jsx
import { useEffect, useState } from "react";
import { fetchVenues } from "../api/holidaze";

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadVenues() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchVenues();
        if (isMounted) {
          setVenues(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Something went wrong while loading venues.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVenues();

    return () => {
      // clean-up in case the component unmounts
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <p className="text-xl">Loading venues…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold">Couldn’t load venues</p>
          <p className="text-sm text-slate-300">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Browse venues</h1>

        {venues.length === 0 ? (
          <p>No venues found.</p>
        ) : (
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
                    <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                      {venue.name}
                    </h2>
                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                      {venue.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        {venue.price} <span className="text-slate-300">NOK/night</span>
                      </span>
                      <span className="text-slate-300">
                        Max {venue.maxGuests} guests
                      </span>
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
