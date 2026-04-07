import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Users, FileText, Box } from "lucide-react";

const BookingForm = () => {
  const [form, setForm] = useState({
    resourceName: "",
    purpose: "",
    attendees: 0,
    startTime: "",
    endTime: "",
    userId: "1"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/bookings", form);
      alert("Booking Created Successfully!");
      console.log(res.data);

      setForm({
        resourceName: "",
        purpose: "",
        attendees: 0,
        startTime: "",
        endTime: "",
        userId: "1"
      });
    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">

      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')"
        }}
      ></div>

      {/* Glass Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-4xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 text-white"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-wide">
            Resource Booking
          </h1>
          <p className="text-blue-200 mt-2">
            Smart Campus Operations Hub
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Resource Name */}
          <div className="relative">
            <Box className="absolute left-3 top-3 text-blue-300" />
            <input
              type="text"
              placeholder="Resource Name"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.resourceName}
              onChange={(e) =>
                setForm({ ...form, resourceName: e.target.value })
              }
              required
            />
          </div>

          {/* Purpose */}
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-blue-300" />
            <input
              type="text"
              placeholder="Purpose"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.purpose}
              onChange={(e) =>
                setForm({ ...form, purpose: e.target.value })
              }
              required
            />
          </div>

          {/* Attendees */}
          <div className="relative">
            <Users className="absolute left-3 top-3 text-blue-300" />
            <input
              type="number"
              placeholder="Attendees"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.attendees}
              onChange={(e) =>
                setForm({ ...form, attendees: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>

          {/* Start Time */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-blue-300" />
            <input
              type="datetime-local"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.startTime}
              onChange={(e) =>
                setForm({ ...form, startTime: e.target.value })
              }
              required
            />
          </div>

          {/* End Time */}
          <div className="relative md:col-span-2">
            <Calendar className="absolute left-3 top-3 text-blue-300" />
            <input
              type="datetime-local"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.endTime}
              onChange={(e) =>
                setForm({ ...form, endTime: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition transform rounded-lg font-bold shadow-lg"
          >
            Submit Booking
          </button>

          <Link
            to="/status"
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg text-center font-bold"
          >
            View Bookings
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;