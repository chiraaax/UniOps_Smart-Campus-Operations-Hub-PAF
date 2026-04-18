import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import AddFacilityModal from './AddFacilityModal'; 
import EditFacilityModal from './EditFacilityModal'; // IMPORT THE NEW MODAL!

const FacilitiesCatalogue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // State to track which facility is currently being edited
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
            console.error("Error loading facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- NEW: Handle the Delete button click ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely delete this resource?")) {
            try {
                await facilityService.deleteFacility(id);
                fetchFacilities(); // Refresh grid after delete
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Error deleting resource.");
            }
        }
    };

    // --- NEW: Handle opening the Edit modal ---
    const handleEditClick = (facility) => {
        setFacilityToEdit(facility);
        setIsEditModalOpen(true);
    };

    const filteredFacilities = facilities.filter(fac => {
        const matchSearch = fac.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            fac.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'ALL' || fac.type === filterType;
        return matchSearch && matchType;
    });

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading Campus Resources...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ color: '#084298', margin: '0 0 5px 0' }}>Facilities & Assets</h1>
                    <p style={{ color: '#0d6efd', margin: 0 }}>Browse and book university resources</p>
                </div>
                
                {user && user.role === 'ADMIN' && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Add Resource
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
                <input 
                    type="text" placeholder="Search by name or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                    <option value="ALL">All Types</option>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Lab">Lab</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Equipment">Equipment</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredFacilities.length === 0 ? (
                    <p style={{ color: '#6c757d' }}>No resources found.</p>
                ) : (
                    filteredFacilities.map(fac => (
                        <div key={fac.id} style={{ border: '1px solid #cfe2ff', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            
                            {/* Display the Image or a Placeholder */}
                            {fac.imageUrl ? (
                                <img src={fac.imageUrl} alt={fac.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderBottom: '1px solid #cfe2ff' }} />
                            ) : (
                                <div style={{ height: '160px', backgroundColor: '#cfe2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #cfe2ff' }}>
                                    <span style={{ color: '#084298', fontWeight: 'bold', fontSize: '18px' }}>{fac.type}</span>
                                </div>
                            )}

                            <div style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0, color: '#084298' }}>{fac.name}</h3>
                                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', backgroundColor: fac.status === 'ACTIVE' ? '#d1e7dd' : '#f8d7da', color: fac.status === 'ACTIVE' ? '#0f5132' : '#842029', fontWeight: 'bold' }}>
                                        {fac.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '15px' }}>📍 {fac.location}</p>
                                
                                <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', fontSize: '14px', marginBottom: '15px' }}>
                                    <p style={{ margin: '0 0 5px 0' }}><strong>Capacity:</strong> {fac.capacity > 0 ? fac.capacity : 'N/A'}</p>
                                    <p style={{ margin: 0 }}><strong>Hours:</strong> {fac.openTime || 'N/A'} - {fac.closeTime || 'N/A'}</p>
                                </div>

                                <button
                                    onClick={() => navigate(`/facilities/${fac.id}`)}
                                    style={{ width: '100%', padding: '10px', backgroundColor: '#e7f1ff', color: '#0c4128', border: '1px solid #b6d4fe', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    View Details & Book
                                </button>

                                {/* ADMIN CONTROLS: EDIT AND DELETE */}
                                {user && user.role === 'ADMIN' && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button onClick={() => handleEditClick(fac)} style={{ flex: 1, padding: '8px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(fac.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
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