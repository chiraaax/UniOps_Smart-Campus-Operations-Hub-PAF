import React, { useEffect, useState, useContext } from 'react';
import { getTicketsByUser, deleteIncident, updateIncident } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const StudentIncidents = () => {
  const { user } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, open: 0, critical: 0, resolved: 0 });
  const navigate = useNavigate();

  // Edit State
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (incidents.length > 0) {
      setStats({
        total: incidents.length,
        open: incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
        critical: incidents.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length,
        resolved: incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length
      });
    } else {
      setStats({ total: 0, open: 0, critical: 0, resolved: 0 });
    }
  }, [incidents]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incidentsData, facilitiesData] = await Promise.all([
        getTicketsByUser(user.name || user.email || 'Anonymous'),
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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this incident ticket? This action cannot be undone.")) {
      try {
        await deleteIncident(id, user.name || user.email || 'Anonymous');
        fetchData();
      } catch (err) {
        alert("Failed to delete the ticket. Please try again.");
      }
    }
  };

  const openEditModal = (e, object) => {
    e.stopPropagation();
    setEditMode(object.id);
    setEditData({
      category: object.category || '',
      priority: object.priority || 'LOW',
      contactDetails: object.contactDetails || '',
      description: object.description || '',
      resourceId: object.resourceId || ''
    });
  };

  const closeEditModal = () => {
    setEditMode(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateIncident(editMode, editData, user.name || user.email || 'Anonymous');
      closeEditModal();
      fetchData();
    } catch (err) {
      console.error("Full Error Object:", err);
      console.error("Response Data:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
      alert("Failed to update the ticket.\nReason: " + errorMsg + "\nPlease check the browser console for more details.");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'OPEN': { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🟡', label: 'Open' },
      'IN_PROGRESS': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🔵', label: 'In Progress' },
      'RESOLVED': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅', label: 'Resolved' },
      'CLOSED': { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '✔️', label: 'Closed' },
      'REJECTED': { color: 'bg-red-50 text-red-700 border-red-200', icon: '❌', label: 'Rejected' }
    };
    return configs[status] || { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '📋', label: status };
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'LOW': { color: 'bg-gradient-to-r from-emerald-400 to-teal-400', bgLight: 'bg-emerald-50', text: 'text-emerald-700', icon: '🟢' },
      'MEDIUM': { color: 'bg-gradient-to-r from-amber-400 to-orange-400', bgLight: 'bg-amber-50', text: 'text-amber-700', icon: '🟡' },
      'HIGH': { color: 'bg-gradient-to-r from-orange-500 to-red-500', bgLight: 'bg-orange-50', text: 'text-orange-700', icon: '🟠' },
      'CRITICAL': { color: 'bg-gradient-to-r from-red-600 to-rose-600', bgLight: 'bg-red-50', text: 'text-red-700', icon: '🔴' }
    };
    return configs[priority] || { color: 'bg-gradient-to-r from-gray-300 to-gray-400', bgLight: 'bg-gray-50', text: 'text-gray-700', icon: '⚪' };
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
      resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchStatus && matchPriority && matchSearch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '' || priorityFilter !== '';

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 pb-16 font-sans">
      <div className="relative text-white pb-32 pt-16 px-6 shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #084298 0%, #0d6efd 100%)' }}>
        {/* Same styling overhead */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    My Incidents
                  </h1>
                  <p className="text-blue-200/80 text-lg mt-1">
                    Track and manage the status of incidents you've reported
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/incidents/new`}
                className="group relative px-8 py-3.5 bg-white text-[#084298] rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 ease-out transform hover:-translate-y-1 font-bold flex items-center gap-3 overflow-visible"
              >
                <div className="relative z-10 bg-blue-100 p-1.5 rounded-full group-hover:bg-[#084298] group-hover:rotate-90 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#084298] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="relative z-10 text-[15px] tracking-wide">Report Incident</span>
              </Link>
            </div>
          </div>

          {!loading && incidents.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <StatCard title="Total Reported" value={stats.total} icon="📊" gradient="from-blue-400 to-cyan-400" />
              <StatCard title="Active Issues" value={stats.open} icon="⚠️" gradient="from-amber-400 to-orange-400" />
              <StatCard title="High Priority" value={stats.critical} icon="🔥" gradient="from-red-400 to-rose-400" />
              <StatCard title="Resolved" value={stats.resolved} icon="🎯" gradient="from-emerald-400 to-teal-400" />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl -mt-12 px-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search your incidents by resource, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-3 pl-4 pr-10 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:border-blue-400">
                <option value="">📋 All Status</option>
                <option value="OPEN">🟡 Open</option>
                <option value="IN_PROGRESS">🔵 In Progress</option>
                <option value="RESOLVED">✅ Resolved</option>
                <option value="CLOSED">✔️ Closed</option>
                <option value="REJECTED">❌ Rejected</option>
              </select>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="py-3 pl-4 pr-10 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:border-blue-400">
                <option value="">🎯 All Priorities</option>
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="CRITICAL">🔴 Critical</option>
              </select>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200">Clear</button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {filteredIncidents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIncidents.map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status);
                  const priorityConfig = getPriorityConfig(ticket.priority);

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => navigate(`/incidents/${ticket.id}`)}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200 flex flex-col"
                    >
                      <div className={`h-1.5 w-full ${priorityConfig.color}`}></div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{priorityConfig.icon}</span>
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${statusConfig.color} border`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {/* Allowing Edit usually only on OPEN status theoretically, but here user can edit their unclosed tickets easily */}
                            {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'REJECTED') && (
                              <button onClick={(e) => openEditModal(e, ticket)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Ticket">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                            )}
                            <button onClick={(e) => handleDelete(e, ticket.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Ticket">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {getResourceName(ticket.resourceId)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig.bgLight} ${priorityConfig.text}`}>
                            <span>{priorityConfig.icon}</span>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {ticket.description || "No description provided."}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{ticket.updatedAt ? `Updated ${new Date(ticket.updatedAt).toLocaleDateString()}` : `Created ${new Date(ticket.createdAt).toLocaleDateString()}`}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            #{ticket.id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Personal Incidents Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  {hasActiveFilters
                    ? "No incidents match your current filters. Try adjusting your search criteria."
                    : "You haven't reported any incidents yet. Great job keeping the campus safe!"}
                </p>
                {hasActiveFilters ? (
                  <button onClick={clearFilters} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg transition-all hover:-translate-y-0.5">
                    Reset Filters
                  </button>
                ) : (
                  <button onClick={() => navigate('/incidents/new')} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg transition-all hover:-translate-y-0.5">
                    Report Issue
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {editMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Edit Incident Ticket</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={submitEdit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Resource</label>
                <select name="resourceId" value={editData.resourceId} onChange={handleEditChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                  <option value="" disabled>Select Resource</option>
                  {facilities.map(fac => (
                    <option key={fac.id} value={fac.id}>{fac.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <input type="text" name="category" value={editData.category} onChange={handleEditChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                  <select name="priority" value={editData.priority} onChange={handleEditChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Details</label>
                <input type="tel" name="contactDetails" value={editData.contactDetails} onChange={handleEditChange} required pattern="[0-9]{10}" title="Please enter exactly 10 digits" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400" placeholder="Your 10-digit phone number" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea name="description" value={editData.description} onChange={handleEditChange} required rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 resize-none"></textarea>
              </div>

              <div className="mt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeEditModal} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentIncidents;