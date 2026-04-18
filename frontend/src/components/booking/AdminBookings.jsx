import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../utils/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/bookings');
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await apiClient.put(`/api/bookings/${bookingId}/approve`);
      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'APPROVED' }
          : booking
      ));
    } catch (err) {
      alert('Failed to approve booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (bookingId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await apiClient.put(`/api/bookings/${bookingId}/reject`, null, {
        params: { reason: rejectReason.trim() }
      });
      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'REJECTED', adminReason: rejectReason.trim() }
          : booking
      ));
      setRejectReason('');
      setRejectingId(null);
    } catch (err) {
      alert('Failed to reject booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter ? booking.status === statusFilter : true;
      const matchesResource = resourceFilter
        ? booking.resourceName?.toLowerCase().includes(resourceFilter.toLowerCase())
        : true;
      const matchesUser = userFilter
        ? booking.userId?.toString().toLowerCase().includes(userFilter.toLowerCase())
        : true;
      const bookingStart = new Date(booking.startTime);
      const afterStartDate = startDateFilter ? bookingStart >= new Date(startDateFilter) : true;
      const beforeEndDate = endDateFilter ? bookingStart <= new Date(endDateFilter) : true;

      return matchesStatus && matchesResource && matchesUser && afterStartDate && beforeEndDate;
    });
  }, [bookings, statusFilter, resourceFilter, userFilter, startDateFilter, endDateFilter]);

  const resetFilters = () => {
    setStatusFilter('');
    setResourceFilter('');
    setUserFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin - Booking Management</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm bg-white"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Resource</label>
              <input
                type="text"
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                placeholder="Search resource"
                className="w-full rounded-lg border-gray-300 text-sm bg-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">User ID</label>
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Search user"
                className="w-full rounded-lg border-gray-300 text-sm bg-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm bg-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm bg-white px-3 py-2"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Reset Filters
            </button>
            <p className="text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.resourceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDateTime(booking.startTime)}</div>
                    <div className="text-xs">to {formatDateTime(booking.endTime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.attendees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    {booking.adminReason && (
                      <div className="text-xs text-gray-500 mt-1">
                        Reason: {booking.adminReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === 'PENDING' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                        {rejectingId === booking.id ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Rejection reason..."
                              className="border px-2 py-1 text-xs w-32"
                              autoFocus
                            />
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason('');
                              }}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRejectingId(booking.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {bookings.length === 0
              ? 'No bookings found'
              : 'No bookings match the current filters.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
