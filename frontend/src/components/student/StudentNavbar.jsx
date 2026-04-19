import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

const StudentNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const navItems = [
        { label: 'Home', path: '/', match: location.pathname === '/' },
        { label: 'Facilities', path: '/facilities', match: location.pathname.startsWith('/facilities') },
        ...(user ? [{ label: 'My Bookings', path: '/my-bookings', match: location.pathname.startsWith('/my-bookings') }] : []),
        { label: 'Incidents', path: '/incidents', match: location.pathname.startsWith('/incidents') }
    ];

    const fetchNotifications = async () => {
        if (user && user.id) {
            try {
                const data = await notificationService.getUserNotifications(user.id);
                setNotifications(data);
            } catch (error) {
                console.error('Failed to load notifications', error);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [user]);

    const handleNotificationClick = async (id) => {
        await notificationService.markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead(user.id);
        fetchNotifications();
    };

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return (
        <nav
            style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                borderBottom: '1px solid #dbeafe',
                padding: '16px 26px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
                gap: '20px',
                flexWrap: 'wrap'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
                <div
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #0f172a 0%, #0b4aa6 58%, #38bdf8 100%)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            position: 'relative',
                            boxShadow: '0 10px 24px rgba(11, 74, 166, 0.22)'
                        }}
                    >
                        <span style={{ fontSize: '15px', letterSpacing: '0.06em' }}>UO</span>
                        <span
                            style={{
                                position: 'absolute',
                                width: '10px',
                                height: '10px',
                                borderRadius: '999px',
                                backgroundColor: '#f8fafc',
                                top: '6px',
                                right: '6px',
                                opacity: 0.9
                            }}
                        />
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '18px', letterSpacing: '0.06em' }}>UNIOPS</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Smart campus operations hub</div>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #dbeafe',
                        borderRadius: '999px',
                        padding: '6px'
                    }}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            style={{
                                backgroundColor: item.match ? '#0b4aa6' : 'transparent',
                                color: item.match ? '#ffffff' : '#334155',
                                border: 'none',
                                padding: '10px 14px',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '13px'
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => {
                                setShowDropdown(!showDropdown);
                                fetchNotifications();
                            }}
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #dbeafe',
                                borderRadius: '14px',
                                padding: '10px 14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', color: '#0b4aa6' }}>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 3.75C9.23858 3.75 7 5.98858 7 8.75V10.8281C7 11.2657 6.85664 11.6913 6.5918 12.0397L5.2907 13.7501C4.46811 14.8314 5.23961 16.375 6.59657 16.375H17.4034C18.7604 16.375 19.5319 14.8314 18.7093 13.7501L17.4082 12.0397C17.1434 11.6913 17 11.2657 17 10.8281V8.75C17 5.98858 14.7614 3.75 12 3.75Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9.75 18.25C10.1036 19.0132 10.8755 19.5417 12 19.5417C13.1245 19.5417 13.8964 19.0132 14.25 18.25"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '13px' }}>Notifications</span>
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        minWidth: '24px',
                                        height: '24px',
                                        borderRadius: '999px',
                                        backgroundColor: '#dc2626',
                                        color: '#ffffff',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0 6px'
                                    }}
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showDropdown && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '58px',
                                    right: 0,
                                    width: '340px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #dbeafe',
                                    borderRadius: '18px',
                                    boxShadow: '0 18px 36px rgba(15, 23, 42, 0.14)',
                                    zIndex: 1000,
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    style={{
                                        padding: '14px 16px',
                                        background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
                                        borderBottom: '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <h4 style={{ margin: 0, color: '#0f172a', fontSize: '16px' }}>Notifications</h4>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Stay updated with booking and incident activity</div>
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            style={{ background: 'none', border: 'none', color: '#0b4aa6', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '30px', textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification.id)}
                                                style={{
                                                    padding: '15px 16px',
                                                    borderBottom: '1px solid #eef2f7',
                                                    backgroundColor: notification.read ? '#ffffff' : '#f8fbff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>
                                                        {notification.title}
                                                    </div>
                                                    {!notification.read && (
                                                        <div style={{ width: '9px', height: '9px', backgroundColor: '#0d6efd', borderRadius: '50%', marginTop: '4px' }} />
                                                    )}
                                                </div>

                                                <div style={{ color: '#475569', fontSize: '13px', marginBottom: '8px', lineHeight: 1.6 }}>
                                                    {notification.message}
                                                </div>

                                                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #dbeafe',
                            borderRadius: '16px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
                        }}
                    >
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#1e3a8a'
                            }}
                        >
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{user.name}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>Student Portal</div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        style={{
                            backgroundColor: '#fff1f2',
                            color: '#be123c',
                            border: '1px solid #fecdd3',
                            padding: '11px 16px',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            backgroundColor: '#ffffff',
                            color: '#0b4aa6',
                            border: '1px solid #bfdbfe',
                            padding: '10px 18px',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'linear-gradient(135deg, #0b4aa6 0%, #0d6efd 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Register
                    </button>
                </div>
            )}
        </nav>
    );
};

export default StudentNavbar;
