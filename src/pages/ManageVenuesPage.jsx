// src/pages/ManageVenuesPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchManagedVenues, createVenue } from "../api/holidaze.js";

export default function ManageVenuesPage() {
  const { user, token, venueManager } = useAuth();

  // List of venues the user owns
  const [managedVenues, setManagedVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [venuesError, setVenuesError] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrls, setMediaUrls] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Load managed venues
  useEffect(() => {
    if (!user || !token) return;
    if (!venueManager) {
      setManagedVenues([]);
      setLoadingVenues(false);
      return;
    }

    async function loadManagedVenues() {
      setLoadingVenues(true);
      setVenuesError(null);

      try {
        const venues = await fetchManagedVenues(user.name, token);
        setManagedVenues(venues);
      } catch (err) {
        console.error(err);
        setVenuesError(err.message);
      } finally {
        setLoadingVenues(false);
      }
    }

    loadManagedVenues();
  }, [user, token, venueManager]);

  async function handleCreateVenue(event) {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!venueManager) {
      setSubmitError("Only venue managers can create venues.");
      return;
    }

    if (!name.trim() || !description.trim()) {
      setSubmitError("Name and description are required.");
      return;
    }

    const maxGuestsNumber = Number(maxGuests);
    const priceNumber = Number(price);

    if (!Number.isFinite(maxGuestsNumber) || maxGuestsNumber <= 0) {
      setSubmitError("Max guests must be a positive number.");
      return;
    }

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setSubmitError("Price must be a positive number.");
      return;
    }

    // Turn comma-separated URLs into media objects
    const media = mediaUrls
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url, index) => ({
        url,
        alt: `${name} image ${index + 1}`,
      }));

    const venueData = {
      name: name.trim(),
      description: description.trim(),
      price: priceNumber,
      maxGuests: maxGuestsNumber,
      media,
      meta: {
        wifi,
        parking,
        breakfast,
        pets,
      },
      location: {
        address: "",
        city: city.trim() || "Unknown city",
        country: country.trim() || "Unknown country",
      },
    };

    try {
      setSubmitting(true);
      const created = await createVenue(token, venueData);

      // Add new venue at top of list
      setManagedVenues((prev) => [created, ...prev]);

      // Clear form
      setName("");
      setMaxGuests("");
      setPrice("");
      setDescription("");
      setMediaUrls("");
      setCity("");
      setCountry("");
      setWifi(false);
      setParking(false);
      setBreakfast(false);
      setPets(false);

      setSubmitSuccess("Venue created successfully!");
    } catch (err) {
      console.error(err);
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Manage venues</h1>
          <p className="text-slate-300">
            View and manage the venues you own.
          </p>
          {!venueManager && (
            <p className="text-sm text-amber-400">
              You are currently a customer account. Only venue managers can
              create and manage venues.
            </p>
          )}
        </header>

        {/* Create venue form */}
        {venueManager && (
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Create a new venue</h2>

            <form onSubmit={handleCreateVenue} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Price per night (NOK){" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Max guests <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Media URLs (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    value={mediaUrls}
                    onChange={(e) => setMediaUrls(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">City</label>
                  <input
                    type="text"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">Country</label>
                  <input
                    type="text"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-slate-100">
                    Amenities
                  </legend>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-200">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-900"
                        checked={wifi}
                        onChange={(e) => setWifi(e.target.checked)}
                      />
                      Wi-Fi
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-900"
                        checked={parking}
                        onChange={(e) => setParking(e.target.checked)}
                      />
                      Parking
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-900"
                        checked={breakfast}
                        onChange={(e) => setBreakfast(e.target.checked)}
                      />
                      Breakfast
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-900"
                        checked={pets}
                        onChange={(e) => setPets(e.target.checked)}
                      />
                      Pets allowed
                    </label>
                  </div>
                </fieldset>
              </div>

              {submitError && (
                <p className="text-sm text-red-400">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-sm text-emerald-400">{submitSuccess}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating venue…" : "Create venue"}
              </button>
            </form>
          </section>
        )}

        {/* Managed venues list */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your venues</h2>

          {loadingVenues && (
            <p className="text-sm text-slate-300">Loading your venues…</p>
          )}

          {venuesError && (
            <p className="text-sm text-red-400">
              Could not load your venues: {venuesError}
            </p>
          )}

          {!loadingVenues && !venuesError && managedVenues.length === 0 && (
            <p className="text-sm text-slate-300">
              You don&apos;t manage any venues yet. Once you create a venue, it
              will appear here.
            </p>
          )}

          {!loadingVenues && !venuesError && managedVenues.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {managedVenues.map((venue) => (
                <article
                  key={venue.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-2"
                >
                  <h3 className="font-semibold text-lg">{venue.name}</h3>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {venue.description}
                  </p>
                  <p className="text-sm text-slate-200">
                    {venue.price} NOK / night • Max {venue.maxGuests} guests
                  </p>
                  {venue.location?.city && (
                    <p className="text-xs text-slate-400">
                      {venue.location.city}, {venue.location.country}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
