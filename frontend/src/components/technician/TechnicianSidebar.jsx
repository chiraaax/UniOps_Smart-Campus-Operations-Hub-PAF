import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const TechnicianSidebar = () => {
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
        <div className="w-64 min-h-screen text-white flex flex-col relative overflow-hidden shrink-0 shadow-2xl z-50 border-r border-blue-900/50" style={{ background: 'linear-gradient(180deg, #084298 0%, #021a41 100%)' }}>
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -m-16 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-40 left-0 -m-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

            {/* Header */}
            <div className="p-6 relative z-10 border-b border-white/10">
                <h2 className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex items-center gap-3 uppercase">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    Uni Ops
                </h2>
            </div>
            
            {/* Nav Links */}
            <div className="flex-1 px-4 py-6 space-y-2 relative z-10 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-bold text-blue-300/60 uppercase tracking-wider mb-4 px-2">Workspace</div>
                
                <NavItem 
                    to="/technician/dashboard" 
                    label="My Dashboard" 
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
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

export default TechnicianSidebar;
