import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const statusStyles = {
    APPROVED: {
        label: 'Approved',
        background: '#d1fae5',
        color: '#065f46',
        accent: '#10b981',
        note: 'Ready to use. Your QR pass is available below.'
    },
    PENDING: {
        label: 'Pending Review',
        background: '#fef3c7',
        color: '#92400e',
        accent: '#f59e0b',
        note: 'Waiting for admin approval.'
    },
    REJECTED: {
        label: 'Rejected',
        background: '#fee2e2',
        color: '#991b1b',
        accent: '#ef4444',
        note: 'This request was not approved.'
    },
    CANCELLED: {
        label: 'Cancelled',
        background: '#e5e7eb',
        color: '#374151',
        accent: '#6b7280',
        note: 'You cancelled this request.'
    }
};

const cardShellStyle = {
    background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
    borderRadius: '24px',
    border: '1px solid #dbeafe',
    boxShadow: '0 20px 45px rgba(8, 66, 152, 0.08)'
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

const StudentBookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const qrWrappersRef = useRef({});

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
            console.error('Failed to fetch my bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            try {
                await bookingService.updateBookingStatus(id, 'CANCELLED');
                loadMyBookings();
            } catch (error) {
                alert('Failed to cancel booking.');
            }
        }
    };

    const buildBookingQrValue = (booking) => JSON.stringify({
        bookingId: booking.id,
        facilityId: booking.facilityId,
        facilityName: booking.facilityName,
        userId: booking.userId,
        userName: booking.userName,
        purpose: booking.purpose,
        status: booking.status,
        startTime: booking.startTime,
        endTime: booking.endTime
    });

    // The QR stores a compact booking snapshot that can be saved and presented later.
    const handleDownloadQr = (booking) => {
        const wrapper = qrWrappersRef.current[booking.id];
        const canvas = wrapper?.querySelector('canvas');

        if (!canvas) {
            alert('QR code is not ready yet. Please try again.');
            return;
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = `booking-${booking.id}-qr.png`;
        downloadLink.click();
    };

    const approvedCount = bookings.filter((booking) => booking.status === 'APPROVED').length;
    const pendingCount = bookings.filter((booking) => booking.status === 'PENDING').length;
    const cancelledCount = bookings.filter((booking) => booking.status === 'CANCELLED').length;

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#084298', fontFamily: 'sans-serif' }}>
                Loading Your Bookings...
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #edf6ff 0%, #ffffff 45%, #f7fbff 100%)',
                padding: '32px 20px 48px',
                fontFamily: 'sans-serif'
            }}
        >
            <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '24px' }}>
                {/* Booking overview gives students a quick read on request progress before the list. */}
                <section
                    style={{
                        ...cardShellStyle,
                        padding: '28px',
                        background: 'linear-gradient(135deg, #0b4aa6 0%, #0f6ad8 55%, #78b7ff 100%)',
                        color: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 'auto -80px -100px auto',
                            width: '240px',
                            height: '240px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.12)'
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '-55px',
                            right: '140px',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)'
                        }}
                    />
                    <div style={{ position: 'relative', display: 'grid', gap: '18px' }}>
                        <div>
                            <div style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '10px' }}>
                                Student Booking Center
                            </div>
                            <h1 style={{ margin: 0, fontSize: '34px', lineHeight: 1.15 }}>My Bookings</h1>
                            <p style={{ margin: '12px 0 0', maxWidth: '620px', fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.88)' }}>
                                Track approvals, manage active requests, and download your booking QR pass when a reservation is approved.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>Total Requests</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{bookings.length}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>Approved</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{approvedCount}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>Pending</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{pendingCount}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>Cancelled</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{cancelledCount}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {bookings.length === 0 ? (
                    <section style={{ ...cardShellStyle, padding: '48px 28px', textAlign: 'center' }}>
                        <div style={{ fontSize: '42px', marginBottom: '12px' }}>No bookings yet</div>
                        <p style={{ margin: '0 auto 20px', maxWidth: '480px', color: '#64748b', lineHeight: 1.7 }}>
                            You have not made any booking requests yet. Once you book a space, the request will appear here with its current approval status.
                        </p>
                        <button
                            onClick={() => navigate('/facilities')}
                            style={{ backgroundColor: '#084298', color: '#ffffff', border: 'none', padding: '12px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Browse Facilities
                        </button>
                    </section>
                ) : (
                    <section style={{ display: 'grid', gap: '18px' }}>
                        {bookings.map((booking) => {
                            const statusConfig = statusStyles[booking.status] || statusStyles.PENDING;

                            return (
                                <article
                                    key={booking.id}
                                    style={{
                                        ...cardShellStyle,
                                        padding: '22px',
                                        borderLeft: `8px solid ${statusConfig.accent}`
                                    }}
                                >
                                    {/* Each booking card separates request details from the QR/pass side panel. */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(240px, 0.9fr)', gap: '20px', alignItems: 'start' }}>
                                        <div style={{ display: 'grid', gap: '18px' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '14px', alignItems: 'start' }}>
                                                <div>
                                                    <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '24px' }}>{booking.facilityName}</h2>
                                                    <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
                                                        {booking.purpose || 'No purpose provided'}
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
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>Start</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{formatDateTime(booking.startTime)}</div>
                                                </div>
                                                <div style={{ backgroundColor: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '14px' }}>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>End</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{formatDateTime(booking.endTime)}</div>
                                                </div>
                                                <div style={{ backgroundColor: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '14px' }}>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '8px' }}>Duration</div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{getDurationLabel(booking.startTime, booking.endTime)}</div>
                                                </div>
                                            </div>

                                            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 16px', color: '#475569', lineHeight: 1.6 }}>
                                                {statusConfig.note}
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        style={{ backgroundColor: '#ffffff', color: '#b91c1c', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                                                    >
                                                        Cancel Request
                                                    </button>
                                                )}

                                                {booking.status === 'APPROVED' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate('/incidents/new?resourceId=' + booking.facilityId)}
                                                            style={{ backgroundColor: '#0d6efd', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                                                        >
                                                            Report Incident
                                                        </button>
                                                        <button
                                                            onClick={() => navigate('/incidents?resourceId=' + booking.facilityId)}
                                                            style={{ backgroundColor: '#198754', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                                                        >
                                                            View Incidents
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {booking.status === 'APPROVED' ? (
                                            <div
                                                style={{
                                                    background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
                                                    border: '1px solid #bfdbfe',
                                                    borderRadius: '20px',
                                                    padding: '18px',
                                                    textAlign: 'center',
                                                    display: 'grid',
                                                    gap: '12px'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '6px' }}>
                                                        Booking Pass
                                                    </div>
                                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>Approved QR</div>
                                                </div>

                                                {/* The QR block doubles as an on-screen pass and downloadable PNG source. */}
                                                <div
                                                    ref={(node) => {
                                                        if (node) {
                                                            qrWrappersRef.current[booking.id] = node;
                                                        } else {
                                                            delete qrWrappersRef.current[booking.id];
                                                        }
                                                    }}
                                                    style={{
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '18px',
                                                        padding: '14px',
                                                        border: '1px solid #dbeafe',
                                                        display: 'flex',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <QRCodeCanvas
                                                        value={buildBookingQrValue(booking)}
                                                        size={132}
                                                        bgColor="#ffffff"
                                                        fgColor="#084298"
                                                        includeMargin
                                                    />
                                                </div>

                                                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                                                    Download and keep this QR ready when using the reserved facility.
                                                </p>

                                                <button
                                                    onClick={() => handleDownloadQr(booking)}
                                                    style={{ width: '100%', backgroundColor: '#084298', color: '#ffffff', border: 'none', padding: '11px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                                                >
                                                    Download QR
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    backgroundColor: '#f8fafc',
                                                    border: '1px dashed #cbd5e1',
                                                    borderRadius: '20px',
                                                    padding: '20px',
                                                    minHeight: '100%',
                                                    display: 'grid',
                                                    alignContent: 'center',
                                                    gap: '10px',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>QR Pass Unavailable</div>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
                                                    A downloadable QR code will appear here once this booking is approved.
                                                </p>
                                            </div>
                                        )}
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

export default StudentBookings;