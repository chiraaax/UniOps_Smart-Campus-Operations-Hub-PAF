import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import { getIncidentAnalytics } from '../../services/incidentService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({
        totalFacilities: 0,
        activeFacilities: 0,
        maintenanceFacilities: 0,
        incidentSla: {
            avgHoursToResolve: 0,
            activeTickets: 0,
            totalTickets: 0
        }
    });
    const [bookingAnalytics, setBookingAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await facilityService.getAllFacilities();
                const analytics = await getIncidentAnalytics();
                
                const active = data.filter(fac => fac.status && fac.status.toUpperCase() === 'ACTIVE').length;
                const maintenance = data.filter(fac => fac.status && fac.status.toUpperCase() === 'OUT_OF_SERVICE').length;

                setStats({
                    totalFacilities: data.length,
                    activeFacilities: active,
                    maintenanceFacilities: maintenance,
                    incidentSla: analytics
                });
            } catch (error) {
                console.error("Error loading facilities or incident data:", error);
            }

            try {
                const bAnalyticsData = await bookingService.getAnalytics();
                setBookingAnalytics(bAnalyticsData);
            } catch (error) {
                console.error("Error loading booking analytics:", error);
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, []);

    const maxFacilityBookings = bookingAnalytics ? Math.max(...Object.values(bookingAnalytics.topFacilities || { 0: 1 })) : 1;
    const maxHourBookings = bookingAnalytics ? Math.max(...Object.values(bookingAnalytics.peakHours || { 0: 1 })) : 1;

    const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #cfe2ff', flex: 1, textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#084298', fontWeight: 'bold', fontFamily: 'sans-serif' }}>Loading Live Operations Dashboard...</div>;

    return (
        <div style={{ padding: '30px', width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ color: '#084298', margin: '0 0 10px 0' }}>Operations Dashboard</h1>
                    <p style={{ color: '#6c757d', margin: 0 }}>Live statistics from your Uni Ops database.</p>
                </div>
                <button onClick={() => navigate('/facilities')} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(13, 110, 253, 0.2)' }}>
                    Manage Resources Directory &rarr;
                </button>
            </div>
            
            {/* --- 1. CORE METRICS ROW (Merged) --- */}
            <h3 style={{ color: '#495057', fontSize: '16px', textTransform: 'uppercase', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>Facility Health & System Volume</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Active Resources</h3>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#198754', margin: '10px 0 0 0' }}>{stats.activeFacilities}</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>In Maintenance</h3>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#dc3545', margin: '10px 0 0 0' }}>{stats.maintenanceFacilities}</p>
                </div>
                <div style={{ ...cardStyle, border: '1px solid #0d6efd', backgroundColor: '#f0f4fb' }}>
                    <h3 style={{ margin: 0, color: '#084298', fontSize: '14px', textTransform: 'uppercase' }}>Total Bookings Requested</h3>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#084298', margin: '10px 0 0 0' }}>{bookingAnalytics?.totalBookings || 0}</p>
                </div>
            </div>

            {/* --- 2. TICKETING SLA ROW (Dulnara's addition) --- */}
            <h3 style={{ color: '#495057', fontSize: '16px', textTransform: 'uppercase', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>Ticketing SLAs</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ffc107' }}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Active Incident Tickets</h3>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#084298', margin: '10px 0 0 0' }}>{stats.incidentSla.activeTickets}</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #0dcaf0' }}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Avg MTTR (Hours)</h3>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#198754', margin: '10px 0 0 0' }}>{stats.incidentSla.avgHoursToResolve}h</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #6c757d' }}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Total Lifetime Tickets</h3>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#6c757d', margin: '10px 0 0 0' }}>{stats.incidentSla.totalTickets}</p>
                </div>
            </div>

            {/* --- 3. USAGE ANALYTICS CHARTS (Your addition) --- */}
            <h3 style={{ color: '#495057', fontSize: '16px', textTransform: 'uppercase', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #e9ecef' }}>Usage Trends & Analytics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#212529', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>🏆</span> Top Booked Resources
                    </h3>
                    
                    {!bookingAnalytics || Object.keys(bookingAnalytics.topFacilities).length === 0 ? (
                        <p style={{ color: '#6c757d', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Not enough booking data generated yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {Object.entries(bookingAnalytics.topFacilities).map(([name, count]) => {
                                const percentage = Math.max((count / maxFacilityBookings) * 100, 5); 
                                return (
                                    <div key={name}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', fontWeight: 'bold', color: '#495057' }}>
                                            <span>{name}</span>
                                            <span style={{ color: '#0d6efd' }}>{count} requests</span>
                                        </div>
                                        <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percentage}%`, backgroundColor: '#0d6efd', height: '100%', borderRadius: '6px', transition: 'width 1s ease-out' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#212529', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>🔥</span> Peak Booking Hours
                    </h3>
                    
                    {!bookingAnalytics || Object.keys(bookingAnalytics.peakHours).length === 0 ? (
                        <p style={{ color: '#6c757d', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Not enough booking data generated yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {Object.entries(bookingAnalytics.peakHours).map(([time, count]) => {
                                const percentage = Math.max((count / maxHourBookings) * 100, 5);
                                return (
                                    <div key={time}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', fontWeight: 'bold', color: '#495057' }}>
                                            <span>{time}</span>
                                            <span style={{ color: '#fd7e14' }}>{count} requests</span>
                                        </div>
                                        <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percentage}%`, backgroundColor: '#fd7e14', height: '100%', borderRadius: '6px', transition: 'width 1s ease-out' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;