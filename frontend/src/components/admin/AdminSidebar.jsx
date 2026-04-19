import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const NavItem = ({ to, icon, label, exact = false }) => {
        const isActive = exact 
            ? location.pathname === to 
            : location.pathname.startsWith(to);

        return (
            <div 
                onClick={() => navigate(to)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium border ${
                    isActive 
                    ? 'bg-blue-500/20 text-white border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md' 
                    : 'text-blue-100/70 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'
                }`}
            >
                <div className={`${isActive ? 'text-blue-400' : 'text-blue-200/50'}`}>
                    {icon}
                </div>
                {label}
            </div>
        );
    };

    return (
        <div className="w-64 h-screen sticky top-0 text-white flex flex-col relative overflow-hidden shrink-0 shadow-2xl z-50 border-r border-blue-900/50" style={{ background: 'linear-gradient(180deg, #084298 0%, #021a41 100%)' }}>
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -m-16 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-40 left-0 -m-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

            {/* Header */}
            <div className="p-6 relative z-10 border-b border-white/10">
                <h2 className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex items-center gap-3 uppercase">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    Uni Ops
                </h2>
            </div>
            
            {/* Nav Links */}
            <div className="flex-1 min-h-0 px-4 py-6 space-y-2 relative z-10 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-bold text-blue-300/60 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                
                <NavItem 
                    to="/admin/dashboard" 
                    exact={true}
                    label="Dashboard" 
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    } 
                />
                
                <NavItem 
                    to="/facilities" 
                    label="Manage Facilities" 
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    } 
                />
                
                <NavItem 
                    to="/admin/bookings" 
                    label="All Bookings" 
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    } 
                />
                
                <NavItem 
                    to="/incidents" 
                    label="Maintenance Tickets" 
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    } 
                />
                
                
            </div>

            {/* Logout Footer */}
            <div className="p-4 relative z-10 border-t border-white/10 bg-black/10">
                <button 
                    onClick={logout} 
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-500 hover:to-rose-500 text-white py-3 rounded-xl transition-all duration-300 font-bold shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:shadow-[0_4px_25px_rgba(225,29,72,0.5)] transform hover:-translate-y-0.5 border border-red-400/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Secure Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;