import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchProfileWithBookings, updateAvatar } from "../api/holidaze.js";

export default function ProfilePage() {
    const { user, isLoggedIn, venueManager, token, logout, updateUser } = useAuth();
    const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Avatar form state
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [avatarAltInput, setAvatarAltInput] = useState("My avatar");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [avatarSuccess, setAvatarSuccess] = useState(null);

  // Guard: must be logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!user?.name || !token) {
      logout();
      navigate("/login");
      return;
    }
  }, [isLoggedIn, user, token, logout, navigate]);

  // Load profile (bookings)
  useEffect(() => {
    if (!user?.name || !token) return;

    async function loadProfile() {
      setLoadingProfile(true);
      setProfileError(null);

      try {
        const data = await fetchProfileWithBookings(user.name, token);
        setProfileData(data);
      } catch (err) {
        const message = err?.message || "Failed to load profile.";

        if (
          message.toLowerCase().includes("invalid authorization token") ||
          message.toLowerCase().includes("401")
        ) {
          logout();
          navigate("/login");
          return;
        }

        setProfileError(message);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user, token, logout, navigate]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const upcomingBookings = useMemo(() => {
    if (!profileData?.bookings) return [];
    const today = new Date();

    return profileData.bookings
      .filter((booking) => booking.dateFrom && new Date(booking.dateFrom) >= today)
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }, [profileData]);

  const avatarUrl = user?.avatar?.url;
  const avatarAlt = user?.avatar?.alt || user?.name || "Avatar";

  async function handleSaveAvatar(e) {
    e.preventDefault();
    setAvatarError(null);
    setAvatarSuccess(null);

    if (!avatarUrlInput.trim()) {
      setAvatarError("Please paste an image URL.");
      return;
    }

    if (!user?.name || !token) {
      setAvatarError("You are not logged in. Please login again.");
      logout();
      navigate("/login");
      return;
    }

    try {
      setSavingAvatar(true);

      const updatedProfile = await updateAvatar(
        user.name,
        token,
        avatarUrlInput.trim(),
        avatarAltInput.trim()
      );

      updateUser((prev) => ({
        ...prev,
        avatar: updatedProfile.avatar,
      }));
      

      setAvatarSuccess("Avatar updated!");
      setAvatarUrlInput("");
    } catch (err) {
      const message = err?.message || "Failed to update avatar.";

      if (
        message.toLowerCase().includes("invalid authorization token") ||
        message.toLowerCase().includes("401")
      ) {
        logout();
        navigate("/login");
        return;
      }

      setAvatarError(message);
    } finally {
      setSavingAvatar(false);
    }
  }

  // While redirect-guard runs
  if (!isLoggedIn || !user?.name) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header className="flex items-center gap-6">
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(255,255,255,0.25)" }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={avatarAlt} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm opacity-80">{user.email}</p>

          <p
            className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.08)" }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: venueManager ? "#10b981" : "rgba(0,0,0,0.35)" }}
            />
            {venueManager ? "Venue manager" : "Customer"}
          </p>
        </div>

        <div className="ml-auto">
            <button onClick={handleLogout} className="btn btn-soft">
              Log out
            </button>
        </div>
      </header>

      {/* Info cards */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Account</h2>
          <ul className="text-sm space-y-1" style={{ opacity: 0.85 }}>
            <li>
              <span className="font-semibold">Name:</span> {user.name}
            </li>
            <li>
              <span className="font-semibold">Email:</span> {user.email}
            </li>
            <li>
              <span className="font-semibold">Role:</span>{" "}
              {venueManager ? "Venue manager" : "Customer"}
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Profile data status</h2>

          {loadingProfile && <p className="text-sm opacity-80">Loading bookings…</p>}

          {profileError && (
            <p className="text-sm" style={{ color: "#b91c1c" }}>
              Could not load bookings: {profileError}
            </p>
          )}

          {!loadingProfile && !profileError && (
            <p className="text-sm opacity-80">
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
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">Update avatar</h2>

        <form onSubmit={handleSaveAvatar} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Image URL <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <input
              className="w-full rounded-md px-3 py-2 text-sm border"
              style={{ background: "rgba(255,255,255,0.7)" }}
              placeholder="https://example.com/my-avatar.jpg"
              value={avatarUrlInput}
              onChange={(e) => setAvatarUrlInput(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Alt text (optional)</label>
            <input
              className="w-full rounded-md px-3 py-2 text-sm border"
              style={{ background: "rgba(255,255,255,0.7)" }}
              placeholder="My avatar"
              value={avatarAltInput}
              onChange={(e) => setAvatarAltInput(e.target.value)}
            />
          </div>

          {avatarError && (
            <p className="text-sm" style={{ color: "#b91c1c" }}>
              {avatarError}
            </p>
          )}
          {avatarSuccess && <p className="text-sm">{avatarSuccess}</p>}

          <button
            type="submit"
            disabled={savingAvatar}
            className="btn btn-primary"
          >
            {savingAvatar ? "Saving..." : "Save avatar"}
          </button>
        </form>
      </section>

      {/* Upcoming bookings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming bookings</h2>

        {upcomingBookings.length === 0 ? (
          <p style={{ opacity: 0.85 }}>You have no upcoming bookings.</p>
        ) : (
          <ul className="space-y-4">
            {upcomingBookings.map((booking) => {
              const venue = booking.venue;
              const dateFrom = new Date(booking.dateFrom);
              const dateTo = new Date(booking.dateTo);

              return (
                <li key={booking.id} className="card">
                  <p className="text-sm font-semibold">
                    {venue?.name || "Unknown venue"}
                  </p>

                  <p className="text-xs" style={{ opacity: 0.8 }}>
                    {dateFrom.toLocaleDateString()} → {dateTo.toLocaleDateString()}
                  </p>

                  <p className="text-xs" style={{ opacity: 0.75 }}>
                    Guests: {booking.guests}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
