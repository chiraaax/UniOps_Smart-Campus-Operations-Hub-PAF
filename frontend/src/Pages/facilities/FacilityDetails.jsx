import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import { AuthContext } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const FacilityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
    const [bookingData, setBookingData] = useState({
        purpose: '',
        attendees: '',
        startTime: '',
        endTime: ''
    });

    const currentDateTime = new Date().toISOString().slice(0, 16);

    useEffect(() => {
        const loadFacilityData = async () => {
            try {
                // 1. Load Facility Details
                const facilities = await facilityService.getAllFacilities();
                const selected = facilities.find((item) => String(item.id) === String(id));
                setFacility(selected || null);

                // 2. Load the Schedule for this specific facility
                if (selected) {
                    const allBookings = await bookingService.getFacilityBookings(selected.id);
                    const now = new Date();
                    
                    // Filter: Only keep APPROVED bookings where the End Time is in the future
                    const activeSchedule = allBookings.filter(b => {
                        const isApproved = b.status === 'APPROVED';
                        const isFuture = new Date(b.endTime) > now;
                        return isApproved && isFuture;
                    });
                    
                    // Sort them chronologically
                    activeSchedule.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                    setApprovedBookings(activeSchedule);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setFacility(null);
            } finally {
                setLoading(false);
            }
        };

        loadFacilityData();
    }, [id]);

    const handleFormChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingMessage({ type: '', text: '' });

        if (!user) {
            setBookingMessage({ type: 'error', text: 'You must be logged in to book a facility.' });
            return;
        }

        if (new Date(bookingData.startTime) >= new Date(bookingData.endTime)) {
            setBookingMessage({ type: 'error', text: 'End time must be after start time.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                facilityId: facility.id,
                facilityName: facility.name,
                userId: user.id,
                userName: user.name,
                purpose: bookingData.purpose,
                attendees: parseInt(bookingData.attendees),
                startTime: bookingData.startTime,
                endTime: bookingData.endTime
            };

            await bookingService.createBooking(payload);
            
            setBookingMessage({ type: 'success', text: 'Booking request submitted successfully! An Admin will review it shortly.' });
            setShowBookingForm(false); 
            setBookingData({ purpose: '', attendees: '', startTime: '', endTime: '' }); 
            
        } catch (error) {
            console.error(error);
            setBookingMessage({ 
                type: 'error', 
                text: error.response?.data || 'Failed to submit booking. This time slot might already be taken.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading facility details...</div>;
    }

    if (!facility) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
                <button onClick={() => navigate('/facilities')} style={{ marginBottom: '16px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                    Back to Facilities
                </button>
                <div>Facility not found.</div>
            </div>
        );
    }

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif'
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate('/facilities')} style={{ marginBottom: '16px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                &larr; Back to Facilities
            </button>

            <div style={{ border: '1px solid #cfe2ff', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white' }}>
                {facility.imageUrl ? (
                    <img src={facility.imageUrl} alt={facility.name} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />
                ) : (
                    <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                        {facility.type}
                    </div>
                )}

                <div style={{ padding: '30px' }}>
                    {/* HEADER WITH QR */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                            <h2 style={{ margin: 0, color: '#084298', fontSize: '28px' }}>{facility.name}</h2>
                            <span style={{ fontSize: '14px', padding: '6px 12px', borderRadius: '20px', backgroundColor: facility.status === 'ACTIVE' ? '#d1e7dd' : '#f8d7da', color: facility.status === 'ACTIVE' ? '#0f5132' : '#842029', fontWeight: 'bold' }}>
                                {facility.status}
                            </span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <QRCodeSVG
                                value={`${window.location.origin}/incidents/new?resourceId=${facility.id}`}
                                size={80}
                            />
                            <p style={{ fontSize: '10px', margin: '5px 0 0 0' }}>
                                Scan to report incident
                            </p>
                        </div>
                    </div>

                    <p style={{ margin: '0 0 20px 0', color: '#6c757d', fontSize: '16px' }}>📍 {facility.location}</p>

                    {/* DETAILS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px', border: '1px solid #e9ecef' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Type</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#212529' }}>{facility.type || 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px', border: '1px solid #e9ecef' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Capacity</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#212529' }}>{facility.capacity > 0 ? facility.capacity : 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px', border: '1px solid #e9ecef' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Open Time</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#212529' }}>{facility.openTime || 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px', border: '1px solid #e9ecef' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Close Time</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#212529' }}>{facility.closeTime || 'N/A'}</div>
                        </div>
                    </div>

                    {/* SCHEDULE */}
                    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #cfe2ff', marginBottom: '30px' }}>
                        <h3 style={{ marginTop: 0, color: '#084298', fontSize: '18px', borderBottom: '1px solid #cfe2ff', paddingBottom: '10px', marginBottom: '15px' }}>
                            📅 Upcoming Schedule
                        </h3>
                        
                        {approvedBookings.length === 0 ? (
                            <p style={{ color: '#6c757d', margin: 0, fontSize: '14px', fontStyle: 'italic' }}>
                                No upcoming bookings. This space is wide open!
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {approvedBookings.map(booking => (
                                    <div key={booking.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontWeight: 'bold', color: '#495057' }}>{new Date(booking.startTime).toLocaleDateString()}</span>
                                            <span style={{ color: '#6c757d', marginLeft: '10px' }}>
                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                                &nbsp;&mdash;&nbsp; 
                                                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ backgroundColor: '#e7f1ff', color: '#084298', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                            Reserved
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* BOOKING SECTION */}
                    <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '25px' }}>
                        
                        {bookingMessage.text && (
                            <div style={{ padding: '12px', borderRadius: '6px', marginBottom: '20px', backgroundColor: bookingMessage.type === 'success' ? '#d1e7dd' : '#f8d7da', color: bookingMessage.type === 'success' ? '#0f5132' : '#842029', border: `1px solid ${bookingMessage.type === 'success' ? '#badbcc' : '#f5c2c7'}` }}>
                                {bookingMessage.text}
                            </div>
                        )}

                        {facility.status === 'OUT_OF_SERVICE' ? (
                            <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                                This facility is currently down for maintenance and cannot be booked.
                            </div>
                        ) : !user ? (
                            <div style={{ backgroundColor: '#e7f1ff', color: '#084298', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                Please <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>log in</strong> to request a booking for this facility.
                            </div>
                        ) : !showBookingForm ? (
                            <button 
                                onClick={() => setShowBookingForm(true)} 
                                style={{ width: '100%', backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(13, 110, 253, 0.2)' }}>
                                Request to Book Space
                            </button>
                        ) : (
                            <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '10px', border: '1px solid #cfe2ff' }}>
                                <h3 style={{ marginTop: 0, color: '#084298', marginBottom: '20px' }}>Booking Request Form</h3>
                                <form onSubmit={handleBookingSubmit}>
                                    <label style={{ display: 'block', fontWeight: 'bold', color: '#495057', marginBottom: '5px' }}>Purpose of Booking</label>
                                    <input type="text" name="purpose" required value={bookingData.purpose} onChange={handleFormChange} placeholder="e.g. Group Study, Club Meeting" style={inputStyle} />

                                    <label style={{ display: 'block', fontWeight: 'bold', color: '#495057', marginBottom: '5px' }}>Expected Attendees</label>
                                    <input type="number" name="attendees" required min="1" max={facility.capacity || 999} value={bookingData.attendees} onChange={handleFormChange} placeholder={`Max: ${facility.capacity || 'Any'}`} style={inputStyle} />

                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', color: '#495057', marginBottom: '5px' }}>Start Date & Time</label>
                                            <input 
                                                type="datetime-local" 
                                                name="startTime" 
                                                required 
                                                min={currentDateTime}
                                                value={bookingData.startTime} 
                                                onChange={handleFormChange} 
                                                style={inputStyle} 
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', color: '#495057', marginBottom: '5px' }}>End Date & Time</label>
                                            <input 
                                                type="datetime-local" 
                                                name="endTime" 
                                                required 
                                                min={bookingData.startTime || currentDateTime}
                                                value={bookingData.endTime} 
                                                onChange={handleFormChange} 
                                                style={inputStyle} 
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button type="submit" disabled={isSubmitting} style={{ flex: 2, backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                        <button type="button" onClick={() => setShowBookingForm(false)} style={{ flex: 1, backgroundColor: 'white', color: '#6c757d', border: '1px solid #ced4da', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;