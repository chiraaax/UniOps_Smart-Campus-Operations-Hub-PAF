import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const TechnicianSidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const linkStyle = { display: 'block', padding: '12px 20px', color: '#144e31', textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: '5px', borderRadius: '5px', transition: 'background-color 0.2s' };

    return (
        <div style={{ width: '250px', backgroundColor: '#d1e7dd', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '20px', borderRight: '1px solid #badbcc' }}>
            <h2 style={{ color: '#0f5132', marginBottom: '40px', textAlign: 'center' }}>Tech Portal</h2>
            
            <div style={{ flex: 1 }}>
                <div 
                    onClick={() => navigate('/technician/dashboard')} 
                    style={{ ...linkStyle, backgroundColor: location.pathname === '/technician/dashboard' ? 'rgba(0,0,0,0.05)' : 'transparent' }}>
                    My Dashboard
                </div>
            </div>

            <button onClick={logout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                Logout
            </button>
        </div>
    );
};

export default TechnicianSidebar;