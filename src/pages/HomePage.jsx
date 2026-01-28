import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center">
      <section className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Welcome to{" "}
          <span className="brand-logo text-5xl align-middle">
            Holidaze
          </span>
        </h1>

        <p className="text-lg opacity-80">
          Discover unique places to stay, book your next holiday,
          or manage venues as a host.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link to="/venues" className="btn btn-primary">
            Browse venues
          </Link>

          <Link to="/login" className="btn btn-soft">
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
