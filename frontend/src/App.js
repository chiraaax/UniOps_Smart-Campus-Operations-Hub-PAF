import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import BookingForm from "./components/booking/BookingForm";
import BookingStatus from "./components/booking/BookingStatus";
import BookingCalendar from "./components/booking/BookingCalendar";
import AdminBookings from "./components/booking/AdminBookings";
import AdminVerification from "./components/booking/AdminVerification";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import AdminDashboard from "./components/booking/AdminDashboard";
import TechnicianDashboard from "./components/TechnicianDashboard";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import FacilitiesListPage from "./pages/facilities/FacilitiesListPage";
import FacilityDetailPage from "./pages/facilities/FacilityDetailPage";
import FacilityFormPage from "./pages/facilities/FacilityFormPage";
import AssetsListPage from "./pages/assets/AssetsListPage";
import AssetDetailPage from "./pages/assets/AssetDetailPage";
import AssetFormPage from "./pages/assets/AssetFormPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            {/* Dashboard as the main landing page */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin & Technician Dashboards */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/technician-dashboard"
              element={<TechnicianDashboard />}
            />

            {/* User Profile Page */}
            <Route path="/profile" element={<Profile />} />

            {/* Separate Booking Page */}
            <Route path="/booking" element={<BookingForm />} />

            {/* Auth Pages */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Other routes */}
            <Route path="/status" element={<BookingStatus />} />
            <Route path="/calendar" element={<BookingCalendar />} />
            <Route path="/admin" element={<Navigate to="/admin/bookings" replace />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/verify" element={<AdminVerification />} />
            <Route path="/facilities" element={<FacilitiesListPage />} />
            <Route path="/facilities/new" element={<FacilityFormPage />} />
            <Route path="/facilities/:id" element={<FacilityDetailPage />} />
            <Route path="/assets" element={<AssetsListPage />} />
            <Route path="/assets/new" element={<AssetFormPage />} />
            <Route path="/assets/:id" element={<AssetDetailPage />} />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
