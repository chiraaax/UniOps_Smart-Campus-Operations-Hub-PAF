import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 -m-[30px]">
            
            {/* --- LIGHT HERO SECTION --- */}
            <div className="relative overflow-hidden bg-white pt-[120px] pb-[160px] px-6 border-b border-slate-100">
                
                {/* Subtle, Light Animated Background Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] bg-gradient-to-br from-blue-100/80 via-cyan-50/50 to-transparent rounded-full blur-3xl opacity-70 animate-pulse"></div>
                    <div className="absolute top-[200px] -left-[200px] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/60 via-blue-50/40 to-transparent rounded-full blur-3xl opacity-50" style={{ animationDelay: '1s' }}></div>
                    {/* Light grid pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM2NDc0OGIiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utb3BhY2l0eT0iMC4wNCIvPjwvc3ZnPg==')] opacity-60"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center flex flex-col items-center">
                    
                    {/* Small Dark Accent: The Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-800 mb-10 transform transition-transform hover:scale-105 shadow-lg shadow-slate-900/10 cursor-default">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-white text-xs font-bold tracking-widest uppercase">The All-New Smart Campus</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1] max-w-4xl">
                        Welcome to <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Uni Ops</span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                        Your centralized, real-time hub for discovering, viewing, and booking university resources, labs, and equipment.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <button 
                            onClick={() => navigate('/facilities')}
                            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-black text-lg shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.6)] transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group"
                        >
                            Browse Facilities
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-sm"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FEATURES GRID --- */}
            <div className="container mx-auto max-w-6xl px-6 relative z-20 -mt-24 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Card 1 */}
                    <div className="bg-white rounded-3xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 group hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10">
                            🏢
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors relative z-10">Find a Space</h3>
                        <p className="text-slate-500 leading-relaxed font-medium text-[15px] relative z-10">
                            Need a quiet place to study or a large lecture hall for an event? Browse our beautifully organized catalogue of campus spaces.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-3xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 group hover:border-cyan-200 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 relative z-10">
                            💻
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-cyan-600 transition-colors relative z-10">Borrow Equipment</h3>
                        <p className="text-slate-500 leading-relaxed font-medium text-[15px] relative z-10">
                            Check the availability of high-end projectors, cameras, and lab equipment. Instantly see what is active and what is out of service.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-3xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 group hover:border-indigo-200 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10">
                            ⚡
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors relative z-10">Real-Time Status</h3>
                        <p className="text-slate-500 leading-relaxed font-medium text-[15px] relative z-10">
                            No more guessing. Our live database ensures you know exactly what resources are available the moment you log in.
                        </p>
                    </div>

                </div>
            </div>

            {/* --- BOTTOM CALL TO ACTION (Small Dark Accent) --- */}
            <div className="container mx-auto max-w-5xl px-6 mb-32">
                <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-12 md:p-20 text-center shadow-2xl border border-slate-800">
                    
                    {/* Subtle Glow inside the dark card */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to secure your resources?</h2>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
                            Join thousands of students and staff using Uni Ops to streamline their university experience.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => navigate('/register')}
                                className="px-10 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
                            >
                                Get Started Free
                            </button>
                            <button 
                                onClick={() => navigate('/login')}
                                className="px-10 py-4 bg-slate-800/50 hover:bg-slate-700 border-2 border-slate-600 hover:border-slate-500 text-white rounded-xl font-bold text-lg backdrop-blur-md transition-all transform hover:-translate-y-1 active:translate-y-0"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;