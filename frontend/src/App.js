import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import BookingCalendar from "./components/BookingCalendar";
import AdminBookings from "./components/AdminBookings";
import AdminVerification from "./components/AdminVerification";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<BookingForm />} />
            <Route path="/status" element={<BookingStatus />} />
            <Route path="/calendar" element={<BookingCalendar />} />
            <Route path="/admin" element={<AdminBookings />} />
            <Route path="/admin/verify" element={<AdminVerification />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;