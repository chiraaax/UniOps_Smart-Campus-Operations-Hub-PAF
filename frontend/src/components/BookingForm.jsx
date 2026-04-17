import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Users, FileText, Box, ArrowLeft, Send } from "lucide-react";

const BookingForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    resourceName: "",
    purpose: "",
    attendees: 0,
    startTime: "",
    endTime: "",
    userId: "",
  });
  const [facilities, setFacilities] = useState([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);
  const [facilityError, setFacilityError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Please sign in to book resources.");
      navigate("/signin");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setForm((prev) => ({ ...prev, userId: parsedUser.id || "" }));

    const fetchFacilities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/facilities?page=0&size=100&sort=name,asc"
        );
        const facilityList = response.data?.content || [];
        setFacilities(facilityList);

        setForm((prev) => {
          if (!prev.resourceName && facilityList.length > 0) {
            return { ...prev, resourceName: facilityList[0].name };
          }
          return prev;
        });
      } catch (err) {
        setFacilityError(
          "Unable to load facility list: " + (err.response?.data || err.message)
        );
      } finally {
        setIsLoadingFacilities(false);
      }
    };

    fetchFacilities();
  }, [navigate]);

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
        userId: form.userId,
      });
      navigate("/status");
    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-6 pt-24">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')",
        }}
      ></div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {/* Glass Card */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 text-white"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-wide">
              Resource Booking
            </h1>
            <p className="text-blue-200 mt-2 font-light italic">
              Reserve your campus facilities instantly
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resource Name */}
            <div className="relative">
              <Box className="absolute left-3 top-3 text-blue-300" />
              {facilities.length > 0 ? (
                <select
                  className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  value={form.resourceName}
                  onChange={(e) =>
                    setForm({ ...form, resourceName: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    {isLoadingFacilities
                      ? "Loading facilities..."
                      : "Select a facility resource"}
                  </option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.name}>
                      {facility.name}
                      {facility.location ? ` — ${facility.location}` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Resource Name (e.g. Lab A)"
                  className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={form.resourceName}
                  onChange={(e) =>
                    setForm({ ...form, resourceName: e.target.value })
                  }
                  required
                />
              )}
              {facilityError && (
                <p className="mt-2 text-sm text-red-300">{facilityError}</p>
              )}
            </div>

            {/* Purpose */}
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-blue-300" />
              <input
                type="text"
                placeholder="Purpose of Booking"
                className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                required
              />
            </div>

            {/* Attendees */}
            <div className="relative col-span-2 md:col-span-1">
              <Users className="absolute left-3 top-3 text-blue-300" />
              <input
                type="number"
                placeholder="Number of Attendees"
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
            <div className="relative col-span-2 md:col-start-2">
              <Calendar className="absolute left-3 top-3 text-blue-300" />
              <input
                type="datetime-local"
                className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-blue-900/50"
          >
            <Send size={20} /> Create Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
