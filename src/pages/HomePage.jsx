import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center">
      <section className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Welcome to <span style={{ color: "#1f3b8a" }}>Holidaze</span>
        </h1>

        <p className="text-lg" style={{ opacity: 0.85 }}>
          Discover unique places to stay, book your next holiday,
          or manage venues as a host.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/venues"
            className="px-6 py-3 rounded-md font-semibold"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            Browse venues
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-md border font-medium"
            style={{ background: "rgba(255,255,255,0.20)" }}
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
