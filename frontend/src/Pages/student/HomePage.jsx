import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 -m-[30px]">
            
            {/* --- TECH ELEGANCE HERO --- */}
            <div className="relative overflow-hidden bg-white pt-[120px] pb-[160px] px-6 border-b border-slate-100">
                
                {/* Animated Mesh Gradient Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] bg-gradient-to-br from-blue-100/80 via-cyan-50/50 to-transparent rounded-full blur-3xl opacity-70 animate-[pulse_8s_ease-in-out_infinite]"></div>
                    <div className="absolute top-[200px] -left-[200px] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/60 via-blue-50/40 to-transparent rounded-full blur-3xl opacity-50 animate-[pulse_10s_ease-in-out_infinite_2s]"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-100/30 to-transparent rounded-full blur-3xl opacity-40 animate-[pulse_12s_ease-in-out_infinite_4s]"></div>
                    
                    {/* Subtle Tech Grid + Noise */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM2NDc0OGIiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utb3BhY2l0eT0iMC4wNCIvPjwvc3ZnPg==')] opacity-60 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")` }}></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center flex flex-col items-center">
                    
                    {/* Techy Status Badge */}
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 mb-10 transform transition-all hover:scale-105 shadow-lg shadow-slate-900/20 cursor-default">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-widest uppercase">system.online · v2.0</span>
                        <span className="text-slate-500 text-[10px] font-mono ml-1">⎯ LIVE</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1] max-w-4xl">
                        Welcome to <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 animate-gradient bg-[length:200%_auto]">Uni Ops</span>
                            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400/0 via-cyan-400 to-blue-400/0 blur-sm"></span>
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium backdrop-blur-sm">
                        Your centralized, real-time hub for discovering, viewing, and booking university resources, labs, and equipment.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <button 
                            onClick={() => navigate('/facilities')}
                            className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-black text-lg shadow-[0_10px_30px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_20px_40px_-8px_rgba(37,99,235,0.6)] transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            <span className="relative z-10 flex items-center gap-3">
                                Browse Facilities
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </span>
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="group w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-sm hover:shadow-md"
                        >
                            <span className="relative z-10">Create Account</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FEATURES GRID (Glassmorphism + Tech Accents) --- */}
            <div className="container mx-auto max-w-6xl px-6 relative z-20 -mt-24 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Card 1 */}
                    <div className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 hover:border-blue-300/50 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/40 rounded-bl-full -mr-8 -mt-8 blur-xl transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                🏢
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-blue-700 transition-colors">Find a Space</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-[15px]">
                                Need a quiet place to study or a large lecture hall for an event? Browse our beautifully organized catalogue of campus spaces.
                            </p>
                            <div className="mt-6 h-[1px] w-12 bg-gradient-to-r from-blue-400 to-transparent group-hover:w-20 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 hover:border-cyan-300/50 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/40 rounded-bl-full -mr-8 -mt-8 blur-xl transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-inner">
                                💻
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-cyan-700 transition-colors">Borrow Equipment</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-[15px]">
                                Check the availability of high-end projectors, cameras, and lab equipment. Instantly see what is active and what is out of service.
                            </p>
                            <div className="mt-6 h-[1px] w-12 bg-gradient-to-r from-cyan-400 to-transparent group-hover:w-20 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 hover:border-indigo-300/50 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/40 rounded-bl-full -mr-8 -mt-8 blur-xl transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                ⚡
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-indigo-700 transition-colors">Real-Time Status</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-[15px]">
                                No more guessing. Our live database ensures you know exactly what resources are available the moment you log in.
                            </p>
                            <div className="mt-6 h-[1px] w-12 bg-gradient-to-r from-indigo-400 to-transparent group-hover:w-20 transition-all duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM CTA (Dark + Glowing Tech) --- */}
            <div className="container mx-auto max-w-5xl px-6 mb-32">
                <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-12 md:p-20 text-center shadow-2xl border border-slate-700/50">
                    
                    {/* Animated Glow Orbs */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_2s]"></div>
                    </div>
                    
                    {/* Subtle Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-600/50 mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                            <span className="text-emerald-400 text-xs font-mono tracking-wider">SECURE ACCESS · ZERO TRUST</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to secure your resources?</h2>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-medium">
                            Join thousands of students and staff using <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-bold">Uni Ops</span> to streamline their university experience.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => navigate('/register')}
                                className="group relative px-10 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/20 transition-all transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                <span className="relative z-10">Get Started Free</span>
                            </button>
                            <button 
                                onClick={() => navigate('/login')}
                                className="group relative px-10 py-4 bg-slate-800/70 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white rounded-xl font-bold text-lg backdrop-blur-md transition-all transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                <span className="relative z-10">Sign In</span>
                            </button>
                        </div>
                        
                        {/* Techy footer note */}
                        <p className="mt-8 text-slate-500 text-xs font-mono tracking-wider">
                            <span className="inline-block mr-2">⎯</span> END-TO-END ENCRYPTED · REAL-TIME SYNC <span className="inline-block ml-2">⎯</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Inject custom keyframe animations */}
            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 4s ease infinite;
                }
                .bg-noise {
                    background-repeat: repeat;
                }
            `}</style>
        </div>
    );
};

export default HomePage;