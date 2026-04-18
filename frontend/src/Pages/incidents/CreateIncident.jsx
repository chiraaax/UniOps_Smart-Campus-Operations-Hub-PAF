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
        reportedByUserId: user ? user.username : 'Anonymous'
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
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report an Incident</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Resource / Location</label>
          <select name="resourceId" value={formData.resourceId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
            <option value="" disabled>Select a resource</option>
            {facilities.map(fac => (
              <option key={fac.id} value={fac.id}>{fac.name} ({fac.type})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="e.g., Electrical, Hardware" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Details</label>
          <input type="text" name="contactDetails" value={formData.contactDetails} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos (You can add up to 3 photos)</label>
          <div className="flex gap-4">
            {[0, 1, 2].map(index => (
              <div key={index} className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden group">
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
                       className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {/* Hidden input - absolutely positioned over the entire box so clicking anywhere triggers it */}
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
        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          {uploading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateIncident;