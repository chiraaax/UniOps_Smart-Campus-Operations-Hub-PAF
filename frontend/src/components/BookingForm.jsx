import React, { useState } from "react";
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
      alert("Booking Created!");
      console.log(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 p-6">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white tracking-wide">
          📅 Book Resource
        </h2>
        <p className="text-center text-slate-300 text-sm">
          Reserve rooms, labs, or equipment easily
        </p>

        {/* Resource */}
        <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition">
          <Box className="text-emerald-400" size={18} />
          <input
            placeholder="Resource Name"
            className="bg-transparent w-full outline-none text-white placeholder-gray-400"
            onChange={(e) =>
              setForm({ ...form, resourceName: e.target.value })
            }
          />
        </div>

        {/* Purpose */}
        <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition">
          <FileText className="text-emerald-400" size={18} />
          <input
            placeholder="Purpose"
            className="bg-transparent w-full outline-none text-white placeholder-gray-400"
            onChange={(e) =>
              setForm({ ...form, purpose: e.target.value })
            }
          />
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition">
          <Users className="text-emerald-400" size={18} />
          <input
            type="number"
            placeholder="Number of Attendees"
            className="bg-transparent w-full outline-none text-white placeholder-gray-400"
            onChange={(e) =>
              setForm({ ...form, attendees: e.target.value })
            }
          />
        </div>

        {/* Start Time */}
        <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition">
          <Calendar className="text-emerald-400" size={18} />
          <input
            type="datetime-local"
            className="bg-transparent w-full outline-none text-white"
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
          />
        </div>

        {/* End Time */}
        <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition">
          <Calendar className="text-emerald-400" size={18} />
          <input
            type="datetime-local"
            className="bg-transparent w-full outline-none text-white"
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white 
          bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
          hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40
          transition duration-300 ease-in-out"
        >
          🚀 Book Now
        </button>

      </form>
    </div>
  );
};

export default BookingForm;