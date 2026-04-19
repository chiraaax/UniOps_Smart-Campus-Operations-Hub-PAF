import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import AddFacilityModal from './AddFacilityModal'; 
import EditFacilityModal from './EditFacilityModal';

const FacilitiesCatalogue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [facilitiesLive, setFacilitiesLive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [facilityToEdit, setFacilityToEdit] = useState(null);

    useEffect(() => {
        fetchLiveFacilities();
    }, []);

    const fetchLiveFacilities = async () => {
        try {
            const data = await facilityService.getFacilitiesWithLiveStatus();
            setFacilitiesLive(data);
        } catch (error) {
            console.error("Error loading facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely delete this resource?")) {
            try {
                await facilityService.deleteFacility(id);
                fetchLiveFacilities(); 
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Error deleting resource.");
            }
        }
    };

    const handleEditClick = (facility) => {
        setFacilityToEdit(facility);
        setIsEditModalOpen(true);
    };

    const filteredFacilities = facilitiesLive.filter(item => {
        const fac = item.facility;
        const matchSearch = fac.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            fac.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'ALL' || fac.type === filterType;
        return matchSearch && matchType;
    });

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 pb-16 font-sans">
            
            {/* HERO HEADER */}
            <div className="relative text-white pb-32 pt-16 px-6 shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #084298 0%, #0d6efd 100%)' }}>
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden opacity-40">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-2xl blur-xl opacity-60"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                                Campus Resources
                            </h1>
                            <p className="text-blue-200/80 text-lg mt-1 font-medium">Live Campus Map & Intelligent Booking Hub</p>
                        </div>
                    </div>

                    {user && user.role === 'ADMIN' && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="group relative px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Resource
                        </button>
                    )}
                </div>
            </div>

            <div className="container mx-auto max-w-6xl -mt-16 px-4 relative z-20">
                
                {/* SEARCH BAR (Floating over header) */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 mb-10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by resource name or location..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                        />
                    </div>
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)} 
                        className="w-full md:w-64 px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200 font-semibold cursor-pointer"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Lecture Hall">Lecture Hall</option>
                        <option value="Lab">Computing Lab</option>
                        <option value="Meeting Room">Meeting Room</option>
                        <option value="Equipment">Hardware / Equipment</option>
                    </select>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredFacilities.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-700 mb-1">No resources found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        filteredFacilities.map(item => {
                            const fac = item.facility;
                            const isAvailable = item.liveStatus === "AVAILABLE NOW";
                            
                            return (
                                <div key={fac.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative group">
                                    
                                    {/* LIVE STATUS BADGE OVERLAY */}
                                    <div 
                                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider border shadow-sm flex items-center gap-2 z-10"
                                        style={{ color: item.statusColor, borderColor: `${item.statusColor}40` }}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${!isAvailable ? 'animate-pulse' : ''}`} style={{ backgroundColor: item.statusColor }}></div>
                                        {item.liveStatus}
                                    </div>

                                    {/* IMAGE SECTION */}
                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                        {fac.imageUrl ? (
                                            <img src={fac.imageUrl} alt={fac.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 font-extrabold text-2xl tracking-widest uppercase">{fac.type}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
                                    </div>

                                    {/* CONTENT SECTION */}
                                    <div className="p-6 flex flex-col flex-1 relative bg-white">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-blue-100">
                                                {fac.type}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{fac.name}</h3>
                                        
                                        <p className="text-gray-500 text-sm mb-5 flex items-center gap-2 font-medium">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            {fac.location}
                                        </p>
                                        
                                        {/* ACTIVITY SUBTEXT */}
                                        <div 
                                            className="px-4 py-3 rounded-xl text-sm font-semibold mb-6 border-l-4"
                                            style={{ backgroundColor: `${item.statusColor}10`, color: item.statusColor, borderColor: item.statusColor }}
                                        >
                                            {item.currentActivity}
                                        </div>

                                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                                </svg>
                                                {fac.capacity > 0 ? `${fac.capacity} Seats` : 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                {fac.openTime || 'N/A'} - {fac.closeTime || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => navigate(`/facilities/${fac.id}`)}
                                                className={`w-full py-3.5 rounded-xl font-bold text-[15px] transition-all duration-300 transform active:scale-95 ${
                                                    isAvailable 
                                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/30' 
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                            >
                                                View Details & Schedule
                                            </button>

                                            {/* ADMIN CONTROLS */}
                                            {user && user.role === 'ADMIN' && (
                                                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                                                    <button 
                                                        onClick={() => handleEditClick(fac)} 
                                                        className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl font-bold text-sm transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(fac.id)} 
                                                        className="py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-sm transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <AddFacilityModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onFacilityAdded={fetchLiveFacilities} />
            {facilityToEdit && <EditFacilityModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onFacilityUpdated={fetchLiveFacilities} facility={facilityToEdit} />}
        </div>
    );
};

export default FacilitiesCatalogue;