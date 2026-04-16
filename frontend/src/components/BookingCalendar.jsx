import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";

const BookingCalendar = () => {
  console.log("BookingCalendar component rendered");

  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState("month"); // "month" or "week"
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Please sign in to view your calendar.");
      navigate("/signin");
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      console.log("useEffect triggered, calling fetchBookings");
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      console.log("Fetching bookings...");
      const response = await axios.get(`http://localhost:8080/api/bookings/user/${user.id}`);
      console.log("Bookings response:", response.data);
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings: " + (err.response?.data || err.message));
      setLoading(false);
    }
  };

  const getBookingsForDate = (date) => {
    return bookings.filter((booking) => {
      try {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        // Handle invalid dates
        if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime())) {
          return false;
        }

        // If end time is before start time, assume it's the next day
        if (bookingEnd < bookingStart) {
          bookingEnd.setDate(bookingEnd.getDate() + 1);
        }

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const startDate = new Date(bookingStart);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(bookingEnd);
        endDate.setHours(0, 0, 0, 0);

        return targetDate >= startDate && targetDate <= endDate;
      } catch (error) {
        console.error("Error filtering booking:", booking, error);
        return false;
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-800" };
      case "APPROVED":
        return { bg: "bg-green-100", border: "border-green-400", text: "text-green-800" };
      case "REJECTED":
        return { bg: "bg-red-100", border: "border-red-400", text: "text-red-800" };
      case "CANCELLED":
        return { bg: "bg-gray-100", border: "border-gray-400", text: "text-gray-800" };
      default:
        return { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-800" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={14} />;
      case "APPROVED":
        return <Check size={14} />;
      case "REJECTED":
        return <X size={14} />;
      case "CANCELLED":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  // Month View
  const MonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const dayBookings = getBookingsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={day.toString()}
                    className={`min-h-24 p-1 border rounded-lg transition-all ${
                      isTodayDate
                        ? "border-blue-500 bg-blue-50 border-2"
                        : isCurrentMonth
                        ? "border-gray-200 bg-white"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold mb-1 ${
                        isTodayDate
                          ? "text-blue-600"
                          : isCurrentMonth
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-0.5">
                      {dayBookings.slice(0, 2).map((booking) => {
                        const colors = getStatusColor(booking.status);
                        return (
                          <button
                            key={booking.id}
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowModal(true);
                            }}
                            className={`w-full text-left text-xs p-1 rounded border-l-2 truncate ${colors.bg} ${colors.border} ${colors.text} hover:shadow-md transition-shadow`}
                            title={booking.resourceName}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              <span className="truncate">{booking.resourceName}</span>
                            </div>
                            <div className="text-xs opacity-75">
                              {format(new Date(booking.startTime), "HH:mm")}
                            </div>
                          </button>
                        );
                      })}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Week View
  const WeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-4 overflow-x-auto">
        {/* Time slots */}
        <div className="flex gap-2">
          {/* Time column */}
          <div className="w-20 flex-shrink-0">
            <div className="font-bold text-gray-700 py-2 text-sm">Time</div>
            {Array.from({ length: 24 }).map((_, hour) => (
              <div key={hour} className="h-16 text-xs text-gray-500 py-1">
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Days columns */}
          <div className="flex gap-2 flex-grow">
            {days.map((day) => {
              const dayBookings = getBookingsForDate(day);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={`flex-1 min-w-32 border rounded-lg p-2 ${
                    isTodayDate ? "border-blue-500 border-2 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className={`text-sm font-bold mb-2 ${isTodayDate ? "text-blue-600" : "text-gray-800"}`}>
                    {format(day, "EEE")}
                    <div className="text-xs font-normal text-gray-600">
                      {format(day, "MMM d")}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="space-y-1">
                    {dayBookings.map((booking) => {
                      const colors = getStatusColor(booking.status);
                      const startHour = new Date(booking.startTime).getHours();
                      const duration = (new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60);

                      return (
                        <button
                          key={booking.id}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className={`w-full text-left text-xs p-2 rounded border-l-4 truncate hover:shadow-md transition-shadow ${colors.bg} ${colors.border} ${colors.text}`}
                          style={{
                            marginTop: `${startHour * 4}rem`,
                            minHeight: `${Math.max(duration * 4, 2)}rem`,
                          }}
                          title={booking.resourceName}
                        >
                          <div className="flex items-center gap-1 font-semibold">
                            {getStatusIcon(booking.status)}
                            <span className="truncate">{booking.resourceName}</span>
                          </div>
                          <div className="text-xs opacity-75">
                            {format(new Date(booking.startTime), "HH:mm")} -
                            {format(new Date(booking.endTime), "HH:mm")}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Detail Modal
  const DetailModal = () => {
    if (!selectedBooking) return null;

    const colors = getStatusColor(selectedBooking.status);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
          {/* Modal Header */}
          <div className={`${colors.bg} ${colors.text} px-6 py-4 border-b-4 ${colors.border}`}>
            <div className="flex items-center gap-2 text-lg font-bold">
              {getStatusIcon(selectedBooking.status)}
              {selectedBooking.status}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Resource</p>
              <p className="text-lg font-bold text-gray-800">{selectedBooking.resourceName}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Purpose</p>
              <p className="text-gray-700">{selectedBooking.purpose}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Attendees</p>
                <p className="text-gray-700">{selectedBooking.attendees}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Duration</p>
                <p className="text-gray-700">
                  {Math.round(
                    (new Date(selectedBooking.endTime) - new Date(selectedBooking.startTime)) /
                      (1000 * 60 * 60) * 10
                  ) / 10}{" "}
                  hrs
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Start Time</p>
              <p className="text-gray-700">
                {format(new Date(selectedBooking.startTime), "PPpp")}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">End Time</p>
              <p className="text-gray-700">
                {format(new Date(selectedBooking.endTime), "PPpp")}
              </p>
            </div>

            {selectedBooking.adminReason && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <p className="text-xs font-bold text-red-700 uppercase">Admin Note</p>
                <p className="text-sm text-red-700 mt-1">{selectedBooking.adminReason}</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 rounded-b-lg flex gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl font-semibold">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📅 Booking Calendar</h1>
          <p className="text-gray-600">View your bookings in a calendar format</p>
          <div className="h-1 w-24 bg-blue-600 mt-4 rounded"></div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (viewType === "month") {
                    setCurrentDate(subMonths(currentDate, 1));
                  } else {
                    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>

              <div className="text-center min-w-48">
                <h2 className="text-xl font-bold text-gray-800">
                  {viewType === "month"
                    ? format(currentDate, "MMMM yyyy")
                    : `${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`}
                </h2>
              </div>

              <button
                onClick={() => {
                  if (viewType === "month") {
                    setCurrentDate(addMonths(currentDate, 1));
                  } else {
                    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="ml-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Today
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => setViewType("month")}
                className={`px-4 py-2 font-semibold rounded transition ${
                  viewType === "month"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewType("week")}
                className={`px-4 py-2 font-semibold rounded transition ${
                  viewType === "week"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            {[
              { label: "Pending", status: "PENDING" },
              { label: "Approved", status: "APPROVED" },
              { label: "Rejected", status: "REJECTED" },
              { label: "Cancelled", status: "CANCELLED" },
            ].map(({ label, status }) => {
              const colors = getStatusColor(status);
              return (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${colors.bg} border-2 ${colors.border}`}></div>
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {viewType === "month" ? <MonthView /> : <WeekView />}
        </div>

        {/* Detail Modal */}
        {showModal && <DetailModal />}
      </div>
    </div>
  );
};

export default BookingCalendar;
