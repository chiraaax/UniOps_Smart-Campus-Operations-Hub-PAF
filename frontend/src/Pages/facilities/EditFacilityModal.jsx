import React, { useState, useEffect } from 'react';
import facilityService from '../../services/facilityService';

const EditFacilityModal = ({ isOpen, onClose, onFacilityUpdated, facility }) => {
    const [formData, setFormData] = useState({
        name: '', type: 'Lecture Hall', capacity: 0, location: '',
        openTime: '', closeTime: '', status: 'ACTIVE', imageUrl: '', features: []
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    // Smooth entry animation effect
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setAnimateIn(true), 10);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    // When the modal opens, fill the form with the facility's current data
    useEffect(() => {
        if (facility) {
            setFormData(facility);
            setSelectedFile(null); // Clear any old file selection
        }
    }, [facility]);

    if (!isOpen || !facility) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Keep the old image URL by default
            let finalImageUrl = formData.imageUrl; 

            // If they selected a NEW image, upload it first
            if (selectedFile) {
                finalImageUrl = await facilityService.uploadImage(selectedFile);
            }

            const facilityToSave = { ...formData, imageUrl: finalImageUrl };

            // Send the update to Spring Boot!
            await facilityService.updateFacility(facility.id, facilityToSave);
            
            onFacilityUpdated(); // Refresh the grid
            onClose(); // Close the modal
        } catch (error) {
            console.error("Failed to update facility", error);
            alert("Error updating facility. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-medium placeholder-slate-400";
    const labelClasses = "block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wide";

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Modal Container */}
            <div 
                className={`bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out ${animateIn ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
            >
                {/* Modal Header (Amber/Orange Theme for Edit) */}
                <div className="relative overflow-hidden shrink-0 px-8 py-8 bg-slate-900 text-white">
                    <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl opacity-60 mix-blend-screen"></div>
                        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full blur-3xl opacity-40 mix-blend-screen"></div>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 backdrop-blur-md rounded-xl mb-4 border border-white/10 shadow-inner">
                                <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Edit Resource</h2>
                            <p className="text-amber-100/80 text-sm font-medium">Update configuration and details for this facility.</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body / Form */}
                <div className="overflow-y-auto px-8 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Resource Name <span className="text-red-500">*</span></label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} />
                            </div>

                            <div>
                                <label className={labelClasses}>Resource Type <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select name="type" value={formData.type} onChange={handleChange} className={`${inputClasses} appearance-none pr-10 cursor-pointer`}>
                                        <option value="Lecture Hall">Lecture Hall</option>
                                        <option value="Lab">Laboratory</option>
                                        <option value="Meeting Room">Meeting Room</option>
                                        <option value="Equipment">Hardware / Equipment</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Status</label>
                                <div className="relative">
                                    <select name="status" value={formData.status} onChange={handleChange} className={`${inputClasses} appearance-none pr-10 cursor-pointer ${formData.status === 'ACTIVE' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                        <option value="ACTIVE">🟢 ACTIVE</option>
                                        <option value="OUT_OF_SERVICE">🔴 OUT OF SERVICE</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex gap-6">
                                <div className="flex-1">
                                    <label className={labelClasses}>Physical Location <span className="text-red-500">*</span></label>
                                    <input required type="text" name="location" value={formData.location} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div className="w-32">
                                    <label className={labelClasses}>Capacity</label>
                                    <input type="number" name="capacity" min="0" value={formData.capacity} onChange={handleChange} className={inputClasses} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Opening Time</label>
                                <input type="text" name="openTime" value={formData.openTime} onChange={handleChange} className={inputClasses} />
                            </div>

                            <div>
                                <label className={labelClasses}>Closing Time</label>
                                <input type="text" name="closeTime" value={formData.closeTime} onChange={handleChange} className={inputClasses} />
                            </div>
                        </div>

                        {/* File Upload Zone */}
                        <div className="pt-2">
                            <label className={labelClasses}>Update Image <span className="text-slate-400 normal-case tracking-normal font-medium">(Optional)</span></label>
                            <div className="relative w-full h-44 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50 hover:bg-amber-50/50 hover:border-amber-400 transition-all duration-300 cursor-pointer overflow-hidden group">
                                {(selectedFile || formData.imageUrl) ? (
                                    <div className="relative w-full h-full">
                                        <img 
                                            src={selectedFile ? URL.createObjectURL(selectedFile) : formData.imageUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-bold bg-slate-900/60 px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg">
                                                {selectedFile ? 'Change New Image' : 'Upload New Image to Replace'}
                                            </span>
                                        </div>
                                        {selectedFile && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedFile(null);
                                                }}
                                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-transform transform scale-0 group-hover:scale-100 focus:scale-100 z-20"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center group-hover:text-amber-500 transition-colors">
                                        <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-[15px] font-bold text-slate-600 group-hover:text-amber-600">Click to replace current image</span>
                                        <span className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-8 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative overflow-hidden inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-[0_8px_16px_-6px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_20px_-6px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Update Resource
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditFacilityModal;