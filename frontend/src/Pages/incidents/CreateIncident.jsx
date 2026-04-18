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
  
  const [images, setImages] = useState([]);
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('You can only upload a maximum of 3 images.');
      return;
    }
    setImages([...images, ...files].slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of images) {
        const url = await uploadIncidentImage(file);
        uploadedUrls.push(url);
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
          <label className="block text-sm font-medium text-gray-700">Attachments (Max 3)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" disabled={images.length >= 3} />
          {images.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected ({images.length}/3): {images.map(img => img.name).join(', ')}
            </div>
          )}
        </div>
        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          {uploading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateIncident;