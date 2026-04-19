import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            await api.post('/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            alert("Registration successful! Please sign in.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row-reverse font-sans -m-[30px]">
            
            {/* Right Side: Branding / Gradient (Hidden on small screens) */}
            <div className="hidden md:flex md:w-1/2 lg:w-5/12 relative overflow-hidden bg-slate-900 flex-col justify-center px-12 lg:px-20 text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-bl from-indigo-600/40 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/30 via-blue-500/20 to-transparent rounded-full blur-3xl mix-blend-screen" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]"></div>
                </div>

                <div className="relative z-10 max-w-md">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-2xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Uni Ops</span>
                    </h1>
                    <p className="text-blue-100/80 text-lg leading-relaxed font-medium mb-8">
                        Create an account to browse facilities, request bookings, and manage campus resources from one intelligent dashboard.
                    </p>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-sm font-semibold text-white/70">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Instant Facility Bookings
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-white/70">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Real-time Resource Tracking
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-white/70">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Smart QR Code Check-ins
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side: Registration Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                
                {/* Mobile-only background gradient blob */}
                <div className="md:hidden absolute top-0 left-0 right-0 h-64 bg-gradient-to-bl from-blue-600 to-cyan-500 rounded-b-[40px] opacity-10"></div>

                <div className="w-full max-w-md relative z-10 bg-white md:bg-transparent md:shadow-none p-8 md:p-0 rounded-3xl shadow-xl border border-slate-100 md:border-none">
                    
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium">Set up your profile to get started.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                required 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="John Doe" 
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="student@sliit.lk" 
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    required 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    placeholder="••••••••" 
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-400 tracking-widest"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Confirm Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    required 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    placeholder="••••••••" 
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-400 tracking-widest"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Creating Account...
                                </>
                            ) : 'Register Account'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm font-medium text-slate-500">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                            Sign In securely
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;