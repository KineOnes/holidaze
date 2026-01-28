import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, venueManager, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const baseLink =
    "px-3 py-2 rounded-md text-sm font-medium transition";
  const inactive =
    "text-pink-100 hover:bg-pink-600/30";
  const active =
    "bg-pink-100 text-pink-700";

  function navClass({ isActive }) {
    return `${baseLink} ${isActive ? active : inactive}`;
  }

  return (
    <nav className="bg-pink-600 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-3xl font-script text-pink-100 tracking-wide">
            Holidaze
          </Link>

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

                {venueManager && (
                  <>
                    <NavLink to="/manage/venues" className={navClass}>
                      Manage venues
                    </NavLink>
                    <NavLink to="/manage/bookings" className={navClass}>
                      Manage bookings
                    </NavLink>
                  </>
                )}

                <span className="text-pink-100 text-sm px-2">
                  {user?.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-md bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200"
                >
                  Log out
                </button>
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

          {/* Mobile button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-pink-100"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-pink-700 px-4 pb-4 space-y-2">
          <NavLink to="/venues" className={navClass} onClick={() => setIsOpen(false)}>
            Browse venues
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className={navClass} onClick={() => setIsOpen(false)}>
                Profile
              </NavLink>

              {venueManager && (
                <>
                  <NavLink to="/manage/venues" className={navClass} onClick={() => setIsOpen(false)}>
                    Manage venues
                  </NavLink>
                  <NavLink to="/manage/bookings" className={navClass} onClick={() => setIsOpen(false)}>
                    Manage bookings
                  </NavLink>
                </>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md bg-pink-100 text-pink-700 font-semibold"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass} onClick={() => setIsOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass} onClick={() => setIsOpen(false)}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
