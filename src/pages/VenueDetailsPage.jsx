import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { fetchVenue, fetchVenueWithBookings, createBooking } from "../api/holidaze.js";
import { useAuth } from "../context/AuthContext.jsx";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString();
}

function hasDateOverlap(fromStr, toStr, bookings = []) {
  if (!fromStr || !toStr) return false;

  const from = new Date(fromStr);
  const to = new Date(toStr);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return false;

  return bookings.some((b) => {
    const existingFrom = new Date(b.dateFrom);
    const existingTo = new Date(b.dateTo);

    if (Number.isNaN(existingFrom.getTime()) || Number.isNaN(existingTo.getTime())) {
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

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const loadVenue = useCallback(async () => {
    setLoading(true);
    try {
      const data = token ? await fetchVenueWithBookings(id, token) : await fetchVenue(id);
      setVenue(data);
    } catch (error) {
      console.error(error);
      setVenue(null);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadVenue();
  }, [loadVenue]);

  const maxGuests = venue?.maxGuests ?? 1;
  const bookings = useMemo(() => venue?.bookings ?? [], [venue]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
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

      await loadVenue();
    } catch (err) {
      setSubmitError(err.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!venue) return <p className="p-6">Venue not found.</p>;

  const img = venue.media?.[0]?.url;
  const alt = venue.media?.[0]?.alt || venue.name;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
        {venue.description && <p className="opacity-80">{venue.description}</p>}
      </header>

      {/* Image */}
      <div className="card overflow-hidden">
        {img ? (
          <img src={img} alt={alt} className="w-full h-[380px] object-cover rounded-xl" />
        ) : (
          <div className="w-full h-[260px] flex items-center justify-center opacity-80">
            No image
          </div>
        )}
      </div>

      {/* Main grid */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <div className="card space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Price:</span> {venue.price} NOK/night
            </p>
            <p className="text-lg">
              <span className="font-semibold">Max guests:</span> {venue.maxGuests}
            </p>
          </div>

          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Availability</h2>

            {!token && (
              <p className="text-sm opacity-80">
                Log in to see booked dates.{" "}
                <Link className="underline" to="/login">
                  Go to login
                </Link>
              </p>
            )}

            {token && sortedBookings.length === 0 && (
              <p className="text-sm">No bookings yet — all dates look available.</p>
            )}

            {token && sortedBookings.length > 0 && (
              <>
                <p className="text-sm opacity-80">These dates are already booked:</p>
                <ul className="space-y-2">
                  {sortedBookings.map((b) => (
                    <li
                      key={b.id}
                      className="text-sm rounded-md px-3 py-2"
                      style={{ background: "rgba(0,0,0,0.08)" }}
                    >
                      {formatDate(b.dateFrom)} → {formatDate(b.dateTo)}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {token && overlapsExistingBooking && (
              <p className="text-sm" style={{ color: "#b91c1c" }}>
                Your selected dates overlap an existing booking.
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">Book this venue</h2>

          {!token && (
            <p className="text-sm opacity-80">
              You must be logged in to book.{" "}
              <Link className="underline" to="/login">
                Go to login
              </Link>
            </p>
          )}

          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="opacity-80">From</span>
                <input
                  type="date"
                  className="w-full rounded-md px-3 py-2 text-sm border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  disabled={!token || submitting}
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="opacity-80">To</span>
                <input
                  type="date"
                  className="w-full rounded-md px-3 py-2 text-sm border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  disabled={!token || submitting}
                />
              </label>
            </div>

            <label className="space-y-1 text-sm block">
              <span className="opacity-80">Guests</span>
              <input
                type="number"
                min={1}
                max={maxGuests}
                className="w-full rounded-md px-3 py-2 text-sm border"
                style={{ background: "rgba(255,255,255,0.7)" }}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                disabled={!token || submitting}
              />
              <p className="text-xs opacity-70">Max guests: {maxGuests}</p>
            </label>

            {submitError && (
              <p className="text-sm" style={{ color: "#b91c1c" }}>
                {submitError}
              </p>
            )}
            {submitSuccess && <p className="text-sm">{submitSuccess}</p>}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="px-4 py-2 rounded-md font-semibold disabled:opacity-50"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              {submitting ? "Booking…" : "Book now"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
