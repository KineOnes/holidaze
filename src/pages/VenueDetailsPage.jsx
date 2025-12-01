import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchVenue } from "../api/holidaze";

export default function VenueDetailsPage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVenue() {
      try {
        const data = await fetchVenue(id);
        setVenue(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!venue) return <p className="text-white p-6">Venue not found.</p>;

  return (
    <div className="text-white max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
      <img
        src={venue.media?.[0]?.url}
        alt={venue.media?.[0]?.alt || venue.name}
        className="rounded-xl mb-6 w-full"
      />
      <p className="opacity-80">{venue.description}</p>

      <div className="mt-6 text-lg">
        <p>
          <strong>Price:</strong> {venue.price} NOK/night
        </p>
        <p>
          <strong>Max Guests:</strong> {venue.maxGuests}
        </p>
      </div>
    </div>
  );
}
