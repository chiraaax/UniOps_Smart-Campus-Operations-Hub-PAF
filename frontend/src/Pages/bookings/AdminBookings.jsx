import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';

const statusStyles = {
    APPROVED: {
        label: 'Approved',
        background: '#d1fae5',
        color: '#065f46',
        accent: '#10b981',
        note: 'This booking is cleared for use.'
    },
    PENDING: {
        label: 'Needs Review',
        background: '#fef3c7',
        color: '#92400e',
        accent: '#f59e0b',
        note: 'Review the request and decide whether to approve it.'
    },
    REJECTED: {
        label: 'Rejected',
        background: '#fee2e2',
        color: '#991b1b',
        accent: '#ef4444',
        note: 'This booking was declined.'
    },
    CANCELLED: {
        label: 'Cancelled',
        background: '#e5e7eb',
        color: '#374151',
        accent: '#6b7280',
        note: 'The student cancelled this request.'
    }
};

const shellCardStyle = {
    background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
    borderRadius: '24px',
    border: '1px solid #dbeafe',
    boxShadow: '0 22px 50px rgba(15, 23, 42, 0.08)'
};

const formatDateTime = (value) =>
    new Date(value).toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

const getDurationLabel = (startTime, endTime) => {
    const durationMs = new Date(endTime) - new Date(startTime);
    const totalMinutes = Math.max(Math.round(durationMs / 60000), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
};

// Robust timestamp extraction (from second version)
const getBookingTimestamp = (booking) => {
    const candidates = [booking.createdAt, booking.updatedAt, booking.startTime, booking.endTime];
    for (const value of candidates) {
        if (!value) continue;
        const time = new Date(value).getTime();
        if (!Number.isNaN(time)) return time;
    }
    return 0;
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await bookingService.getAllBookings();
            // Use the improved sorting logic from the second version
            data.sort((a, b) => getBookingTimestamp(b) - getBookingTimestamp(a));
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, newStatus) => {
        try {
            await bookingService.updateBookingStatus(id, newStatus);
            alert(`Booking ${newStatus} successfully!`);
            loadBookings();
        } catch (error) {
            alert('Error updating booking status.');
        }
    };

    const pendingCount = bookings.filter((booking) => booking.status === 'PENDING').length;
    const approvedCount = bookings.filter((booking) => booking.status === 'APPROVED').length;
    const rejectedCount = bookings.filter((booking) => booking.status === 'REJECTED').length;
    const filteredBookings = statusFilter === 'ALL'
        ? bookings
        : bookings.filter((booking) => booking.status === statusFilter);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#084298', fontFamily: 'sans-serif' }}>Loading Bookings...</div>;
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #eef5ff 0%, #ffffff 40%, #f8fbff 100%)',
                padding: '32px 20px 48px',
                fontFamily: 'sans-serif'
            }}
        >
            <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gap: '24px' }}>
                {/* Hero summary */}
                <section
                    style={{
                        ...shellCardStyle,
                        padding: '28px',
                        background: 'linear-gradient(135deg, #0f172a 0%, #0b4aa6 58%, #57a2ff 100%)',
                        color: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: '-40px', right: '-20px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', bottom: '-80px', right: '120px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

                    <div style={{ position: 'relative', display: 'grid', gap: '18px' }}>
                        <div>
                            <div style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '10px' }}>
                                Admin Booking Desk
                            </div>
                            <h1 style={{ margin: 0, fontSize: '34px', lineHeight: 1.1 }}>Booking Management</h1>
                            <p style={{ margin: '12px 0 0', maxWidth: '650px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.7 }}>
                                Review student requests, spot pending approvals quickly, and keep facility usage flowing without losing context.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.78, marginBottom: '6px' }}>Total Requests</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{bookings.length}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.78, marginBottom: '6px' }}>Pending</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{pendingCount}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.78, marginBottom: '6px' }}>Approved</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{approvedCount}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.78, marginBottom: '6px' }}>Rejected</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{rejectedCount}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter tabs */}
                <section
                    style={{
                        ...shellCardStyle,
                        padding: '18px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}
                >
                    <div>
                        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '6px' }}>
                            Status Filter
                        </div>
                        <div style={{ color: '#334155', fontWeight: 'bold' }}>
                            Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'request' : 'requests'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {[
                            { value: 'ALL', label: 'All' },
                            { value: 'PENDING', label: 'Pending' },
                            { value: 'APPROVED', label: 'Approved' },
                            { value: 'REJECTED', label: 'Rejected' }
                        ].map((filter) => {
                            const isActive = statusFilter === filter.value;

                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setStatusFilter(filter.value)}
                                    style={{
                                        backgroundColor: isActive ? '#0b4aa6' : '#ffffff',
                                        color: isActive ? '#ffffff' : '#334155',
                                        border: `1px solid ${isActive ? '#0b4aa6' : '#cbd5e1'}`,
                                        padding: '10px 14px',
                                        borderRadius: '999px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '13px',
                                        boxShadow: isActive ? '0 12px 24px rgba(11, 74, 166, 0.18)' : 'none'
                                    }}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {bookings.length === 0 ? (
                    <section style={{ ...shellCardStyle, padding: '48px 28px', textAlign: 'center' }}>
                        <div style={{ fontSize: '42px', marginBottom: '12px', color: '#0f172a' }}>No booking requests</div>
                        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>
                            When students submit reservation requests, they will appear here for review.
                        </p>
                    </section>
                ) : filteredBookings.length === 0 ? (
                    <section style={{ ...shellCardStyle, padding: '48px 28px', textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px', color: '#0f172a' }}>No matching bookings</div>
                        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>
                            There are no bookings with the selected status right now.
                        </p>
                    </section>
                ) : (
                    <section style={{ display: 'grid', gap: '18px' }}>
                        {filteredBookings.map((booking) => {
                            const statusConfig = statusStyles[booking.status] || statusStyles.PENDING;

                            return (
                                <article
                                    key={booking.id}
                                    style={{
                                        ...shellCardStyle,
                                        padding: '22px',
                                        borderLeft: `8px solid ${statusConfig.accent}`
                                    }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(280px, 0.95fr)', gap: '20px', alignItems: 'start' }}>
                                        <div style={{ display: 'grid', gap: '18px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'start' }}>
                                                <div>
                                                    <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '24px' }}>{booking.facilityName}</h2>
                                                    <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
                                                        <strong>Requested by:</strong> {booking.userName}
                                                    </p>
                                                </div>

                                                <div
                                                    style={{
                                                        backgroundColor: statusConfig.background,
                                                        color: statusConfig.color,
                                                        borderRadius: '999px',
                                                        padding: '10px 16px',
                                                        fontWeight: 'bold',
                                                        fontSize: '13px',
                                                        border: `1px solid ${statusConfig.accent}33`
                                                    }}
                                                >
                                                    {statusConfig.label}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                                                <div style={{ backgroundColor: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '14px' }}>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>Purpose</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{booking.purpose || 'No purpose provided'}</div>
                                                </div>
                                                <div style={{ backgroundColor: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '14px' }}>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>Attendees</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{booking.attendees || 0} people</div>
                                                </div>
                                                <div style={{ backgroundColor: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '14px' }}>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>Duration</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{getDurationLabel(booking.startTime, booking.endTime)}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                                                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>Start</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{formatDateTime(booking.startTime)}</div>
                                                </div>
                                                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>End</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{formatDateTime(booking.endTime)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gap: '14px' }}>
                                            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px' }}>
                                                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '8px' }}>Review Note</div>
                                                <div style={{ color: '#334155', lineHeight: 1.7 }}>{statusConfig.note}</div>
                                            </div>

                                            {booking.status === 'PENDING' ? (
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    <button
                                                        onClick={() => handleAction(booking.id, 'APPROVED')}
                                                        style={{ backgroundColor: '#198754', color: '#ffffff', border: 'none', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    >
                                                        Approve Booking
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(booking.id, 'REJECTED')}
                                                        style={{ backgroundColor: '#ffffff', color: '#dc3545', border: '1px solid #f5c2c7', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    >
                                                        Reject Booking
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)', border: '1px dashed #bfdbfe', borderRadius: '18px', padding: '18px', textAlign: 'center', color: '#475569', lineHeight: 1.7 }}>
                                                    This request is already finalized. No further admin action is needed right now.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;