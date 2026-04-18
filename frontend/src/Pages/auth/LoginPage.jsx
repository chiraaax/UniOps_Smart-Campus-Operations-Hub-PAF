import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api'; // <-- We need the API to talk to Spring Boot!

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
            // 1. Send credentials to Spring Boot
            await api.post('/users/login', { email, password });
            
            // 2. If successful, force a reload to /facilities. 
            // This makes AuthContext automatically grab the new session!
            window.location.href = '/facilities'; 
        } catch (err) {
            console.error(err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await login(); 
        navigate('/facilities'); 
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #cfe2ff' }}>
                
                <h2 style={{ color: '#084298', textAlign: 'center', marginBottom: '10px', fontSize: '28px', margin: '0 0 10px 0' }}>Welcome Back</h2>
                <p style={{ color: '#6c757d', textAlign: 'center', marginBottom: '30px', margin: '0 0 30px 0' }}>Sign in to Campus Nexus</p>

                {/* Show errors if they type the wrong password */}
                {error && <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                {/* Email / Password Form */}
                <form onSubmit={handleEmailLogin}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057', display: 'block', marginBottom: '5px' }}>Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@sliit.lk" style={inputStyle} />

                    <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057', display: 'block', marginBottom: '5px' }}>Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />

                    <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#084298', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Divider Line */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#dee2e6' }}></div>
                    <span style={{ padding: '0 10px', color: '#6c757d', fontSize: '14px', fontWeight: 'bold' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#dee2e6' }}></div>
                </div>

                {/* Google Login Button */}
                <button type="button" onClick={handleGoogleLogin} style={{ width: '100%', backgroundColor: 'white', color: '#495057', border: '1px solid #ccc', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    Continue with Google
                </button>

                <p style={{ textAlign: 'center', margin: '20px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
                    Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold' }}>Register Here</span>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;