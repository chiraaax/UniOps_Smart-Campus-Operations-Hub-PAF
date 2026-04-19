import React, { useState, useEffect, useContext } from 'react';
import { getTicketsForTechnician } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [ticketsData, facilitiesData] = await Promise.all([
                getTicketsForTechnician(user.email),
                facilityService.getAllFacilities()
            ]);
            // Sort by priority or recently updated
            ticketsData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setTickets(ticketsData);
            setFacilities(facilitiesData);
        } catch (error) {
            console.error("Failed to fetch technician dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const getResourceName = (resourceId) => {
        const facility = facilities.find(f => String(f.id) === String(resourceId));
        return facility ? facility.name : resourceId;
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
            'LOW': { color: 'bg-emerald-400', bgLight: 'bg-emerald-50', text: 'text-emerald-700', icon: '🟢' },
            'MEDIUM': { color: 'bg-amber-400', bgLight: 'bg-amber-50', text: 'text-amber-700', icon: '🟡' },
            'HIGH': { color: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-700', icon: '🟠' },
            'CRITICAL': { color: 'bg-red-600', bgLight: 'bg-red-50', text: 'text-red-700', icon: '🔴' }
        };
        return configs[priority] || { color: 'bg-gray-400', bgLight: 'bg-gray-50', text: 'text-gray-700', icon: '⚪' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const activeTickets = tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'REJECTED');
    const closedTickets = tickets.filter(t => t.status === 'CLOSED' || t.status === 'REJECTED');
    const criticalTickets = activeTickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH');
    const newlyAssigned = activeTickets.filter(t => t.status === 'OPEN');

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
                <div className="absolute inset-0 overflow-hidden opacity-40">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-0 right-20 w-[550px] h-[550px] bg-gradient-to-tl from-blue-600/20 via-indigo-500/20 to-sky-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-2xl blur-xl opacity-60"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                                    <div className="text-2xl font-bold text-white uppercase">{user.username ? user.username.slice(0, 2) : 'T'}</div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                                    Welcome, {user.username}
                                </h1>
                                <p className="text-blue-200/90 text-lg mt-1 flex items-center gap-2">
                                    <span className="inline-block w-2h h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                    Technician Workspace
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <StatCard title="Active Assignments" value={activeTickets.length} icon="👨‍🔧" gradient="from-blue-400 to-cyan-400" />
                        <StatCard title="Needs Attention" value={newlyAssigned.length} icon="⚠️" gradient="from-amber-400 to-orange-400" />
                        <StatCard title="Urgent Priority" value={criticalTickets.length} icon="🔥" gradient="from-red-400 to-rose-400" />
                        <StatCard title="Closed / Resolved" value={closedTickets.length} icon="✅" gradient="from-emerald-400 to-teal-400" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl -mt-12 px-4 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1 mb-8 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center rounded-t-2xl">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            Your Assigned Tickets
                        </h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{tickets.length} Total</span>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 text-blue-200 mb-4 shadow-inner">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">You're all caught up!</h3>
                            <p className="text-gray-500">You have no tickets currently assigned to you.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Ticket ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority & Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Resource / Location</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tickets.map((ticket) => {
                                        const statusConfig = getStatusConfig(ticket.status);
                                        const priorityConfig = getPriorityConfig(ticket.priority);

                                        return (
                                            <tr 
                                                key={ticket.id} 
                                                onClick={() => navigate(`/incidents/${ticket.id}`)} 
                                                className="group hover:bg-blue-50/50 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-mono text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
                                                        #{ticket.id.slice(-6).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${priorityConfig.bgLight} ${priorityConfig.text}`}>
                                                            {ticket.priority}
                                                        </span>
                                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${statusConfig.color}`}>
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-800">{getResourceName(ticket.resourceId)}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">Updated {new Date(ticket.updatedAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                        📂 {ticket.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold">
                                                        View Details
                                                        <svg className="w-4 h-4 ml-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
