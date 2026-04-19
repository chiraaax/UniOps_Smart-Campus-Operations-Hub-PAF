import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import AddFacilityModal from './AddFacilityModal';
import EditFacilityModal from './EditFacilityModal';

const CARD_ACCENT_BY_TYPE = {
    'Lecture Hall': ['#f97316', '#fdba74'],
    Lab: ['#0ea5e9', '#7dd3fc'],
    'Meeting Room': ['#10b981', '#6ee7b7'],
    Equipment: ['#8b5cf6', '#c4b5fd']
};

const getTypeAccent = (type) => CARD_ACCENT_BY_TYPE[type] || ['#2563eb', '#93c5fd'];

const getStatusTone = (status) => {
    if (status === 'ACTIVE') {
        return {
            backgroundColor: '#dcfce7',
            color: '#166534',
            border: '1px solid #86efac',
            label: 'Available'
        };
    }

    return {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
        label: 'Unavailable'
    };
};

const FacilitiesCatalogue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [facilityToEdit, setFacilityToEdit] = useState(null);

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            const data = await facilityService.getAllFacilities();
            setFacilities(data);
        } catch (error) {
            console.error('Error loading facilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to completely delete this resource?')) {
            try {
                await facilityService.deleteFacility(id);
                fetchFacilities();
            } catch (error) {
                console.error('Failed to delete', error);
                alert('Error deleting resource.');
            }
        }
    };

    const handleEditClick = (facility) => {
        setFacilityToEdit(facility);
        setIsEditModalOpen(true);
    };

    const filteredFacilities = facilities.filter((facility) => {
        const searchValue = searchTerm.toLowerCase();
        const matchSearch =
            facility.name?.toLowerCase().includes(searchValue) ||
            facility.location?.toLowerCase().includes(searchValue);
        const matchType = filterType === 'ALL' || facility.type === filterType;

        return matchSearch && matchType;
    });

    const activeFacilities = facilities.filter((facility) => facility.status === 'ACTIVE').length;
    const totalCapacity = facilities.reduce((sum, facility) => {
        const capacity = Number(facility.capacity);
        return sum + (capacity > 0 ? capacity : 0);
    }, 0);
    const distinctTypes = [...new Set(facilities.map((facility) => facility.type).filter(Boolean))];

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#1d4ed8'
                }}
            >
                <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Loading campus spaces...</div>
                    <div style={{ color: '#64748b' }}>Preparing the latest facility availability and details.</div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background:
                    'radial-gradient(circle at top left, rgba(191, 219, 254, 0.45), transparent 26%), linear-gradient(180deg, #eff6ff 0%, #f8fbff 45%, #ffffff 100%)',
                padding: '24px 0 56px',
                fontFamily: 'Segoe UI, sans-serif'
            }}
        >
            <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
                <section
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #38bdf8 100%)',
                        color: '#ffffff',
                        borderRadius: '30px',
                        padding: '30px',
                        boxShadow: '0 30px 80px rgba(30, 64, 175, 0.22)',
                        marginBottom: '24px'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ maxWidth: '650px' }}>
                            <div
                                style={{
                                    fontSize: '12px',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.72)',
                                    marginBottom: '12px'
                                }}
                            >
                                Smart Campus Resource Hub
                            </div>
                            <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(32px, 5vw, 46px)', lineHeight: 1.05 }}>
                                Find the right space faster
                            </h1>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.86)', lineHeight: 1.7, fontSize: '16px' }}>
                                Browse classrooms, labs, meeting rooms, and shared resources in one place. Search by name or location,
                                review availability, and jump straight into booking.
                            </p>
                        </div>

                        {user && user.role === 'ADMIN' && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#0f172a',
                                    border: 'none',
                                    padding: '14px 18px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 16px 30px rgba(15, 23, 42, 0.18)'
                                }}
                            >
                                + Add Resource
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginTop: '28px' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '20px', padding: '18px' }}>
                            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>Total resources</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px' }}>{facilities.length}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '20px', padding: '18px' }}>
                            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>Available now</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px' }}>{activeFacilities}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '20px', padding: '18px' }}>
                            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>Resource types</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px' }}>{distinctTypes.length}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '20px', padding: '18px' }}>
                            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>Combined capacity</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px' }}>{totalCapacity || 'N/A'}</div>
                        </div>
                    </div>
                </section>

                <section
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid #dbeafe',
                        borderRadius: '24px',
                        padding: '20px',
                        marginBottom: '24px',
                        boxShadow: '0 18px 45px rgba(148, 163, 184, 0.16)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                        <div>
                            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px' }}>Search and filter</h2>
                            <p style={{ margin: '6px 0 0', color: '#64748b' }}>Narrow down resources by name, location, or category.</p>
                        </div>
                        {(searchTerm || filterType !== 'ALL') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('ALL');
                                }}
                                style={{
                                    border: '1px solid #bfdbfe',
                                    backgroundColor: '#eff6ff',
                                    color: '#1d4ed8',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(220px, 0.7fr)', gap: '14px' }}>
                        <input
                            type="text"
                            placeholder="Search by resource name or location"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '16px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                boxSizing: 'border-box',
                                fontSize: '15px'
                            }}
                        />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '16px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                fontSize: '15px'
                            }}
                        >
                            <option value="ALL">All Types</option>
                            <option value="Lecture Hall">Lecture Hall</option>
                            <option value="Lab">Lab</option>
                            <option value="Meeting Room">Meeting Room</option>
                            <option value="Equipment">Equipment</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                        <div style={{ padding: '8px 12px', borderRadius: '999px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 'bold', fontSize: '13px' }}>
                            Showing {filteredFacilities.length} resources
                        </div>
                        {filterType !== 'ALL' && (
                            <div style={{ padding: '8px 12px', borderRadius: '999px', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '13px' }}>
                                Filter: {filterType}
                            </div>
                        )}
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>
                    {filteredFacilities.length === 0 ? (
                        <div
                            style={{
                                gridColumn: '1 / -1',
                                backgroundColor: '#ffffff',
                                borderRadius: '24px',
                                border: '1px dashed #cbd5e1',
                                padding: '42px 24px',
                                textAlign: 'center',
                                boxShadow: '0 16px 40px rgba(148, 163, 184, 0.12)'
                            }}
                        >
                            <h3 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: '24px' }}>No matching resources found</h3>
                            <p style={{ margin: '0 0 18px', color: '#64748b', lineHeight: 1.7 }}>
                                Try a different keyword, switch the type filter, or reset the search to see all available spaces.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('ALL');
                                }}
                                style={{
                                    backgroundColor: '#0f62fe',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '14px',
                                    padding: '12px 18px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Reset search
                            </button>
                        </div>
                    ) : (
                        filteredFacilities.map((facility) => {
                            const accent = getTypeAccent(facility.type);
                            const statusTone = getStatusTone(facility.status);

                            return (
                                <div
                                    key={facility.id}
                                    style={{
                                        border: '1px solid #dbeafe',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)'
                                    }}
                                >
                                    {facility.imageUrl ? (
                                        <img src={facility.imageUrl} alt={facility.name} style={{ width: '100%', height: '190px', objectFit: 'cover' }} />
                                    ) : (
                                        <div
                                            style={{
                                                height: '190px',
                                                background: `linear-gradient(135deg, ${accent[0]} 0%, ${accent[1]} 100%)`,
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                padding: '20px'
                                            }}
                                        >
                                            <div style={{ color: '#ffffff' }}>
                                                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.85 }}>Campus Resource</div>
                                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>{facility.type || 'Facility'}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '6px' }}>
                                                    {facility.type || 'Shared Space'}
                                                </div>
                                                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '23px', lineHeight: 1.2 }}>{facility.name}</h3>
                                            </div>
                                            <span
                                                style={{
                                                    ...statusTone,
                                                    fontSize: '12px',
                                                    padding: '7px 10px',
                                                    borderRadius: '999px',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {statusTone.label}
                                            </span>
                                        </div>

                                        <p style={{ margin: '0 0 16px', color: '#475569', minHeight: '44px', lineHeight: 1.6 }}>
                                            {facility.location || 'Location not provided'}
                                        </p>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginBottom: '18px' }}>
                                            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px' }}>
                                                <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Capacity</div>
                                                <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '18px', marginTop: '8px' }}>
                                                    {facility.capacity > 0 ? `${facility.capacity} people` : 'Not listed'}
                                                </div>
                                            </div>
                                            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px' }}>
                                                <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hours</div>
                                                <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' }}>
                                                    {facility.openTime || 'N/A'} - {facility.closeTime || 'N/A'}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/facilities/${facility.id}`)}
                                            style={{
                                                width: '100%',
                                                padding: '13px 16px',
                                                background: 'linear-gradient(135deg, #0b4aa6 0%, #0d6efd 100%)',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '14px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '15px',
                                                boxShadow: '0 14px 28px rgba(13, 110, 253, 0.18)'
                                            }}
                                        >
                                            View Details and Book
                                        </button>

                                        {user && user.role === 'ADMIN' && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginTop: '12px' }}>
                                                <button
                                                    onClick={() => handleEditClick(facility)}
                                                    style={{
                                                        padding: '11px',
                                                        backgroundColor: '#fff7ed',
                                                        color: '#9a3412',
                                                        border: '1px solid #fdba74',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(facility.id)}
                                                    style={{
                                                        padding: '11px',
                                                        backgroundColor: '#fef2f2',
                                                        color: '#b91c1c',
                                                        border: '1px solid #fca5a5',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <AddFacilityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onFacilityAdded={fetchFacilities}
            />

            <EditFacilityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onFacilityUpdated={fetchFacilities}
                facility={facilityToEdit}
            />
        </div>
    );
};

export default FacilitiesCatalogue;
