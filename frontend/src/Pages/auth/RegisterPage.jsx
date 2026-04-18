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
            // Send the data to our new Spring Boot endpoint
            await api.post('/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            alert("Registration successful! Please login.");
            navigate('/login'); // Send them to the login page
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #cfe2ff' }}>
                
                <h2 style={{ color: '#084298', textAlign: 'center', marginBottom: '10px', fontSize: '28px', margin: '0 0 10px 0' }}>Create Account</h2>
                <p style={{ color: '#6c757d', textAlign: 'center', marginBottom: '30px', margin: '0 0 30px 0' }}>Join Campus Nexus</p>

                {error && <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleRegister}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057', display: 'block', marginBottom: '5px' }}>Full Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" style={inputStyle} />

                    <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057', display: 'block', marginBottom: '5px' }}>Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="student@sliit.lk" style={inputStyle} />

                    <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057', display: 'block', marginBottom: '5px' }}>Password</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />

                    <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057', display: 'block', marginBottom: '5px' }}>Confirm Password</label>
                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" style={inputStyle} />

                    <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#084298', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', margin: 0, fontSize: '14px', color: '#6c757d' }}>
                    Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</span>
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;