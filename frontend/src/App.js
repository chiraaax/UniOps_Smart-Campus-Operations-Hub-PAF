import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import BookingCalendar from "./components/BookingCalendar";
import Navbar from "./components/NavBar";
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