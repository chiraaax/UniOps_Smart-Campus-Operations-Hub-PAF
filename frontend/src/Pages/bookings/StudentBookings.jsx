import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';

const StudentBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            loadMyBookings();
        }
    }, [user]);

    const loadMyBookings = async () => {
        try {
            const data = await bookingService.getUserBookings(user.id);
            data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch my bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // NEW CANCEL FUNCTION
    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                await bookingService.updateBookingStatus(id, 'CANCELLED');
                loadMyBookings(); 
            } catch (error) {
                alert("Failed to cancel booking.");
            }
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#084298', fontFamily: 'sans-serif' }}>Loading Your Bookings...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#084298', marginBottom: '20px' }}>My Bookings</h1>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>Track the status of your resource requests here.</p>

            {bookings.length === 0 ? (
                <div style={{ backgroundColor: 'white', padding: '40px', textAlign: 'center', borderRadius: '10px', border: '1px solid #cfe2ff' }}>
                    You have not made any booking requests yet.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #cfe2ff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#084298' }}>{booking.facilityName}</h3>
                                <p style={{ margin: '5px 0', color: '#495057', fontSize: '14px' }}><strong>Purpose:</strong> {booking.purpose}</p>
                                <p style={{ margin: '5px 0', color: '#495057', fontSize: '14px' }}>
                                    <strong>Time:</strong> {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <div style={{ 
                                    padding: '8px 16px', 
                                    borderRadius: '20px', 
                                    fontWeight: 'bold', 
                                    fontSize: '14px',
                                    backgroundColor: booking.status === 'APPROVED' ? '#d1e7dd' : booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? '#f8d7da' : '#fff3cd',
                                    color: booking.status === 'APPROVED' ? '#0f5132' : booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? '#842029' : '#664d03'
                                }}>
                                    {booking.status}
                                </div>
                                
                                {/* NEW CANCEL BUTTON VISIBLE ONLY IF PENDING */}
                                {booking.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handleCancel(booking.id)}
                                        style={{ backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                        Cancel Request
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentBookings;