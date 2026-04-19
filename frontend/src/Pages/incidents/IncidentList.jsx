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
  const [stats, setStats] = useState({ total: 0, open: 0, critical: 0, resolved: 0 });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlResourceId = searchParams.get('resourceId');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (incidents.length > 0) {
      setStats({
        total: incidents.length,
        open: incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
        critical: incidents.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length,
        resolved: incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length
      });
    }
  }, [incidents]);

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

  const getStatusConfig = (status) => {
    const configs = {
      'OPEN': {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: '🟡',
        label: 'Open'
      },
      'IN_PROGRESS': {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: '🔵',
        label: 'In Progress'
      },
      'RESOLVED': {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: '✅',
        label: 'Resolved'
      },
      'CLOSED': {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: '✔️',
        label: 'Closed'
      },
      'REJECTED': {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: '❌',
        label: 'Rejected'
      }
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
    const matchUrlResource = urlResourceId ? String(ticket.resourceId) === String(urlResourceId) : true;
    const resourceName = getResourceName(ticket.resourceId);
    const matchSearch = searchQuery
      ? ticket.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchStatus && matchPriority && matchUrlResource && matchSearch;
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
      {/* Hero Section with Deep Blue Gradient */}
      <div className="relative text-white pb-32 pt-16 px-6 shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #084298 0%, #0d6efd 100%)' }}>
        {/* Animated background elements with blue tones */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 right-20 w-[550px] h-[550px] bg-gradient-to-tl from-blue-600/20 via-indigo-500/20 to-sky-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

          {/* Elegant grid overlay */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="h-full w-full" style={{
              backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), 
                                linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>

        {/* Subtle wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#3b82f6" opacity="0.2"></path>
            <path d="M0,0V15.81C13,21.11,27.64,23.5,43.23,24.55c51.36,3.47,102.85-6.38,153.4-20.07C272.89-9.65,349.17-3.33,425.41,5.53c74.25,8.64,148.62,11.32,222.8-1.13,47.59-8,94.37-20.59,141.56-30.81C861.68-42.53,938.68-23.34,1016.8-6.25c40.84,8.93,82.06,18.54,123.4,17.09,20.06-.7,40-4.5,59.8-10.5V0Z" fill="#2563eb" opacity="0.15"></path>
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-2xl blur-xl opacity-60"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    {urlResourceId ? getResourceName(urlResourceId) : 'Incident Management'}
                  </h1>
                  <p className="text-blue-200/80 text-lg mt-1">
                    {urlResourceId ? 'Viewing incidents for this facility' : 'Streamlined tracking and resolution of facility issues'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {urlResourceId && (
                <button
                  onClick={() => navigate('/incidents')}
                  className="group relative px-6 py-3 bg-white/5 backdrop-blur-sm text-white border border-blue-400/30 rounded-xl hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/10 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="relative z-10">All Incidents</span>
                </button>
              )}
              <Link
                to={`/incidents/new${urlResourceId ? `?resourceId=${urlResourceId}` : ''}`}
                className="group relative px-8 py-3.5 bg-white text-[#084298] rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 ease-out transform hover:-translate-y-1 font-bold flex items-center gap-3 overflow-visible"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></div>
                <div className="relative z-10 bg-blue-100 p-1.5 rounded-full group-hover:bg-[#084298] group-hover:rotate-90 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#084298] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="relative z-10 text-[15px] tracking-wide">Report Incident</span>
              </Link>
            </div>
          </div>

          {/* Statistics Cards with Blue Theme */}
          {!loading && incidents.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <StatCard
                title="Total Incidents"
                value={stats.total}
                icon="📊"
                gradient="from-blue-400 to-cyan-400"
              />
              <StatCard
                title="Active Issues"
                value={stats.open}
                icon="⚠️"
                gradient="from-amber-400 to-orange-400"
              />
              <StatCard
                title="High Priority"
                value={stats.critical}
                icon="🔥"
                gradient="from-red-400 to-rose-400"
              />
              <StatCard
                title="Resolved"
                value={stats.resolved}
                icon="🎯"
                gradient="from-emerald-400 to-teal-400"
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl -mt-12 px-4 relative z-20">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search incidents by resource, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none py-3 pl-4 pr-10 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl min-w-[160px] focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200 font-medium cursor-pointer hover:bg-gray-100"
                >
                  <option value="">📋 All Status</option>
                  <option value="OPEN">🟡 Open</option>
                  <option value="IN_PROGRESS">🔵 In Progress</option>
                  <option value="RESOLVED">✅ Resolved</option>
                  <option value="CLOSED">✔️ Closed</option>
                  <option value="REJECTED">❌ Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none py-3 pl-4 pr-10 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl min-w-[170px] focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all duration-200 font-medium cursor-pointer hover:bg-gray-100"
                >
                  <option value="">🎯 All Priorities</option>
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="CRITICAL">🔴 Critical</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                  🔍 "{searchQuery}"
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium">
                  Status: {statusFilter}
                </span>
              )}
              {priorityFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium">
                  Priority: {priorityFilter}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {filteredIncidents.length} result{filteredIncidents.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  </div>
                  <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
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
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            #{ticket.id}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {getResourceName(ticket.resourceId)}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig.bgLight} ${priorityConfig.text}`}>
                            <span>{priorityConfig.icon}</span>
                            {ticket.priority}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            📂 {ticket.category || 'Uncategorized'}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {ticket.description || "No description provided for this incident."}
                        </p>

                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                  {ticket.reportedByUserId ? ticket.reportedByUserId.slice(0, 2).toUpperCase() : 'A'}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${ticket.status === 'OPEN' ? 'bg-amber-400' : ticket.status === 'IN_PROGRESS' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                                  {ticket.reportedByUserId || 'Anonymous'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                </span>
                              </div>
                            </div>

                            {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">
                                  {ticket.attachmentUrls.length}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {ticket.updatedAt ? `Updated ${new Date(ticket.updatedAt).toLocaleDateString()}` : `Created ${new Date(ticket.createdAt).toLocaleDateString()}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 mb-6 shadow-inner">
                  <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Incidents Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  {hasActiveFilters
                    ? "No incidents match your current filters. Try adjusting your search criteria."
                    : "Everything looks good! There are no incidents to display at the moment."}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset All Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IncidentList;