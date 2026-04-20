import React, { useState, useEffect, useContext } from 'react';
import { createIncident, uploadIncidentImage } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const CreateIncident = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useContext(AuthContext);
    const [facilities, setFacilities] = useState([]);

    const [formData, setFormData] = useState({
        resourceId: searchParams.get('resourceId') || '',
        category: '',
        description: '',
        priority: 'LOW',
        contactDetails: '',
        attachmentUrls: []
    });

    const [images, setImages] = useState([null, null, null]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const data = await facilityService.getAllFacilities();
                setFacilities(data);
            } catch (error) {
                console.error('Failed to fetch facilities', error);
            }
        };
        fetchFacilities();
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSlotImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[index] = file;
            setImages(newImages);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const uploadedUrls = [];
            for (const file of images) {
                if (file) {
                    const url = await uploadIncidentImage(file);
                    uploadedUrls.push(url);
                }
            }

            await createIncident({
                ...formData,
                attachmentUrls: uploadedUrls,
                reportedByUserId: user ? (user.name || user.email || 'Anonymous') : 'Anonymous'
            });
            alert('Ticket Created Successfully');
            navigate('/incidents');
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 pb-16 font-sans">
            {/* Hero Section */}
            <div className="relative text-white pb-32 pt-16 px-6 shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #084298 0%, #0d6efd 100%)' }}>
                <div className="absolute inset-0 overflow-hidden opacity-40">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
                </div>

                <div className="container mx-auto max-w-3xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-2xl blur-xl opacity-60"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                                Report Incident
                            </h1>
                            <p className="text-blue-200/80 text-lg mt-1">Submit a new facility issue for resolution</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/incidents')}
                        className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="container mx-auto max-w-3xl -mt-20 px-4 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Resource / Location <span className="text-red-500">*</span></label>
                                <select name="resourceId" value={formData.resourceId} onChange={handleChange} required className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200">
                                    <option value="" disabled>Select a location or resource</option>
                                    {facilities.map(fac => (
                                        <option key={fac.id} value={fac.id}>{fac.name} ({fac.type})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200" placeholder="e.g., Plumbing, Electrical, IT" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200">
                                    <option value="LOW">🟢 Low</option>
                                    <option value="MEDIUM">🟡 Medium</option>
                                    <option value="HIGH">🟠 High</option>
                                    <option value="CRITICAL">🔴 Critical</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Details <span className="text-red-500">*</span></label>
                                <input type="tel" name="contactDetails" value={formData.contactDetails} onChange={handleChange} required pattern="[0-9]{10}" title="Please enter exactly 10 digits" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200" placeholder="Your 10-digit phone number" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description <span className="text-red-500">*</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200 resize-none" placeholder="Provide as much detail as possible about the issue..."></textarea>
                            </div>

                            <div className="md:col-span-2 pt-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Photo Evidence (Up to 3)</label>
                                <div className="flex flex-wrap gap-4">
                                    {[0, 1, 2].map(index => (
                                        <div key={index} className="relative w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer overflow-hidden group">
                                            {images[index] ? (
                                                <>
                                                    <img src={URL.createObjectURL(images[index])} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const newImages = [...images];
                                                            newImages[index] = null;
                                                            setImages(newImages);
                                                        }}
                                                        className="absolute top-1.5 right-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-sm backdrop-blur-md transition-transform transform scale-0 group-hover:scale-100"
                                                    >
                                                        &times;
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-gray-400 flex flex-col items-center group-hover:text-blue-500 transition-colors">
                                                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-[10px] font-medium">Add Photo</span>
                                                </div>
                                            )}
                                            {!images[index] && (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleSlotImageChange(index, e)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    title={`Upload image ${index + 1}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-100 text-right">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Submit Ticket
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

export default CreateIncident;