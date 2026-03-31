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
    <form onSubmit={handleSubmit}>
      <input placeholder="Resource" onChange={e => setForm({...form, resourceName: e.target.value})} />
      <input placeholder="Purpose" onChange={e => setForm({...form, purpose: e.target.value})} />
      <input type="number" placeholder="Attendees" onChange={e => setForm({...form, attendees: e.target.value})} />
      <input type="datetime-local" onChange={e => setForm({...form, startTime: e.target.value})} />
      <input type="datetime-local" onChange={e => setForm({...form, endTime: e.target.value})} />

      <button type="submit">Book</button>
    </form>
  );
};

export default BookingForm;