import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '24px',
    boxShadow: '0 20px 45px rgba(8, 66, 152, 0.08)'
};

const ScanQrPage = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #edf6ff 0%, #ffffff 55%, #f7fbff 100%)',
                padding: '32px 20px 48px',
                fontFamily: 'sans-serif'
            }}
        >
            <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gap: '24px' }}>
                <section
                    style={{
                        ...cardStyle,
                        padding: '32px',
                        background: 'linear-gradient(135deg, #0b4aa6 0%, #0f6ad8 55%, #78b7ff 100%)',
                        color: '#ffffff'
                    }}
                >
                    <div style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85, marginBottom: '10px' }}>
                        Smart Campus Access
                    </div>
                    <h1 style={{ margin: '0 0 12px', fontSize: '34px', lineHeight: 1.15 }}>Scan QR Check-In</h1>
                    <p style={{ margin: 0, maxWidth: '620px', lineHeight: 1.7, color: 'rgba(255,255,255,0.88)' }}>
                        This page is ready for the QR check-in experience. Students can keep their booking passes in
                        one place while the camera-based scanner is added next.
                    </p>
                </section>

                <section style={{ ...cardStyle, padding: '28px', display: 'grid', gap: '18px' }}>
                    <div>
                        <h2 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: '24px' }}>What you can do right now</h2>
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
                            Open your approved bookings to access the downloadable QR pass, then present it when you
                            arrive at the facility.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={{ backgroundColor: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '16px', padding: '16px', color: '#1e3a8a' }}>
                            Approved bookings already generate a QR pass in the booking center.
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', color: '#475569' }}>
                            If you expected a live scanner here, the route now works and can be connected to a camera
                            scanner component next.
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <Link
                            to="/my-bookings"
                            style={{
                                textDecoration: 'none',
                                backgroundColor: '#084298',
                                color: '#ffffff',
                                padding: '12px 18px',
                                borderRadius: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            Open My Bookings
                        </Link>
                        <Link
                            to="/facilities"
                            style={{
                                textDecoration: 'none',
                                backgroundColor: '#ffffff',
                                color: '#084298',
                                border: '1px solid #bfdbfe',
                                padding: '12px 18px',
                                borderRadius: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            Browse Facilities
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ScanQrPage;
