import React, { useState, useEffect } from 'react';
import facilityService from '../../services/facilityService';

const AddFacilityModal = ({ isOpen, onClose, onFacilityAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Lecture Hall',
        capacity: 0,
        location: '',
        openTime: '08:00 AM',
        closeTime: '06:00 PM',
        status: 'ACTIVE',
        imageUrl: '', 
        features: []
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

    if (!isOpen) return null;

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
            let finalImageUrl = '';

            if (selectedFile) {
                finalImageUrl = await facilityService.uploadImage(selectedFile);
            }

            const facilityToSave = {
                ...formData,
                imageUrl: finalImageUrl
            };

            await facilityService.createFacility(facilityToSave);
            
            onFacilityAdded();
            setSelectedFile(null);
            setFormData({ name: '', type: 'Lecture Hall', capacity: 0, location: '', openTime: '08:00 AM', closeTime: '06:00 PM', status: 'ACTIVE', imageUrl: '', features: [] });
            onClose();
        } catch (error) {
            console.error("Failed to save facility", error);
            alert("Error saving facility. Make sure the backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-400";
    const labelClasses = "block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wide";

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Modal Container */}
            <div 
                className={`bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out ${animateIn ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
            >
                {/* Modal Header */}
                <div className="relative overflow-hidden shrink-0 px-8 py-8 bg-slate-900 text-white">
                    <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full blur-3xl opacity-60 mix-blend-screen"></div>
                        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full blur-3xl opacity-40 mix-blend-screen"></div>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 backdrop-blur-md rounded-xl mb-4 border border-white/10 shadow-inner">
                                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Add New Resource</h2>
                            <p className="text-blue-200/80 text-sm font-medium">Configure a new facility for the campus network.</p>
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
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="e.g. Advanced Computing Lab" />
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
                                <label className={labelClasses}>Max Capacity</label>
                                <input type="number" name="capacity" min="0" value={formData.capacity} onChange={handleChange} className={inputClasses} placeholder="0 for equipment" />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClasses}>Physical Location <span className="text-red-500">*</span></label>
                                <input required type="text" name="location" value={formData.location} onChange={handleChange} className={inputClasses} placeholder="e.g. Main Building, Floor 2" />
                            </div>

                            <div>
                                <label className={labelClasses}>Opening Time</label>
                                <input type="text" name="openTime" value={formData.openTime} onChange={handleChange} className={inputClasses} placeholder="08:00 AM" />
                            </div>

                            <div>
                                <label className={labelClasses}>Closing Time</label>
                                <input type="text" name="closeTime" value={formData.closeTime} onChange={handleChange} className={inputClasses} placeholder="06:00 PM" />
                            </div>
                        </div>

                        {/* File Upload Zone */}
                        <div className="pt-2">
                            <label className={labelClasses}>Cover Image <span className="text-slate-400 normal-case tracking-normal font-medium">(Optional)</span></label>
                            <div className="relative w-full h-44 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-all duration-300 cursor-pointer overflow-hidden group">
                                {selectedFile ? (
                                    <div className="relative w-full h-full">
                                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-bold bg-slate-900/60 px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg">Change Image</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedFile(null);
                                            }}
                                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-transform transform scale-0 group-hover:scale-100 focus:scale-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center group-hover:text-blue-500 transition-colors">
                                        <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-[15px] font-bold text-slate-600 group-hover:text-blue-600">Click to upload</span>
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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Resource
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

export default AddFacilityModal;