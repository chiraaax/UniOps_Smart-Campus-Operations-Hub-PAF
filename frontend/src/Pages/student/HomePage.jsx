import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const heroImages = [
        '/facilityImage/1776456652576_lectureroom360.jpg',
        '/facilityImage/1776456608745_ExamRoom1.jpg',
        '/facilityImage/1776456509152_lectureRoom1.jpg'
    ];

    const showcaseSpaces = [
        {
            title: 'Lecture Halls',
            image: '/facilityImage/1776456652576_lectureroom360.jpg',
            description: 'Comfortable spaces for presentations, large classes, and campus events.'
        },
        {
            title: 'Exam Rooms',
            image: '/facilityImage/1776456608745_ExamRoom1.jpg',
            description: 'Quiet and focused rooms for assessments, workshops, and formal sessions.'
        },
        {
            title: 'Study Spaces',
            image: '/facilityImage/1776456559587_lectureRoom2.jpg',
            description: 'Flexible rooms for group work, planning, and everyday student activity.'
        }
    ];

    const primaryActionLabel = user ? 'Explore Facilities' : 'Start Exploring';
    const secondaryActionLabel = user ? 'View My Bookings' : 'Create Account';

    return (
        <div style={{ maxWidth: '1180px', margin: '0 auto', paddingBottom: '48px', fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif' }}>
            <style>
                {`
                    .nexus-hero-grid,
                    .nexus-content-grid,
                    .nexus-image-grid {
                        display: grid;
                    }

                    .nexus-float-card,
                    .nexus-feature-card,
                    .nexus-path-card,
                    .nexus-action-button {
                        transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease, background-color 0.28s ease;
                    }

                    .nexus-feature-card:hover,
                    .nexus-path-card:hover,
                    .nexus-float-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
                    }

                    .nexus-action-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 14px 28px rgba(15, 23, 42, 0.18);
                    }

                    @media (max-width: 920px) {
                        .nexus-hero-grid,
                        .nexus-content-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 640px) {
                        .nexus-image-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>

            <section
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '32px',
                    padding: '40px',
                    marginBottom: '32px',
                    background: 'radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 28%), linear-gradient(135deg, #0f172a 0%, #0b4aa6 48%, #74c0fc 100%)',
                    color: '#ffffff',
                    boxShadow: '0 28px 60px rgba(11, 74, 166, 0.24)'
                }}
            >
                <div style={{ position: 'absolute', top: '-70px', right: '-20px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: '-90px', left: '58%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

                <div className="nexus-hero-grid" style={{ position: 'relative', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(300px, 0.95fr)', gap: '26px', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)', padding: '8px 16px', borderRadius: '999px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
                            Smart Campus Experience
                        </div>

                        <h1 style={{ fontSize: '56px', lineHeight: 1.05, margin: '0 0 18px', letterSpacing: '-1.4px' }}>
                            Find the right campus space in a simple, beautiful way.
                        </h1>

                        <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'rgba(255,255,255,0.86)', maxWidth: '660px', margin: '0 0 24px' }}>
                            Browse spaces, request bookings, track approvals, and use real facility images to quickly understand where you want to go.
                        </p>

                        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '18px', padding: '16px 18px', marginBottom: '22px', maxWidth: '580px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '16px' }}>Quick start</div>
                            <div style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, fontSize: '14px' }}>
                                Browse facilities, choose a space, request your booking, and download the QR pass after approval.
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
                            <button
                                className="nexus-action-button"
                                onClick={() => navigate('/facilities')}
                                style={{ backgroundColor: '#fff7ed', color: '#0f172a', border: 'none', padding: '15px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                            >
                                {primaryActionLabel}
                            </button>
                            <button
                                className="nexus-action-button"
                                onClick={() => navigate(user ? '/my-bookings' : '/register')}
                                style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.34)', padding: '15px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                            >
                                {secondaryActionLabel}
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', maxWidth: '720px' }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>24/7</div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', marginTop: '6px' }}>Facility information any time</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Live</div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', marginTop: '6px' }}>Booking and approval tracking</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '18px', padding: '16px' }}>
                                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>QR</div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', marginTop: '6px' }}>Download approved booking passes</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '14px' }}>
                        <div className="nexus-float-card" style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '28px', padding: '14px' }}>
                            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '22px', minHeight: '250px', marginBottom: '14px' }}>
                                <img
                                    src={heroImages[0]}
                                    alt="Featured campus lecture hall"
                                    style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0.56) 100%)' }} />
                                <div style={{ position: 'absolute', left: '16px', right: '16px', bottom: '16px' }}>
                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.78)', marginBottom: '8px' }}>
                                        Featured Space
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '6px' }}>See the place before you book it</div>
                                    <div style={{ color: 'rgba(255,255,255,0.84)', lineHeight: 1.6, fontSize: '14px' }}>
                                        Real facility photos make choosing spaces faster and easier for students.
                                    </div>
                                </div>
                            </div>

                            <div className="nexus-image-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {heroImages.slice(1).map((image, index) => (
                                    <div key={image} style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', minHeight: '108px' }}>
                                        <img
                                            src={image}
                                            alt={index === 0 ? 'Exam room' : 'Study space'}
                                            style={{ width: '100%', height: '108px', objectFit: 'cover', display: 'block' }}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.02) 0%, rgba(15,23,42,0.42) 100%)' }} />
                                        <div style={{ position: 'absolute', left: '12px', bottom: '10px', color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>
                                            {index === 0 ? 'Quiet exam area' : 'Flexible study room'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="nexus-float-card" style={{ background: '#fffdf8', color: '#0f172a', borderRadius: '24px', padding: '18px', border: '1px solid rgba(255,255,255,0.22)' }}>
                            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '8px' }}>
                                Booking Flow
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>Request. Approve. Use.</div>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <div style={{ backgroundColor: '#fff7ed', borderRadius: '16px', padding: '12px 14px' }}>1. Browse the best facility for your work.</div>
                                <div style={{ backgroundColor: '#eff6ff', borderRadius: '16px', padding: '12px 14px' }}>2. Send a booking request with your time and purpose.</div>
                                <div style={{ backgroundColor: '#ecfdf5', borderRadius: '16px', padding: '12px 14px' }}>3. Download the QR pass after approval.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    <div>
                        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '8px' }}>
                            Featured Spaces
                        </div>
                        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '34px' }}>Real campus spaces, shown in a clear way.</h2>
                    </div>
                    <button
                        className="nexus-action-button"
                        onClick={() => navigate('/facilities')}
                        style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '12px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                    >
                        View Full Catalogue
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                    {showcaseSpaces.map((space) => (
                        <article
                            key={space.title}
                            className="nexus-feature-card"
                            style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #dbeafe', overflow: 'hidden', boxShadow: '0 16px 35px rgba(15, 23, 42, 0.06)' }}
                        >
                            <img
                                src={space.image}
                                alt={space.title}
                                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                            />
                            <div style={{ padding: '22px' }}>
                                <h3 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: '24px' }}>{space.title}</h3>
                                <p style={{ margin: 0, color: '#64748b', lineHeight: 1.8, fontSize: '15px' }}>{space.description}</p>
                                <button
                                    className="nexus-action-button"
                                    onClick={() => navigate('/facilities')}
                                    style={{ marginTop: '16px', backgroundColor: '#0b4aa6', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                    View Spaces
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px', marginBottom: '32px' }}>
                {[
                    {
                        title: 'Find the right space',
                        accent: '#e0f2fe',
                        badge: 'Browse',
                        description: 'Search organized facilities for study, events, labs, and collaborative work without wasting time.'
                    },
                    {
                        title: 'Track booking progress',
                        accent: '#ecfccb',
                        badge: 'Manage',
                        description: 'See pending, approved, rejected, and cancelled requests in one dashboard with a cleaner workflow.'
                    },
                    {
                        title: 'Stay issue-aware',
                        accent: '#fef3c7',
                        badge: 'Respond',
                        description: 'Report incidents quickly and keep an eye on the current condition of the spaces you use.'
                    }
                ].map((item) => (
                    <article
                        key={item.title}
                        className="nexus-feature-card"
                        style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #dbeafe', padding: '24px', boxShadow: '0 16px 35px rgba(15, 23, 42, 0.06)' }}
                    >
                        <div style={{ width: '58px', height: '58px', borderRadius: '18px', backgroundColor: item.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0f172a', marginBottom: '18px' }}>
                            {item.badge}
                        </div>
                        <h3 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: '24px' }}>{item.title}</h3>
                        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.8, fontSize: '15px' }}>{item.description}</p>
                    </article>
                ))}
            </section>

            <section
                className="nexus-content-grid"
                style={{
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                    gap: '20px',
                    marginBottom: '32px'
                }}
            >
                <div style={{ background: 'linear-gradient(180deg, #fffdf8 0%, #ffffff 100%)', border: '1px solid #fde68a', borderRadius: '28px', padding: '28px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)' }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#92400e', marginBottom: '10px' }}>
                        Campus Rhythm
                    </div>
                    <h2 style={{ margin: '0 0 12px', fontSize: '34px', color: '#0f172a', lineHeight: 1.15 }}>
                        A cleaner way to plan your day on campus.
                    </h2>
                    <p style={{ margin: '0 0 22px', color: '#5b6475', lineHeight: 1.8, fontSize: '16px' }}>
                        Whether you are coordinating a team meeting, reserving a lab, or preparing for an event, the platform brings availability, requests, and follow-up into one student-friendly flow.
                    </p>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        {[
                            'Spot available spaces before you walk across campus.',
                            'Keep approved bookings with downloadable QR access.',
                            'Move from issue reporting to resolution tracking with less friction.'
                        ].map((line) => (
                            <div key={line} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', border: '1px solid #fdecc8', borderRadius: '16px', padding: '14px 16px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '999px', backgroundColor: '#f59e0b' }} />
                                <div style={{ color: '#334155', lineHeight: 1.6 }}>{line}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '18px' }}>
                    {[
                        {
                            title: 'Facilities',
                            subtitle: 'Browse learning spaces and shared resources.',
                            action: () => navigate('/facilities'),
                            actionLabel: 'Open Facilities',
                            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                        },
                        {
                            title: user ? 'My Bookings' : 'Join the Platform',
                            subtitle: user ? 'Track approvals and download your booking pass.' : 'Create an account to book spaces and manage requests.',
                            action: () => navigate(user ? '/my-bookings' : '/register'),
                            actionLabel: user ? 'Open Bookings' : 'Register Now',
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                        }
                    ].map((card) => (
                        <article
                            key={card.title}
                            className="nexus-path-card"
                            style={{ background: card.background, borderRadius: '24px', padding: '24px', border: '1px solid rgba(148, 163, 184, 0.22)', boxShadow: '0 16px 35px rgba(15, 23, 42, 0.06)' }}
                        >
                            <h3 style={{ margin: '0 0 8px', fontSize: '26px', color: '#0f172a' }}>{card.title}</h3>
                            <p style={{ margin: '0 0 18px', color: '#475569', lineHeight: 1.75 }}>{card.subtitle}</p>
                            <button
                                className="nexus-action-button"
                                onClick={card.action}
                                style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '12px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                            >
                                {card.actionLabel}
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            <section
                style={{
                    borderRadius: '30px',
                    padding: '34px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 52%, #38bdf8 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    boxShadow: '0 24px 50px rgba(15, 23, 42, 0.16)'
                }}
            >
                <div>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.72)', marginBottom: '10px' }}>
                        Ready When You Are
                    </div>
                    <h2 style={{ margin: '0 0 10px', fontSize: '36px', lineHeight: 1.1 }}>Build a smoother campus routine.</h2>
                    <p style={{ margin: 0, maxWidth: '640px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.8 }}>
                        Start by exploring facilities, checking your bookings, or joining the platform to manage everything from one place.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        className="nexus-action-button"
                        onClick={() => navigate('/facilities')}
                        style={{ backgroundColor: '#ffffff', color: '#0f172a', border: 'none', padding: '14px 22px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
                    >
                        Browse Facilities
                    </button>
                    <button
                        className="nexus-action-button"
                        onClick={() => navigate(user ? '/incidents' : '/login')}
                        style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.32)', padding: '14px 22px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
                    >
                        {user ? 'View Incidents' : 'Sign In'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
