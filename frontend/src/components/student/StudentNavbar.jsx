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

    // Navigation items – includes "My Incidents" when user is logged in (from second version)
    const navItems = [
        { label: 'Home', path: '/', match: location.pathname === '/' },
        { label: 'Facilities', path: '/facilities', match: location.pathname.startsWith('/facilities') },
        ...(user ? [
            { label: 'My Bookings', path: '/my-bookings', match: location.pathname.startsWith('/my-bookings') },
            { label: 'My Incidents', path: '/my-incidents', match: location.pathname.startsWith('/my-incidents') }
        ] : []),
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

    // Enhanced notification click handler with category-based navigation (from second version)
    const handleNotificationClick = async (notif) => {
        if (!notif.read) {
            await notificationService.markAsRead(notif.id);
            fetchNotifications();
        }

        setShowDropdown(false);

        switch (notif.category) {
            case 'BOOKING':
                navigate('/my-bookings', { state: { highlightId: notif.referenceId } });
                break;
            case 'TICKET':
                if (notif.referenceId) {
                    navigate(`/incidents/${notif.referenceId}`);
                } else {
                    navigate('/incidents');
                }
                break;
            case 'FACILITY':
                if (notif.referenceId) navigate(`/facilities/${notif.referenceId}`);
                else navigate('/facilities');
                break;
            default:
                console.log('General notification clicked');
                break;
        }
    };

    // Delete handler with stopPropagation (from second version, already present in first)
    const handleDeleteNotification = async (e, id) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
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
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '18px', letterSpacing: '0.06em' }}>
                            UNIOPS
                        </div>
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
                                if (!showDropdown) fetchNotifications();
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
                            <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '13px' }}>
                                Notifications
                            </span>
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
                                        padding: '0 6px',
                                        animation: unreadCount > 0 ? 'ping 1.5s infinite' : 'none'
                                    }}
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showDropdown && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '58px',
                                    right: 0,
                                    width: '360px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #dbeafe',
                                    borderRadius: '18px',
                                    boxShadow: '0 18px 36px rgba(15, 23, 42, 0.14)',
                                    zIndex: 1000,
                                    overflow: 'hidden',
                                    animation: 'fadeIn 0.2s ease-out'
                                }}
                            >
                                <div
                                    style={{
                                        padding: '14px 16px',
                                        background: 'linear-gradient(135deg, #0f172a 0%, #0b4aa6 100%)',
                                        borderBottom: '1px solid #1e3a8a',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        color: '#ffffff'
                                    }}
                                >
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                                            Notifications
                                        </h4>
                                        <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px' }}>
                                            Stay updated with activity
                                        </div>
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            style={{
                                                background: 'rgba(255,255,255,0.15)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                color: '#ffffff',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '11px',
                                                padding: '6px 10px',
                                                borderRadius: '8px',
                                                backdropFilter: 'blur(4px)'
                                            }}
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div
                                            style={{
                                                padding: '30px',
                                                textAlign: 'center',
                                                color: '#6c757d',
                                                fontSize: '14px'
                                            }}
                                        >
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                                style={{
                                                    padding: '15px 16px',
                                                    borderBottom: '1px solid #eef2f7',
                                                    backgroundColor: notification.read ? '#ffffff' : '#f8fbff',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'background 0.15s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = notification.read ? '#ffffff' : '#f8fbff';
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        gap: '12px',
                                                        marginBottom: '6px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontWeight: 'bold',
                                                            color: '#0f172a',
                                                            fontSize: '14px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        {!notification.read && (
                                                            <span
                                                                style={{
                                                                    width: '9px',
                                                                    height: '9px',
                                                                    backgroundColor: '#0d6efd',
                                                                    borderRadius: '50%',
                                                                    boxShadow: '0 0 0 2px rgba(13,110,253,0.2)'
                                                                }}
                                                            />
                                                        )}
                                                        {notification.title}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <button
                                                            onClick={(e) =>
                                                                handleDeleteNotification(e, notification.id)
                                                            }
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#94a3b8',
                                                                cursor: 'pointer',
                                                                padding: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                borderRadius: '6px',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#fee2e2';
                                                                e.currentTarget.style.color = '#dc2626';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                                e.currentTarget.style.color = '#94a3b8';
                                                            }}
                                                            title="Delete notification"
                                                        >
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M3 6h18" />
                                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        color: '#475569',
                                                        fontSize: '13px',
                                                        marginBottom: '8px',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {notification.message}
                                                </div>

                                                <div
                                                    style={{
                                                        color: '#94a3b8',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <span>
                                                        {new Date(notification.createdAt).toLocaleString([], {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {notification.category && (
                                                        <span
                                                            style={{
                                                                backgroundColor: '#f1f5f9',
                                                                padding: '2px 8px',
                                                                borderRadius: '12px',
                                                                fontSize: '10px',
                                                                color: '#475569',
                                                                textTransform: 'uppercase'
                                                            }}
                                                        >
                                                            {notification.category}
                                                        </span>
                                                    )}
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
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>
                                {user.name}
                            </div>
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
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fecdd3';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff1f2';
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

// Add keyframe animation for ping effect (from second version)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes ping {
        75%, 100% {
            transform: scale(1.2);
            opacity: 0.8;
        }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);

export default StudentNavbar;