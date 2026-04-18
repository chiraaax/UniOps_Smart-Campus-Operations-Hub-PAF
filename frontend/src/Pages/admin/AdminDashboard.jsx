import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import { getIncidentAnalytics } from '../../services/incidentService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // State to hold our real database statistics
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all your real data from Spring Boot!
                const data = await facilityService.getAllFacilities();
                const analytics = await getIncidentAnalytics();
                
                // Calculate the statistics
                const active = data.filter(fac => fac.status === 'ACTIVE').length;
                const maintenance = data.filter(fac => fac.status === 'OUT_OF_SERVICE').length;

                setStats({
                    totalFacilities: data.length,
                    activeFacilities: active,
                    maintenanceFacilities: maintenance,
                    incidentSla: analytics
                });
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '10px', border: '1px solid #cfe2ff', flex: 1, textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#084298' }}>Loading Live Dashboard...</div>;

    return (
        <div style={{ padding: '30px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#084298', marginBottom: '10px' }}>Admin Overview</h1>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>Live statistics from your Campus Nexus database.</p>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>Total Resources</h3>
                    <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#084298', margin: '10px 0 0 0' }}>{stats.totalFacilities}</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>Active & Available</h3>
                    <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#198754', margin: '10px 0 0 0' }}>{stats.activeFacilities}</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>In Maintenance</h3>
                    <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#dc3545', margin: '10px 0 0 0' }}>{stats.maintenanceFacilities}</p>
                </div>
            </div>

            {/* SLA DASHBOARD */}
            <h2 style={{ color: '#084298', marginBottom: '10px' }}>Ticketing SLAs</h2>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ffc107' }}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>Active Incident Tickets</h3>
                    <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#084298', margin: '10px 0 0 0' }}>{stats.incidentSla.activeTickets}</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #0dcaf0' }}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>Avg MTTR (Hours)</h3>
                    <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#198754', margin: '10px 0 0 0' }}>{stats.incidentSla.avgHoursToResolve}h</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #6c757d' }}>
                    <h3 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>Total Lifetime Tickets</h3>
                    <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#6c757d', margin: '10px 0 0 0' }}>{stats.incidentSla.totalTickets}</p>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #cfe2ff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#084298', marginTop: 0 }}>Quick Actions</h3>
                <p style={{ color: '#6c757d', marginBottom: '20px' }}>Need to add a new lab or update a broken projector?</p>
                <button onClick={() => navigate('/facilities')} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Manage Resources Directory &rarr;
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;