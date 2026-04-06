import React, { useState } from "react";
import axios from "axios";

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
      alert("Error: " + err.response.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 border border-emerald-700 rounded-2xl p-6 shadow-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-emerald-400 text-center">
          Book Resource
        </h2>

        {/* Resource */}
        <input
          placeholder="Resource Name"
          className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-emerald-500 outline-none"
          onChange={(e) =>
            setForm({ ...form, resourceName: e.target.value })
          }
        />

        {/* Purpose */}
        <input
          placeholder="Purpose"
          className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-emerald-500 outline-none"
          onChange={(e) =>
            setForm({ ...form, purpose: e.target.value })
          }
        />

        {/* Attendees */}
        <input
          type="number"
          placeholder="Number of Attendees"
          className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-emerald-500 outline-none"
          onChange={(e) =>
            setForm({ ...form, attendees: e.target.value })
          }
        />

        {/* Start Time */}
        <input
          type="datetime-local"
          className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-emerald-500 outline-none"
          onChange={(e) =>
            setForm({ ...form, startTime: e.target.value })
          }
        />

        {/* End Time */}
        <input
          type="datetime-local"
          className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-emerald-500 outline-none"
          onChange={(e) =>
            setForm({ ...form, endTime: e.target.value })
          }
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 shadow-md shadow-emerald-500/30"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookingForm;