import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Useful for highlighting the active tab

    const linkStyle = { display: 'block', padding: '12px 20px', color: '#cfe2ff', textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: '5px', borderRadius: '5px', transition: 'background-color 0.2s' };

    return (
        <div style={{ width: '250px', backgroundColor: '#084298', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <h2 style={{ color: 'white', marginBottom: '40px', textAlign: 'center' }}>Nexus Admin</h2>
            
            <div style={{ flex: 1 }}>
                <div 
                    onClick={() => navigate('/admin/dashboard')} 
                    style={{ ...linkStyle, backgroundColor: location.pathname === '/admin/dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
                    Dashboard
                </div>
                <div 
                    onClick={() => navigate('/facilities')} 
                    style={{ ...linkStyle, backgroundColor: location.pathname === '/facilities' ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
                    Manage Facilities
                </div>
                
                {/* --- THIS LINK IS NOW WIRED --- */}
                <div 
                    onClick={() => navigate('/admin/bookings')} 
                    style={{ ...linkStyle, backgroundColor: location.pathname === '/admin/bookings' ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
                    All Bookings
                </div>
                
                <div style={{ ...linkStyle }}>Maintenance Tickets</div>
                <div style={{ ...linkStyle }}>User Management</div>
            </div>

            <button onClick={logout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                Logout
            </button>
        </div>
    );
};

export default AdminSidebar;