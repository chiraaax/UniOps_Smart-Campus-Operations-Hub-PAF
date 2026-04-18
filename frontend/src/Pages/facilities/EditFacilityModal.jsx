import React, { useState, useEffect } from 'react';
import facilityService from '../../services/facilityService';

const EditFacilityModal = ({ isOpen, onClose, onFacilityUpdated, facility }) => {
    const [formData, setFormData] = useState({
        name: '', type: 'Lecture Hall', capacity: 0, location: '',
        openTime: '', closeTime: '', status: 'ACTIVE', imageUrl: '', features: []
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Styling (matching your blue theme)
    const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalStyle = { backgroundColor: 'white', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontFamily: 'sans-serif' };
    const headerStyle = { backgroundColor: '#ffc107', color: '#000', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 };
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: 'white' };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={headerStyle}>
                    Edit Resource
                    <span onClick={onClose} style={{ cursor: 'pointer', fontSize: '20px' }}>&times;</span>
                </h2>
                
                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Resource Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                                <option value="Lecture Hall">Lecture Hall</option>
                                <option value="Lab">Lab</option>
                                <option value="Meeting Room">Meeting Room</option>
                                <option value="Equipment">Equipment</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Location</label>
                            <input required type="text" name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={{ width: '100px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

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

                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Update Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleFileSelect} style={inputStyle} />
                    
                    {/* Show existing image if no new one is selected */}
                    {formData.imageUrl && !selectedFile && (
                        <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '-10px', marginBottom: '15px' }}>Current image will be kept.</p>
                    )}
                    {selectedFile && (
                        <p style={{ fontSize: '12px', color: '#0d6efd', marginTop: '-10px', marginBottom: '15px' }}>New file selected: {selectedFile.name}</p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 15px', border: '1px solid #ccc', backgroundColor: '#f8f9fa', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', border: 'none', backgroundColor: '#ffc107', color: '#000', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {isSubmitting ? 'Updating...' : 'Update Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFacilityModal;