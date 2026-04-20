import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/users/login', { email, password });
            window.location.href = '/facilities'; 
        } catch (err) {
            console.error(err);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await login(); 
        navigate('/facilities'); 
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans -m-[30px]">
            
            {/* Left Side: Branding / Gradient (Hidden on small screens) */}
            <div className="hidden md:flex md:w-1/2 lg:w-5/12 relative overflow-hidden bg-slate-900 flex-col justify-center px-12 lg:px-20 text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-600/40 via-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse mix-blend-screen"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-600/30 via-blue-500/20 to-transparent rounded-full blur-3xl mix-blend-screen"></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]"></div>
                </div>

                <div className="relative z-10 max-w-md">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-2xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
                        Welcome back to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Uni Ops</span>
                    </h1>
                    <p className="text-blue-100/80 text-lg leading-relaxed font-medium">
                        Log in to access your dashboard, manage resource bookings, and track facility incidents in real-time.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                
                {/* Mobile-only background gradient blob */}
                <div className="md:hidden absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-b-[40px] opacity-10"></div>

                <div className="w-full max-w-md relative z-10 bg-white md:bg-transparent md:shadow-none p-8 md:p-0 rounded-3xl shadow-xl border border-slate-100 md:border-none">
                    
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Sign In</h2>
                        <p className="text-slate-500 font-medium">Enter your credentials to access your account.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="student@sliit.lk" 
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                                <span className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">Forgot Password?</span>
                            </div>
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••" 
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-400 tracking-widest"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Signing In...
                                </>
                            ) : 'Sign In Securely'}
                        </button>
                    </form>

                    <div className="flex items-center my-8">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Or continue with</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        className="w-full py-4 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                        Google Workspace
                    </button>

                    <p className="text-center mt-10 text-sm font-medium text-slate-500">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/register')} className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                            Register now
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;