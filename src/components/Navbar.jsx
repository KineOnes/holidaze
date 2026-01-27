// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  // TODO: replace these with real auth state later
  const isLoggedIn = false; // change when auth is done
  const isVenueManager = false; // change when auth is done

  const [isOpen, setIsOpen] = useState(false);

  // Electric Rose palette
  const NAV_BG = "#ec1763";
  const NAV_BG_ACTIVE = "#f03a7a";
  const TEXT = "#ffe4ef";

  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors";

  // We use inline styles for the colors so you don't have to fight Tailwind defaults
  function navClass({ isActive }) {
    return `${linkBase} ${isActive ? "font-semibold" : ""}`;
  }

  function linkStyle(isActive) {
    return {
      color: TEXT,
      backgroundColor: isActive ? NAV_BG_ACTIVE : "transparent",
    };
  }

  return (
    <nav
      className="border-b backdrop-blur sticky top-0 z-50"
      style={{
        backgroundColor: NAV_BG,
        borderColor: "rgba(255,228,239,0.25)", // soft light pink border
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: logo / brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-900 font-bold">
                H
              </span>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ color: TEXT }}
              >
                Holidaze
              </span>
            </NavLink>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/venues"
              className={navClass}
              style={({ isActive }) => linkStyle(isActive)}
              onMouseEnter={(e) => {
                if (e.currentTarget.style.backgroundColor === "transparent") {
                  e.currentTarget.style.backgroundColor = NAV_BG_ACTIVE;
                }
              }}
              onMouseLeave={(e) => {
                // Only reset if it wasn't active
                if (e.currentTarget.getAttribute("aria-current") !== "page") {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              Browse venues
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/profile"
                  className={navClass}
                  style={({ isActive }) => linkStyle(isActive)}
                  onMouseEnter={(e) => {
                    if (e.currentTarget.style.backgroundColor === "transparent") {
                      e.currentTarget.style.backgroundColor = NAV_BG_ACTIVE;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget.getAttribute("aria-current") !== "page") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  Profile
                </NavLink>

                {isVenueManager && (
                  <>
                    <NavLink
                      to="/manage/venues"
                      className={navClass}
                      style={({ isActive }) => linkStyle(isActive)}
                      onMouseEnter={(e) => {
                        if (e.currentTarget.style.backgroundColor === "transparent") {
                          e.currentTarget.style.backgroundColor = NAV_BG_ACTIVE;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (e.currentTarget.getAttribute("aria-current") !== "page") {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      Manage venues
                    </NavLink>

                    <NavLink
                      to="/manage/bookings"
                      className={navClass}
                      style={({ isActive }) => linkStyle(isActive)}
                      onMouseEnter={(e) => {
                        if (e.currentTarget.style.backgroundColor === "transparent") {
                          e.currentTarget.style.backgroundColor = NAV_BG_ACTIVE;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (e.currentTarget.getAttribute("aria-current") !== "page") {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
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
                  style={({ isActive }) => linkStyle(isActive)}
                  onMouseEnter={(e) => {
                    if (e.currentTarget.style.backgroundColor === "transparent") {
                      e.currentTarget.style.backgroundColor = NAV_BG_ACTIVE;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget.getAttribute("aria-current") !== "page") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={navClass}
                  style={({ isActive }) => linkStyle(isActive)}
                  onMouseEnter={(e) => {
                    if (e.currentTarget.style.backgroundColor === "transparent") {
                      e.currentTarget.style.backgroundColor = NAV_BG_ACTIVE;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget.getAttribute("aria-current") !== "page") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
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
              className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2"
              style={{
                color: TEXT,
                border: "1px solid rgba(255,228,239,0.35)",
              }}
            >
              <span className="sr-only">Open main menu</span>

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
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: NAV_BG,
            borderColor: "rgba(255,228,239,0.25)",
          }}
        >
          <div className="space-y-1 px-2 pt-2 pb-3">
            <NavLink
              to="/venues"
              className={navClass}
              style={({ isActive }) => linkStyle(isActive)}
              onClick={() => setIsOpen(false)}
            >
              Browse venues
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/profile"
                  className={navClass}
                  style={({ isActive }) => linkStyle(isActive)}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </NavLink>

                {isVenueManager && (
                  <>
                    <NavLink
                      to="/manage/venues"
                      className={navClass}
                      style={({ isActive }) => linkStyle(isActive)}
                      onClick={() => setIsOpen(false)}
                    >
                      Manage venues
                    </NavLink>

                    <NavLink
                      to="/manage/bookings"
                      className={navClass}
                      style={({ isActive }) => linkStyle(isActive)}
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
                  style={({ isActive }) => linkStyle(isActive)}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={navClass}
                  style={({ isActive }) => linkStyle(isActive)}
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
