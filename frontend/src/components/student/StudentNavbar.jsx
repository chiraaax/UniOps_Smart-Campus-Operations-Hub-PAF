import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

const StudentNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- Notification States ---
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch Notifications
    const fetchNotifications = async () => {
        if (user && user.id) {
            try {
                const data = await notificationService.getUserNotifications(user.id);
                setNotifications(data);
            } catch (error) {
                console.error("Failed to load notifications", error);
            }
        }
    };

    // Load + outside click handler
    useEffect(() => {
        fetchNotifications();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [user]);

    // Notification actions
    const handleNotificationClick = async (id) => {
        await notificationService.markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead(user.id);
        fetchNotifications();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <nav style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #cfe2ff',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            position: 'relative',
            fontFamily: 'sans-serif'
        }}>
            {/* LEFT SIDE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                
                {/* LOGO */}
                <h2
                    onClick={() => navigate('/')}
                    style={{ margin: 0, color: '#084298', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Campus Nexus
                </h2>

                {/* NAV LINKS */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                        Home
                    </span>

                    <span onClick={() => navigate('/facilities')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                        Facilities
                    </span>

                    {user && (
                        <span onClick={() => navigate('/my-bookings')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                            My Bookings
                        </span>
                    )}

                    {/* Added from version 2 */}
                    <span onClick={() => navigate('/incidents')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                        Incidents
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE */}
            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                    {/* 🔔 NOTIFICATION BELL */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <div
                            onClick={() => {
                                setShowDropdown(!showDropdown);
                                fetchNotifications();
                            }}
                            style={{ cursor: 'pointer', fontSize: '22px', position: 'relative', padding: '5px' }}
                        >
                            🔔
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '50%',
                                    border: '2px solid white'
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        {/* DROPDOWN */}
                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '45px',
                                right: '-50px',
                                width: '320px',
                                backgroundColor: 'white',
                                border: '1px solid #cfe2ff',
                                borderRadius: '8px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                overflow: 'hidden'
                            }}>
                                {/* HEADER */}
                                <div style={{
                                    padding: '12px 15px',
                                    backgroundColor: '#f8f9fa',
                                    borderBottom: '1px solid #cfe2ff',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h4 style={{ margin: 0, color: '#084298', fontSize: '16px' }}>
                                        Notifications
                                    </h4>
                                    {unreadCount > 0 && (
                                        <span
                                            onClick={handleMarkAllRead}
                                            style={{ fontSize: '12px', color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Mark all read
                                        </span>
                                    )}
                                </div>

                                {/* BODY */}
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '30px', textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => handleNotificationClick(notif.id)}
                                                style={{
                                                    padding: '15px',
                                                    borderBottom: '1px solid #e9ecef',
                                                    backgroundColor: notif.read ? 'white' : '#f0f4fb',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#212529', fontSize: '14px' }}>
                                                        {notif.title}
                                                    </div>
                                                    {!notif.read && (
                                                        <div style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            backgroundColor: '#0d6efd',
                                                            borderRadius: '50%'
                                                        }} />
                                                    )}
                                                </div>

                                                <div style={{ color: '#495057', fontSize: '13px', marginBottom: '8px' }}>
                                                    {notif.message}
                                                </div>

                                                {/* Timestamp from version 1 */}
                                                <div style={{ color: '#adb5bd', fontSize: '11px', fontWeight: 'bold' }}>
                                                    {new Date(notif.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <span style={{ fontWeight: 'bold', color: '#084298' }}>
                        Hi, {user.name}
                    </span>

                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        style={{
                            backgroundColor: '#f8f9fa',
                            color: '#dc3545',
                            border: '1px solid #dc3545',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            backgroundColor: 'white',
                            color: '#0d6efd',
                            border: '1px solid #0d6efd',
                            padding: '8px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            backgroundColor: '#0d6efd',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '5px',
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