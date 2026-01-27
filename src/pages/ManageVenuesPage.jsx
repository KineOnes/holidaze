import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchManagedVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../api/holidaze.js";

export default function ManageVenuesPage() {
  const { user, token, isLoggedIn, venueManager } = useAuth();
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [mediaUrls, setMediaUrls] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    if (isLoggedIn && !venueManager) navigate("/profile");
  }, [isLoggedIn, venueManager, navigate]);

  useEffect(() => {
    if (!user?.name || !token) return;

    async function load() {
      setLoading(true);
      setPageError(null);

      try {
        const data = await fetchManagedVenues(user.name, token);
        setVenues(data || []);
      } catch (err) {
        console.error(err);
        setPageError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.name, token]);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setMaxGuests("");
    setMediaUrls("");
    setCity("");
    setCountry("");
    setWifi(false);
    setParking(false);
    setBreakfast(false);
    setPets(false);
  }

  function venueToForm(v) {
    setEditingId(v.id);
    setName(v.name || "");
    setDescription(v.description || "");
    setPrice(v.price ?? "");
    setMaxGuests(v.maxGuests ?? "");
    setCity(v.location?.city || "");
    setCountry(v.location?.country || "");

    setWifi(Boolean(v.meta?.wifi));
    setParking(Boolean(v.meta?.parking));
    setBreakfast(Boolean(v.meta?.breakfast));
    setPets(Boolean(v.meta?.pets));

    const urls = Array.isArray(v.media)
      ? v.media.map((m) => m?.url).filter(Boolean).join(", ")
      : "";
    setMediaUrls(urls);
  }

  function buildVenuePayload() {
    const media = mediaUrls
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url) => ({ url, alt: "" }));

    return {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      maxGuests: Number(maxGuests),
      media,
      meta: { wifi, parking, breakfast, pets },
      location: {
        city: city.trim() || undefined,
        country: country.trim() || undefined,
      },
    };
  }

  async function refreshVenues() {
    const data = await fetchManagedVenues(user.name, token);
    setVenues(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPageError(null);
    setSuccessMsg(null);

    if (!name.trim()) return setPageError("Name is required.");
    if (!description.trim()) return setPageError("Description is required.");

    const priceNum = Number(price);
    const maxGuestsNum = Number(maxGuests);

    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return setPageError("Price must be a number greater than 0.");
    }
    if (!Number.isFinite(maxGuestsNum) || maxGuestsNum <= 0) {
      return setPageError("Max guests must be a number greater than 0.");
    }

    setSaving(true);
    try {
      const payload = buildVenuePayload();

      if (isEditing) {
        await updateVenue(editingId, token, payload);
        setSuccessMsg("Venue updated ✅");
      } else {
        await createVenue(token, payload);
        setSuccessMsg("Venue created ✅");
      }

      await refreshVenues();
      resetForm();
    } catch (err) {
      console.error(err);
      setPageError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(venueId, venueName) {
    setPageError(null);
    setSuccessMsg(null);

    const ok = window.confirm(`Delete "${venueName}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await deleteVenue(venueId, token);
      setSuccessMsg("Venue deleted ✅");
      if (editingId === venueId) resetForm();
      await refreshVenues();
    } catch (err) {
      console.error(err);
      setPageError(err.message || "Failed to delete venue.");
    }
  }

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Manage venues</h1>
          <p style={{ opacity: 0.85 }}>
            Create new venues, or edit/delete venues you own.
          </p>
        </header>

        {/* Form */}
        <section className="card">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit venue" : "Create a new venue"}
            </h2>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm rounded-md px-3 py-1.5 border"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">
                  Name <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  className="mt-1 w-full rounded-md px-3 py-2 border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Venue name"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Price per night (NOK) <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md px-3 py-2 border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 899"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Max guests <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md px-3 py-2 border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  placeholder="e.g. 4"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Media URLs (comma separated)</label>
                <input
                  className="mt-1 w-full rounded-md px-3 py-2 border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={mediaUrls}
                  onChange={(e) => setMediaUrls(e.target.value)}
                  placeholder="https://...jpg, https://...png"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Description <span style={{ color: "#b91c1c" }}>*</span>
              </label>
              <textarea
                className="mt-1 w-full rounded-md px-3 py-2 min-h-28 border"
                style={{ background: "rgba(255,255,255,0.7)" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people about your venue..."
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  className="mt-1 w-full rounded-md px-3 py-2 border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bergen"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Country</label>
                <input
                  className="mt-1 w-full rounded-md px-3 py-2 border"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Norway"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Amenities</p>
              <div className="flex flex-wrap gap-4 text-sm" style={{ opacity: 0.9 }}>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} />
                  Wi-Fi
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} />
                  Parking
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} />
                  Breakfast
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={pets} onChange={(e) => setPets(e.target.checked)} />
                  Pets allowed
                </label>
              </div>
            </div>

            {pageError && (
              <p className="text-sm rounded-md p-2 border" style={{ color: "#b91c1c", background: "rgba(185,28,28,0.08)" }}>
                {pageError}
              </p>
            )}
            {successMsg && (
              <p className="text-sm rounded-md p-2 border" style={{ background: "rgba(0,0,0,0.08)" }}>
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-fit rounded-md px-5 py-2 font-semibold disabled:opacity-60"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              {saving
                ? isEditing
                  ? "Saving…"
                  : "Creating…"
                : isEditing
                ? "Save changes"
                : "Create venue"}
            </button>
          </form>
        </section>

        {/* List */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Your venues</h2>

          {loading && <p style={{ opacity: 0.85 }}>Loading venues…</p>}
          {!loading && venues.length === 0 && (
            <p style={{ opacity: 0.85 }}>You don’t own any venues yet.</p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {venues.map((v) => (
              <article key={v.id} className="card space-y-2">
                <h3 className="text-lg font-semibold">{v.name}</h3>
                <p className="text-sm line-clamp-2" style={{ opacity: 0.85 }}>
                  {v.description}
                </p>

                <p className="text-sm">
                  <span className="font-semibold">{v.price} NOK</span> / night · Max{" "}
                  {v.maxGuests} guests
                </p>

                <p className="text-xs" style={{ opacity: 0.75 }}>
                  {v.location?.city ? `${v.location.city}, ` : ""}
                  {v.location?.country || ""}
                </p>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => venueToForm(v)}
                    className="text-sm rounded-md px-3 py-1.5 border"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(v.id, v.name)}
                    className="text-sm rounded-md px-3 py-1.5 border"
                    style={{ background: "rgba(185,28,28,0.08)", color: "#b91c1c" }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
