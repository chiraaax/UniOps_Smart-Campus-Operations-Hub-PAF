import React, { useState } from 'react';
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
    
    // We need a new state to hold the actual file before we upload it
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Store the file in state when the user selects it
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

            // 1. If they picked a file, upload it to the backend FIRST
            if (selectedFile) {
                // This saves the file to your C: drive and returns the short URL
                finalImageUrl = await facilityService.uploadImage(selectedFile);
            }

            // 2. Attach the short URL to our JSON data
            const facilityToSave = {
                ...formData,
                imageUrl: finalImageUrl
            };

            // 3. Save the JSON data to MongoDB
            await facilityService.createFacility(facilityToSave);
            
            onFacilityAdded();
            // Reset the file state just in case
            setSelectedFile(null);
            onClose();
        } catch (error) {
            console.error("Failed to save facility", error);
            alert("Error saving facility. Make sure the backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalStyle = { backgroundColor: 'white', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontFamily: 'sans-serif' };
    const headerStyle = { backgroundColor: '#0d6efd', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 };
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white' };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={headerStyle}>
                    Add New Resource
                    <span onClick={onClose} style={{ cursor: 'pointer', fontSize: '20px' }}>&times;</span>
                </h2>
                
                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Resource Name</label>
                    <input required type="text" name="name" onChange={handleChange} style={inputStyle} placeholder="e.g. Computing Lab 4" />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Type</label>
                            <select name="type" onChange={handleChange} style={inputStyle}>
                                <option value="Lecture Hall">Lecture Hall</option>
                                <option value="Lab">Lab</option>
                                <option value="Meeting Room">Meeting Room</option>
                                <option value="Equipment">Equipment</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Capacity</label>
                            <input type="number" name="capacity" min="0" onChange={handleChange} style={inputStyle} placeholder="0 for equipment" />
                        </div>
                    </div>

                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Location</label>
                    <input required type="text" name="location" onChange={handleChange} style={inputStyle} placeholder="e.g. Main Building" />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Opening Time</label>
                            <input type="text" name="openTime" value={formData.openTime} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Closing Time</label>
                            <input type="text" name="closeTime" value={formData.closeTime} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    {/* --- UPDATED UPLOAD BUTTON --- */}
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Upload Image</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect} 
                        style={inputStyle} 
                    />
                    
                    {/* Show the file name so the user knows it's selected */}
                    {selectedFile && (
                        <p style={{ fontSize: '12px', color: '#0d6efd', marginTop: '-10px', marginBottom: '15px' }}>
                            Selected: {selectedFile.name}
                        </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 15px', border: '1px solid #ccc', backgroundColor: '#f8f9fa', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', border: 'none', backgroundColor: '#0d6efd', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {isSubmitting ? 'Uploading & Saving...' : 'Save Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFacilityModal;