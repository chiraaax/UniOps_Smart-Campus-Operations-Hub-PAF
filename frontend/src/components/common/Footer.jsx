import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-700 border-t border-blue-500/40 py-10 mt-auto font-sans relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-300/40 rounded-full blur-3xl mix-blend-screen"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-300/40 rounded-full blur-3xl mix-blend-screen"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Brand & Copyright */}
                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="text-blue-50 font-extrabold tracking-tight text-lg">Uni Ops</span>
                    </div>
                    <p className="text-blue-100/85 text-sm font-medium">
                        &copy; 2026 Uni Ops (SLIIT). All rights reserved.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-bold text-blue-100/85">
                    <button className="hover:text-white transition-colors duration-200">
                        Help Center
                    </button>
                    <button className="hover:text-white transition-colors duration-200">
                        Privacy Policy
                    </button>
                    <button className="hover:text-white transition-colors duration-200">
                        Terms of Service
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;