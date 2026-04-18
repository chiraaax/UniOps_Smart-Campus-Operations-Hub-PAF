import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#084298', color: 'white', padding: '20px 0', textAlign: 'center', marginTop: 'auto' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>&copy; 2026 Campus Nexus (SLIIT). All rights reserved.</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                    <span style={{ cursor: 'pointer', color: '#cfe2ff' }}>Help Center</span>
                    <span style={{ cursor: 'pointer', color: '#cfe2ff' }}>Privacy Policy</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;