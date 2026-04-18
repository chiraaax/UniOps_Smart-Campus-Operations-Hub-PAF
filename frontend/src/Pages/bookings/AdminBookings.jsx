import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await bookingService.getAllBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, newStatus) => {
        try {
            await bookingService.updateBookingStatus(id, newStatus);
            alert(`Booking ${newStatus} successfully!`);
            loadBookings(); // Refresh the list
        } catch (error) {
            alert("Error updating booking status.");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#084298', fontFamily: 'sans-serif' }}>Loading Bookings...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#084298', marginBottom: '20px' }}>Booking Management</h1>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>Review and process student resource requests.</p>

            {bookings.length === 0 ? (
                <div style={{ backgroundColor: 'white', padding: '40px', textAlign: 'center', borderRadius: '10px', border: '1px solid #cfe2ff' }}>
                    No bookings found in the system.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: `1px solid ${booking.status === 'PENDING' ? '#ffc107' : '#cfe2ff'}`, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#084298' }}>{booking.facilityName}</h3>
                                <p style={{ margin: '5px 0', color: '#495057', fontSize: '14px' }}><strong>Requested By:</strong> {booking.userName}</p>
                                <p style={{ margin: '5px 0', color: '#495057', fontSize: '14px' }}><strong>Purpose:</strong> {booking.purpose} ({booking.attendees} attendees)</p>
                                <p style={{ margin: '5px 0', color: '#495057', fontSize: '14px' }}>
                                    <strong>Time:</strong> {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                                </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ marginBottom: '15px', fontWeight: 'bold', color: booking.status === 'APPROVED' ? '#198754' : booking.status === 'REJECTED' ? '#dc3545' : '#ffc107' }}>
                                    Status: {booking.status}
                                </div>
                                
                                {booking.status === 'PENDING' && (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleAction(booking.id, 'APPROVED')} style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                                        <button onClick={() => handleAction(booking.id, 'REJECTED')} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBookings;