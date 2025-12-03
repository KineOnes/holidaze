// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  // TODO: replace these with real auth state later
  const isLoggedIn = false;       // change when auth is done
  const isVenueManager = false;   // change when auth is done

  const [isOpen, setIsOpen] = useState(false);

  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const linkInactive = "text-slate-200 hover:text-white hover:bg-slate-700/60";
  const linkActive = "bg-slate-100 text-slate-900";

  function navClass({ isActive }) {
    return `${linkBase} ${isActive ? linkActive : linkInactive}`;
  }

  return (
    <nav className="bg-slate-900/80 border-b border-slate-700 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: logo / brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-900 font-bold">
                H
              </span>
              <span className="text-lg font-semibold text-slate-50 tracking-tight">
                Holidaze
              </span>
            </NavLink>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/venues" className={navClass}>
              Browse venues
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink to="/profile" className={navClass}>
                  Profile
                </NavLink>

                {isVenueManager && (
                  <>
                    <NavLink to="/manage/venues" className={navClass}>
                      Manage venues
                    </NavLink>
                    <NavLink to="/manage/bookings" className={navClass}>
                      Manage bookings
                    </NavLink>
                  </>
                )}
              </>
            )}

            {!isLoggedIn && (
              <>
                <NavLink to="/login" className={navClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navClass}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-slate-700/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon: hamburger / close */}
              {isOpen ? (
                // X icon
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900/95 backdrop-blur">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <NavLink to="/venues" className={navClass} onClick={() => setIsOpen(false)}>
              Browse venues
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/profile"
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </NavLink>

                {isVenueManager && (
                  <>
                    <NavLink
                      to="/manage/venues"
                      className={navClass}
                      onClick={() => setIsOpen(false)}
                    >
                      Manage venues
                    </NavLink>
                    <NavLink
                      to="/manage/bookings"
                      className={navClass}
                      onClick={() => setIsOpen(false)}
                    >
                      Manage bookings
                    </NavLink>
                  </>
                )}
              </>
            )}

            {!isLoggedIn && (
              <>
                <NavLink
                  to="/login"
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
