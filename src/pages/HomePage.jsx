import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-50 flex items-center">
      <section className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-emerald-400">Holidaze</span>
        </h1>

        <p className="text-slate-300 text-lg">
          Discover unique places to stay, book your next holiday,
          or manage venues as a host.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/venues"
            className="px-6 py-3 rounded-md bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
          >
            Browse venues
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-md border border-slate-600 hover:bg-slate-800"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
