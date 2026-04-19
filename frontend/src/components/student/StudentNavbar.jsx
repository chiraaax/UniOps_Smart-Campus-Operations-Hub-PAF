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
                console.log("General notification clicked");
                break;
        }
    };

    const handleDeleteNotification = async (e, id) => {
        e.stopPropagation(); 
        try {
            await notificationService.deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead(user.id);
        fetchNotifications();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Helper for active link styling
    const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

    return (
        <nav className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 transition-all duration-300 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Logo & Navigation Links */}
                <div className="flex items-center gap-10">
                    <div 
                        onClick={() => navigate('/')} 
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <h2 className="m-0 text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent hidden sm:block">
                            Uni Ops
                        </h2>
                    </div>

                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                        <button 
                            onClick={() => navigate('/')} 
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive('/') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
                        >
                            Home
                        </button>
                        <button 
                            onClick={() => navigate('/facilities')} 
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive('/facilities') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
                        >
                            Facilities
                        </button>
                        
                        {user && (
                            <button 
                                onClick={() => navigate('/my-bookings')} 
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive('/my-bookings') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
                            >
                                My Bookings
                            </button>
                        )}

                        <button 
                            onClick={() => navigate('/incidents')} 
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive('/incidents') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
                        >
                            Incidents
                        </button>
                    </div>
                </div>

                {/* User Controls */}
                {user ? (
                    <div className="flex items-center gap-5 md:gap-8">
                        
                        {/* Notifications Dropdown */}
                        <div ref={dropdownRef} className="relative">
                            <button 
                                onClick={() => {
                                    setShowDropdown(!showDropdown);
                                    if (!showDropdown) fetchNotifications(); 
                                }} 
                                className={`relative p-2.5 rounded-xl transition-all duration-200 outline-none ${showDropdown ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white items-center justify-center text-[9px] font-black text-white">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    </span>
                                )}
                            </button>

                            {showDropdown && (
                                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                                    
                                    <div className="px-6 py-5 bg-slate-900 flex justify-between items-center relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                                        <h4 className="m-0 text-white font-extrabold text-lg flex items-center gap-2 relative z-10">
                                            Notifications
                                        </h4>
                                        {unreadCount > 0 && (
                                            <button onClick={handleMarkAllRead} className="relative z-10 text-[11px] bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-bold transition-colors">
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="max-h-[400px] overflow-y-auto bg-slate-50/50 p-2">
                                        {notifications.length === 0 ? (
                                            <div className="py-12 text-center flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                                </div>
                                                <p className="text-slate-500 font-bold text-sm">All caught up!</p>
                                                <p className="text-slate-400 text-xs mt-1">No new notifications.</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div 
                                                    key={notif.id} 
                                                    onClick={() => handleNotificationClick(notif)}
                                                    className={`mb-2 p-4 rounded-2xl cursor-pointer transition-all duration-200 border group flex gap-4 ${notif.read ? 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm' : 'bg-blue-50/80 border-blue-100 shadow-sm'}`}
                                                >
                                                    <div className="shrink-0 mt-1">
                                                        {!notif.read ? (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                        ) : (
                                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300"></div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h5 className={`m-0 text-[14px] truncate pr-4 ${notif.read ? 'text-slate-700 font-bold' : 'text-slate-900 font-extrabold'}`}>
                                                                {notif.title}
                                                            </h5>
                                                            <button 
                                                                onClick={(e) => handleDeleteNotification(e, notif.id)}
                                                                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all shrink-0"
                                                                title="Delete Notification"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                        
                                                        <p className={`text-[13px] leading-relaxed mb-3 ${notif.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                                                            {notif.message}
                                                        </p>
                                                        
                                                        <div className="flex items-center justify-between text-[11px] font-bold">
                                                            <span className="text-slate-400">
                                                                {new Date(notif.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {notif.category && (
                                                                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 tracking-wider uppercase">
                                                                    {notif.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Info & Logout */}
                        <div className="hidden sm:flex items-center gap-4 pl-4 md:pl-6 md:border-l md:border-slate-200">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged In</span>
                                <span className="text-sm font-extrabold text-slate-800">{user.name}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button 
                                onClick={() => { logout(); navigate('/'); }} 
                                className="p-2.5 ml-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                                title="Logout"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        </div>
                        
                        {/* Mobile Menu Button (simplified for brevity, relies on existing routing logic) */}
                        <div className="sm:hidden flex items-center gap-3">
                            <button onClick={() => { logout(); navigate('/'); }} className="text-[11px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                            Sign In
                        </button>
                        <button 
                            onClick={() => navigate('/register')} 
                            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_15px_-3px_rgba(0,0,0,0.5)] transform transition-all active:scale-95"
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default StudentNavbar;