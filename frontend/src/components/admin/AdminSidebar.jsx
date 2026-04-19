import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', match: location.pathname === '/admin/dashboard', hint: 'Overview and recent activity' },
        { label: 'Manage Facilities', path: '/facilities', match: location.pathname.startsWith('/facilities'), hint: 'Update spaces and resources' },
        { label: 'All Bookings', path: '/admin/bookings', match: location.pathname.startsWith('/admin/bookings'), hint: 'Review and approve requests' },
        { label: 'Maintenance Tickets', path: '/incidents', match: location.pathname.startsWith('/incidents'), hint: 'Track reported issues' }
    ];

    return (
        <aside
            style={{
                width: '250px',
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0f172a 0%, #0b4aa6 55%, #123b7a 100%)',
                display: 'flex',
                flexDirection: 'column',
                padding: '18px 14px',
                color: '#ffffff',
                boxShadow: '20px 0 40px rgba(15, 23, 42, 0.12)',
                fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
                position: 'sticky',
                top: 0
            }}
        >
            <div
                style={{
                    borderRadius: '24px',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '18px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)',
                            color: '#0b4aa6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            position: 'relative'
                        }}
                    >
                        <span style={{ fontSize: '15px', letterSpacing: '0.06em' }}>UO</span>
                        <span
                            style={{
                                position: 'absolute',
                                width: '10px',
                                height: '10px',
                                borderRadius: '999px',
                                backgroundColor: '#0b4aa6',
                                top: '6px',
                                right: '6px',
                                opacity: 0.9
                            }}
                        />
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '0.06em' }}>UNIOPS</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.72)' }}>Admin operations panel</div>
                    </div>
                </div>

                <div style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, fontSize: '13px' }}>
                    Manage facilities, review bookings, and respond to campus operations from one workspace.
                </div>
            </div>

            <div style={{ marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.68)', padding: '0 8px' }}>
                Navigation
            </div>

            <div style={{ flex: 1, display: 'grid', gap: '10px' }}>
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        style={{
                            textAlign: 'left',
                            background: item.match ? 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)' : 'transparent',
                            border: item.match ? '1px solid rgba(255,255,255,0.16)' : '1px solid transparent',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '12px 12px',
                            borderRadius: '18px'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '12px', color: item.match ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.64)' }}>{item.hint}</div>
                    </button>
                ))}

                <div
                    style={{
                        marginTop: '10px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px dashed rgba(255,255,255,0.16)',
                        borderRadius: '18px',
                        padding: '12px'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>User Management</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                        Reserved for future admin features and user access control.
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: '14px',
                    borderTop: '1px solid rgba(255,255,255,0.12)',
                    paddingTop: '14px'
                }}
            >
                <button
                    onClick={logout}
                    style={{
                        backgroundColor: '#fff1f2',
                        color: '#be123c',
                        border: '1px solid #fecdd3',
                        padding: '12px 14px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        width: '100%'
                    }}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
