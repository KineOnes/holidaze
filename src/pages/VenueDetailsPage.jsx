import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchVenue, createBooking } from "../api/holidaze.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function VenueDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    async function loadVenue() {
      setLoading(true);
      try {
        const data = await fetchVenue(id);
        setVenue(data);
      } catch (error) {
        console.error(error);
        setVenue(null);
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  const maxGuests = venue?.maxGuests ?? 1;

  const canSubmit = useMemo(() => {
    if (!token) return false;
    if (!dateFrom || !dateTo) return false;

    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return false;
    if (to <= from) return false;

    if (!guests || guests < 1) return false;
    if (guests > maxGuests) return false;

    return true;
  }, [token, dateFrom, dateTo, guests, maxGuests]);

  async function handleBook(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!token) {
      setSubmitError("You must be logged in to book.");
      return;
    }

    if (!canSubmit) {
      setSubmitError("Please choose valid dates and guests.");
      return;
    }

    try {
      setSubmitting(true);

      const bookingData = {
        dateFrom,
        dateTo,
        guests: Number(guests),
        venueId: id,
      };

      const created = await createBooking(token, bookingData);

      setSubmitSuccess("Booking created! 🎉");
      // Optionally reset form
      // setDateFrom("");
      // setDateTo("");
      // setGuests(1);

      console.log("Created booking:", created);
    } catch (err) {
      setSubmitError(err.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!venue) return <p className="text-white p-6">Venue not found.</p>;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <p className="text-slate-300">{venue.description}</p>
        </header>

        <img
          src={venue.media?.[0]?.url}
          alt={venue.media?.[0]?.alt || venue.name}
          className="rounded-xl w-full border border-slate-700"
        />

        <section className="grid gap-4 md:grid-cols-2">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Price:</span> {venue.price} NOK/night
            </p>
            <p className="text-lg">
              <span className="font-semibold">Max Guests:</span> {venue.maxGuests}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold">Book this venue</h2>

            {!token && (
              <p className="text-sm text-amber-300">
                You must be logged in to book.{" "}
                <Link className="underline" to="/login">
                  Go to login
                </Link>
              </p>
            )}

            <form onSubmit={handleBook} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-slate-300">From</span>
                  <input
                    type="date"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    disabled={!token || submitting}
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-slate-300">To</span>
                  <input
                    type="date"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    disabled={!token || submitting}
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm block">
                <span className="text-slate-300">Guests</span>
                <input
                  type="number"
                  min={1}
                  max={maxGuests}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  disabled={!token || submitting}
                />
                <p className="text-xs text-slate-400">
                  Max guests for this venue: {maxGuests}
                </p>
              </label>

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}
              {submitSuccess && (
                <p className="text-sm text-emerald-300">{submitSuccess}</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-emerald-500 text-slate-900 font-semibold disabled:opacity-50"
              >
                {submitting ? "Booking…" : "Book now"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
