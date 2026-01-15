// src/pages/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchProfileWithBookings, updateAvatar } from "../api/holidaze.js";

export default function ProfilePage() {
  const { user, isLoggedIn, venueManager, token, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Avatar form state
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [newAvatarAlt, setNewAvatarAlt] = useState("");
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [avatarSuccess, setAvatarSuccess] = useState(null);

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

  // Update avatar submit
  async function handleUpdateAvatar(e) {
    e.preventDefault();
    setAvatarError(null);
    setAvatarSuccess(null);

    if (!newAvatarUrl.trim()) {
      setAvatarError("Please paste an image URL.");
      return;
    }

    try {
      setAvatarSaving(true);

      const updated = await updateAvatar(
        user.name,
        token,
        newAvatarUrl.trim(),
        newAvatarAlt.trim()
      );

      // Update local profile state so UI updates immediately
      setProfileData((prev) => {
        if (!prev) return prev;
        return { ...prev, avatar: updated.avatar };
      });

      setAvatarSuccess("Avatar updated!");
      setNewAvatarUrl("");
      setNewAvatarAlt("");
    } catch (err) {
      setAvatarError(err.message);
    } finally {
      setAvatarSaving(false);
    }
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

  // Use profileData avatar first (updates instantly after save), fallback to user.avatar
  const currentAvatarUrl = profileData?.avatar?.url || user.avatar?.url;
  const currentAvatarAlt =
    profileData?.avatar?.alt || user.avatar?.alt || user.name;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <header className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-600">
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt={currentAvatarAlt}
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

        {/* Account + status */}
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

        {/* Update avatar */}
        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Update avatar</h2>

          <form onSubmit={handleUpdateAvatar} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Image URL *</label>
              <input
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="https://example.com/my-avatar.jpg"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Alt text (optional)
              </label>
              <input
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                value={newAvatarAlt}
                onChange={(e) => setNewAvatarAlt(e.target.value)}
                placeholder="My avatar"
              />
            </div>

            {avatarError && <p className="text-sm text-red-400">{avatarError}</p>}
            {avatarSuccess && (
              <p className="text-sm text-emerald-300">{avatarSuccess}</p>
            )}

            <button
              type="submit"
              disabled={avatarSaving}
              className="rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {avatarSaving ? "Saving..." : "Save avatar"}
            </button>
          </form>
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
                      {dateFrom.toLocaleDateString()} →{" "}
                      {dateTo.toLocaleDateString()}
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
