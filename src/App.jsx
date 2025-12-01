import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import VenuesPage from './pages/VenuesPage.jsx';
import VenueDetailsPage from './pages/VenueDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ManageVenuesPage from './pages/ManageVenuesPage.jsx';
import ManageBookingsPage from './pages/ManageBookingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/venues" element={<VenuesPage />} />
      <Route path="/venues/:id" element={<VenueDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/manage/venues" element={<ManageVenuesPage />} />
      <Route path="/manage/bookings" element={<ManageBookingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
