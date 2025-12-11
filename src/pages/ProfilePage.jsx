// src/pages/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchProfileWithBookings } from "../api/holidaze.js";

export default function ProfilePage() {
  const { user, isLoggedIn, venueManager, token, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Guard: if something is weird and we’re here without auth
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  // Load profile with bookings + venues from API
  useEffect(() => {
    if (!user || !token) return;

    async function loadProfile() {
      setLoadingProfile(true);
      setProfileError(null);

      try {
        const data = await fetchProfileWithBookings(user.name, token);
        setProfileData(data);
      } catch (err) {
        console.error(err);
        setProfileError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user, token]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Compute upcoming bookings (today or future)
  const upcomingBookings = useMemo(() => {
    if (!profileData?.bookings) return [];

    const today = new Date();

    return profileData.bookings
      .filter((booking) => {
        if (!booking.dateFrom) return false;
        const from = new Date(booking.dateFrom);
        return from >= today;
      })
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }, [profileData]);

  if (!isLoggedIn || !user) {
    return null; // Redirect effect will handle it
  }

  const avatarUrl = user.avatar?.url;
  const avatarAlt = user.avatar?.alt || user.name;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <header className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-600">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={avatarAlt}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-slate-300">{user.email}</p>
            <p className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
              <span
                className={`h-2 w-2 rounded-full ${
                  venueManager ? "bg-emerald-400" : "bg-slate-400"
                }`}
              />
              {venueManager ? "Venue manager" : "Customer"}
            </p>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleLogout}
              className="text-sm rounded-md border border-slate-600 px-3 py-1.5 hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Account info */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2">Account</h2>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>
                <span className="font-medium text-slate-100">Name: </span>
                {user.name}
              </li>
              <li>
                <span className="font-medium text-slate-100">Email: </span>
                {user.email}
              </li>
              <li>
                <span className="font-medium text-slate-100">Role: </span>
                {venueManager ? "Venue manager" : "Customer"}
              </li>
            </ul>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2">Profile data status</h2>
            {loadingProfile && (
              <p className="text-sm text-slate-300">Loading bookings…</p>
            )}
            {profileError && (
              <p className="text-sm text-red-400">
                Could not load bookings: {profileError}
              </p>
            )}
            {!loadingProfile && !profileError && (
              <p className="text-sm text-slate-300">
                {upcomingBookings.length > 0
                  ? `You have ${upcomingBookings.length} upcoming booking${
                      upcomingBookings.length > 1 ? "s" : ""
                    }.`
                  : "You have no upcoming bookings."}
              </p>
            )}
          </div>
        </section>

        {/* Upcoming bookings */}
        <section className="mt-10">
  <h2 className="text-xl font-semibold mb-4">Upcoming bookings</h2>

  {upcomingBookings.length === 0 ? (
    <p className="text-slate-300">You have no upcoming bookings.</p>
  ) : (
    <ul className="space-y-4">
      {upcomingBookings.map((booking) => {
        const venue = booking.venue;
        const dateFrom = new Date(booking.dateFrom);
        const dateTo = new Date(booking.dateTo);

        return (
          <li
            key={booking.id}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700"
          >
            <p className="text-sm font-semibold">
              {venue?.name || "Unknown venue"}
            </p>

            <p className="text-xs text-slate-300">
              {dateFrom.toLocaleDateString()} → {dateTo.toLocaleDateString()}
            </p>

            <p className="text-xs text-slate-400">
              Guests: {booking.guests}
            </p>
          </li>
        );
      })}
    </ul>
  )}
</section>

      </section>
    </main>
  );
}
