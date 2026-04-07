import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Clock, X, Download, QrCode } from "lucide-react";

const BookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // For demo purposes, using userId "1". In a real app, this would come from authentication
      const response = await axios.get("http://localhost:8080/api/bookings/user/1");
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load bookings");
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="text-yellow-500" size={20} />;
      case "APPROVED":
        return <CheckCircle className="text-green-500" size={20} />;
      case "REJECTED":
        return <XCircle className="text-red-500" size={20} />;
      case "CANCELLED":
        return <X className="text-gray-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "APPROVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      case "CANCELLED":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.put(`http://localhost:8080/api/bookings/${bookingId}/cancel`);
        fetchBookings(); // Refresh the list
        alert("Booking cancelled successfully!");
      } catch (err) {
        alert("Failed to cancel booking: " + (err.response?.data || err.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl font-semibold">Loading bookings...</div>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your resource bookings</p>
          <div className="h-1 w-24 bg-blue-600 mt-4 rounded"></div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-600 text-lg font-semibold">
              No bookings found.
            </p>
            <p className="text-gray-500 mt-2">
              Create your first booking to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Status Header */}
                <div className={`px-6 py-4 border-b-2 ${getStatusColor(booking.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className="font-bold text-sm">{booking.status}</span>
                    </div>
                    {booking.status === "APPROVED" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-4">
                  {/* Resource Name */}
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase">Resource</p>
                    <p className="text-gray-800 font-semibold">{booking.resourceName}</p>
                  </div>

                  {/* Purpose */}
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase">Purpose</p>
                    <p className="text-gray-800">{booking.purpose}</p>
                  </div>

                  {/* Attendees */}
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase">Attendees</p>
                    <p className="text-gray-800">{booking.attendees} people</p>
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase">Duration</p>
                    <div className="text-sm text-gray-800 space-y-1">
                      <p><strong>From:</strong> {new Date(booking.startTime).toLocaleString()}</p>
                      <p><strong>To:</strong> {new Date(booking.endTime).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Admin Reason */}
                  {booking.adminReason && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded">
                      <p className="text-red-700 text-xs font-bold uppercase">Admin Note</p>
                      <p className="text-red-700 text-sm mt-1">{booking.adminReason}</p>
                    </div>
                  )}

                  {/* QR Code for Approved Bookings */}
                  {booking.status === "APPROVED" && booking.qrCodeData && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="text-green-600" size={16} />
                        <p className="text-green-700 text-xs font-bold uppercase">Check-in QR Code</p>
                      </div>
                      <div className="flex flex-col items-center space-y-3">
                        <img
                          src={`data:image/png;base64,${booking.qrCodeData}`}
                          alt="Booking QR Code"
                          className="w-32 h-32 border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `data:image/png;base64,${booking.qrCodeData}`;
                            link.download = `booking-${booking.id}-qrcode.png`;
                            link.click();
                          }}
                          className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          <Download size={14} />
                          Download QR Code
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-2 text-center">
                        Present this QR code at the facility entrance for check-in
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;