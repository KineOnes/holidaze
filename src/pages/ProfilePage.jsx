// src/pages/ProfilePage.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, isLoggedIn, venueManager, logout } = useAuth();
  const navigate = useNavigate();

  // Just in case this page is ever reached without auth
  if (!isLoggedIn || !user) {
    navigate("/login");
    return null;
  }

  const avatarUrl = user.avatar?.url;
  const avatarAlt = user.avatar?.alt || user.name;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50">
      <section className="max-w-3xl mx-auto px-4 py-10">
        <header className="flex items-center gap-6 mb-8">
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
            <h2 className="text-lg font-semibold mb-2">Activity</h2>
            <p className="text-sm text-slate-300">
              Later we’ll show upcoming bookings and your venues here.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
