import React, { useEffect, useState } from 'react';
import { getAllIncidents } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlResourceId = searchParams.get('resourceId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incidentsData, facilitiesData] = await Promise.all([
        getAllIncidents(),
        facilityService.getAllFacilities()
      ]);
      setIncidents(incidentsData);
      setFacilities(facilitiesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'CLOSED': return 'bg-gray-50 text-gray-700 border border-gray-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'LOW': return 'bg-green-400';
      case 'MEDIUM': return 'bg-yellow-400';
      case 'HIGH': return 'bg-orange-500';
      case 'CRITICAL': return 'bg-red-600';
      default: return 'bg-gray-300';
    }
  };

  const getResourceName = (resourceId) => {
    const facility = facilities.find(f => String(f.id) === String(resourceId));
    return facility ? facility.name : resourceId;
  };

  const filteredIncidents = incidents.filter(ticket => {
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    const matchUrlResource = urlResourceId ? String(ticket.resourceId) === String(urlResourceId) : true;
    const resourceName = getResourceName(ticket.resourceId);
    const matchSearch = searchQuery 
        ? ticket.category?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          resourceName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
    return matchStatus && matchPriority && matchUrlResource && matchSearch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '' || priorityFilter !== '';

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12 font-sans">
      {/* Hero Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-indigo-900 text-white pb-24 pt-12 px-6 shadow-lg relative overflow-hidden">
        {/* Abstract background shapes for premium look */}
        <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -m-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div className="mb-6 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              {urlResourceId ? `Incidents for ${getResourceName(urlResourceId)}` : 'Campus Incidents'}
            </h2>
            <p className="text-indigo-200 text-lg max-w-xl">Track, manage, and resolve facility issues across the campus with our streamlined ticketing system.</p>
          </div>
          <div className="flex gap-4">
            {urlResourceId && (
              <button 
                onClick={() => navigate('/incidents')} 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 py-2.5 px-6 rounded-full hover:bg-white/20 transition shadow-sm font-semibold">
                View All Incidents
              </button>
            )}
            <Link to={`/incidents/new${urlResourceId ? `?resourceId=${urlResourceId}` : ''}`} 
                  className="bg-emerald-500 hover:bg-emerald-400 text-white py-2.5 px-6 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition transform hover:-translate-y-0.5 font-bold flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
               <span>Report Incident</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl -mt-12 px-4 relative z-20">
        {/* Filters with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white mb-10 flex flex-col md:flex-row gap-4 align-middle items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
                type="text" 
                placeholder="Search by Resource or Category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-3 px-4 bg-gray-50/50 border border-gray-200 text-gray-700 rounded-xl w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium appearance-none">
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="py-3 px-4 bg-gray-50/50 border border-gray-200 text-gray-700 rounded-xl w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium appearance-none">
              <option value="">All Priorities</option>
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="CRITICAL">Critical Priority</option>
          </select>
          {hasActiveFilters && (
             <button onClick={clearFilters} className="py-3 px-4 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition whitespace-nowrap">
                Clear Filters
             </button>
          )}
        </div>

        {/* Grid of Cards instead of Table */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-72 animate-pulse">
                   <div className="h-2 w-full bg-gray-100"></div>
                   <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-5">
                         <div className="h-7 w-24 bg-gray-100 rounded-md"></div>
                         <div className="h-5 w-16 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-6 w-3/4 bg-gray-100 rounded mb-4"></div>
                      <div className="h-4 w-1/2 bg-gray-100 rounded mb-6"></div>
                      <div className="h-10 w-full bg-gray-50 rounded mt-auto"></div>
                   </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIncidents.length > 0 ? filteredIncidents.map((ticket) => (
              <div 
                key={ticket.id} 
              onClick={() => navigate(`/incidents/${ticket.id}`)} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full group"
            >
              {/* Conditional colored top border based on priority */}
              <div className={`h-2 w-full ${getPriorityColor(ticket.priority)}`}></div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-col gap-1 items-start">
                    <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md tracking-wider ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide px-1">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{getResourceName(ticket.resourceId)}</h3>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">{ticket.category}</span>
                    <span className="text-sm text-gray-400">&bull;</span>
                    <span className="text-sm text-gray-500">{ticket.priority} Priority</span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {ticket.description || "No description provided."}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase">
                          {ticket.reportedByUserId ? ticket.reportedByUserId.slice(0, 2) : 'A'}
                      </div>
                      <span className="text-gray-500 text-xs font-medium truncate max-w-[100px]">
                          {ticket.reportedByUserId}
                      </span>
                  </div>
                  {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                      <span className="text-gray-400 flex items-center gap-1.5 text-xs font-semibold bg-gray-50 px-2 py-1 rounded-md">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                         {ticket.attachmentUrls.length} File{ticket.attachmentUrls.length > 1 ? 's' : ''}
                      </span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
               <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-inner mb-4 border border-indigo-50">
                   <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-2">No Tickets Found</h3>
               <p className="text-gray-500 max-w-md mx-auto">We couldn't find any tickets matching your current search and filter criteria. Try adjusting them.</p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;