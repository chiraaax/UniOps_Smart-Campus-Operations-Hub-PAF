import React, { useEffect, useState } from 'react';
import { getAllIncidents } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { Link, useNavigate } from 'react-router-dom';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incidentsData, facilitiesData] = await Promise.all([
        getAllIncidents(),
        facilityService.getAllFacilities()
      ]);
      setIncidents(incidentsData);
      setFacilities(facilitiesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceName = (resourceId) => {
    const facility = facilities.find(f => String(f.id) === String(resourceId));
    return facility ? facility.name : resourceId;
  };

  const filteredIncidents = incidents.filter(ticket => {
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    const resourceName = getResourceName(ticket.resourceId);
    const matchSearch = searchQuery 
        ? ticket.category?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          resourceName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
    return matchStatus && matchPriority && matchSearch;
  });

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Incident Tickets</h2>
        <Link to="/incidents/new" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Report Incident
        </Link>
      </div>
      <div className="bg-white p-4 shadow rounded-lg mb-6 flex gap-4">
        <input 
            type="text" 
            placeholder="Search by Resource or Category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded w-48">
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="p-2 border rounded w-48">
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIncidents.length > 0 ? filteredIncidents.map((ticket) => (
              <tr key={ticket.id} onClick={() => navigate(`/incidents/${ticket.id}`)} className="cursor-pointer hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getResourceName(ticket.resourceId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No tickets found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentList;