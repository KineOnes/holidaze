// src/App.jsx
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import VenuesPage from "./pages/VenuesPage.jsx";
import VenueDetailsPage from "./pages/VenueDetailsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ManageVenuesPage from "./pages/ManageVenuesPage.jsx";
import ManageBookingsPage from "./pages/ManageBookingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navbar />

      {/* Padding so content doesn't sit under sticky navbar */}
      <div className="pt-20">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/venues/:id" element={<VenueDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage/venues"
            element={
              <ProtectedRoute>
                <ManageVenuesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage/bookings"
            element={
              <ProtectedRoute>
                <ManageBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
