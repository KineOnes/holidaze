import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  fetchVenue,
  fetchVenueWithBookings,
  createBooking,
} from "../api/holidaze.js";
import { useAuth } from "../context/AuthContext.jsx";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString();
}

// Checks if [from, to] overlaps any booking ranges
function hasDateOverlap(fromStr, toStr, bookings = []) {
  if (!fromStr || !toStr) return false;

  const from = new Date(fromStr);
  const to = new Date(toStr);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return false;

  // Treat booking ranges as [dateFrom, dateTo)
  // Overlap exists if: from < existingTo AND to > existingFrom
  return bookings.some((b) => {
    const existingFrom = new Date(b.dateFrom);
    const existingTo = new Date(b.dateTo);

    if (
      Number.isNaN(existingFrom.getTime()) ||
      Number.isNaN(existingTo.getTime())
    ) {
      return false;
    }

    return from < existingTo && to > existingFrom;
  });
}

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

  async function loadVenue() {
    setLoading(true);
    try {
      // Logged out: fetch public venue
      // Logged in: fetch venue incl. bookings
      const data = token
        ? await fetchVenueWithBookings(id, token)
        : await fetchVenue(id);

      setVenue(data);
    } catch (error) {
      console.error(error);
      setVenue(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVenue();
  }, [id, token]); // IMPORTANT: include token so it refreshes after login/logout

  const maxGuests = venue?.maxGuests ?? 1;

  // Memo to keep stable reference (prevents hook dependency warnings)
  const bookings = useMemo(() => venue?.bookings ?? [], [venue]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
    );
  }, [bookings]);

  const overlapsExistingBooking = useMemo(() => {
    return hasDateOverlap(dateFrom, dateTo, bookings);
  }, [dateFrom, dateTo, bookings]);

  const canSubmit = useMemo(() => {
    if (!token) return false;
    if (!dateFrom || !dateTo) return false;

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return false;
    if (to <= from) return false;

    const guestsNum = Number(guests);
    if (!Number.isFinite(guestsNum) || guestsNum < 1) return false;
    if (guestsNum > maxGuests) return false;

    if (overlapsExistingBooking) return false;

    return true;
  }, [token, dateFrom, dateTo, guests, maxGuests, overlapsExistingBooking]);

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

      await createBooking(token, bookingData);

      setSubmitSuccess("Booking created! 🎉");

      // Reload venue so the new booking appears in the availability list
      await loadVenue();
    } catch (err) {
      setSubmitError(err.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!venue) return <p className="text-white p-6">Venue not found.</p>;

  const img = venue.media?.[0]?.url;
  const alt = venue.media?.[0]?.alt || venue.name;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <p className="text-slate-300">{venue.description}</p>
        </header>

        <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
          {img ? (
            <img src={img} alt={alt} className="w-full h-[380px] object-cover" />
          ) : (
            <div className="w-full h-[260px] flex items-center justify-center text-slate-300">
              No image
            </div>
          )}
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Price:</span> {venue.price} NOK/night
              </p>
              <p className="text-lg">
                <span className="font-semibold">Max Guests:</span> {venue.maxGuests}
              </p>
            </div>

            {/* Availability (only meaningful when logged in, since bookings require auth) */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
              <h2 className="text-lg font-semibold">Availability</h2>

              {!token && (
                <p className="text-sm text-slate-300">
                  Log in to see booked dates (availability) for this venue.
                </p>
              )}

              {token && sortedBookings.length === 0 && (
                <p className="text-sm text-emerald-300">
                  No bookings yet — all dates look available.
                </p>
              )}

              {token && sortedBookings.length > 0 && (
                <>
                  <p className="text-sm text-slate-300">
                    These dates are already booked:
                  </p>

                  <ul className="space-y-2">
                    {sortedBookings.map((b) => (
                      <li
                        key={b.id}
                        className="text-sm bg-slate-900 border border-slate-700 rounded-md px-3 py-2"
                      >
                        {formatDate(b.dateFrom)} → {formatDate(b.dateTo)}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {token && overlapsExistingBooking && (
                <p className="text-sm text-red-400">
                  Your selected dates overlap an existing booking.
                </p>
              )}
            </div>
          </div>

          {/* Right column: booking form */}
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

              {submitError && (
                <p className="text-sm text-red-400">{submitError}</p>
              )}
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
