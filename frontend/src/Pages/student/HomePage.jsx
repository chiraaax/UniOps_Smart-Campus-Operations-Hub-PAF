import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif', paddingBottom: '40px' }}>
            
            {/* Embedded CSS for smooth hover animations! */}
            <style>
                {`
                    .hero-button { transition: all 0.3s ease; }
                    .hero-button:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
                    
                    .feature-card { transition: all 0.3s ease; border: 1px solid #e2e8f0; }
                    .feature-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(13, 110, 253, 0.1); border-color: #b6d4fe; }
                    
                    .cta-button { transition: all 0.3s ease; }
                    .cta-button:hover { background-color: #0b5ed7; transform: translateY(-2px); }
                `}
            </style>

            {/* --- HERO SECTION --- */}
            <div style={{ 
                background: 'linear-gradient(135deg, #084298 0%, #0d6efd 100%)', 
                color: 'white', 
                padding: '80px 40px', 
                borderRadius: '16px', 
                textAlign: 'center', 
                marginBottom: '50px', 
                boxShadow: '0 15px 35px rgba(8, 66, 152, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Optional: A subtle badge at the top */}
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px' }}>
                    🚀 THE ALL-NEW SMART CAMPUS
                </div>

                <h1 style={{ fontSize: '56px', margin: '0 0 20px 0', fontWeight: '800', letterSpacing: '-1px' }}>Welcome to Campus Nexus</h1>
                <p style={{ fontSize: '22px', color: '#e0ecff', margin: '0 auto 40px auto', maxWidth: '650px', lineHeight: '1.5' }}>
                    Your centralized, real-time hub for discovering, viewing, and booking university resources, labs, and equipment.
                </p>
                
                <button 
                    className="hero-button"
                    onClick={() => navigate('/facilities')}
                    style={{ backgroundColor: 'white', color: '#084298', border: 'none', padding: '16px 40px', fontSize: '18px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    Browse All Facilities &rarr;
                </button>
            </div>

            {/* --- FEATURES GRID (Upgraded to 3 Cards) --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                
                <div className="feature-card" style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏢</div>
                    <h3 style={{ color: '#084298', marginTop: 0, fontSize: '24px', fontWeight: '700' }}>Find a Space</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '16px', margin: 0 }}>
                        Need a quiet place to study or a large lecture hall for an event? Browse our beautifully organized catalogue of campus spaces.
                    </p>
                </div>

                <div className="feature-card" style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>💻</div>
                    <h3 style={{ color: '#084298', marginTop: 0, fontSize: '24px', fontWeight: '700' }}>Borrow Equipment</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '16px', margin: 0 }}>
                        Check the availability of high-end projectors, cameras, and lab equipment. Instantly see what is active and what is out of service.
                    </p>
                </div>

                <div className="feature-card" style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚡</div>
                    <h3 style={{ color: '#084298', marginTop: 0, fontSize: '24px', fontWeight: '700' }}>Real-Time Status</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '16px', margin: 0 }}>
                        No more guessing. Our live database ensures you know exactly what resources are available the moment you log in.
                    </p>
                </div>

            </div>

            {/* --- BOTTOM CALL TO ACTION (For logged-out users) --- */}
            <div style={{ backgroundColor: '#f8fafc', padding: '50px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: '#0f172a', margin: '0 0 15px 0', fontSize: '32px' }}>Ready to secure your resources?</h2>
                <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '500px', margin: '0 0 30px 0' }}>
                    Join thousands of students and staff using Campus Nexus to streamline their university experience.
                </p>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="cta-button"
                        onClick={() => navigate('/register')}
                        style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '14px 30px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Create an Account
                    </button>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{ backgroundColor: 'transparent', color: '#084298', border: '2px solid #084298', padding: '12px 30px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Sign In
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HomePage;