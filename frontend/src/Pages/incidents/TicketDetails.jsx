import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, updateIncidentStatus, addIncidentComment, deleteIncidentComment } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { getTechnicians } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import SLATimer from '../../components/common/SLATimer'; // <-- SLA TIMER IMPORTED

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [facilityName, setFacilityName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Admin update states
    const [status, setStatus] = useState('');
    const [technicianId, setTechnicianId] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [rejectedReason, setRejectedReason] = useState('');
    const [techniciansList, setTechniciansList] = useState([]);

    useEffect(() => {
        fetchTicket();
        fetchTechnicians();
    }, [id]);

    const fetchTechnicians = async () => {
        if (user && user.role === 'ADMIN') {
            try {
                const data = await getTechnicians();
                setTechniciansList(data);
            } catch (error) {
                console.error("Failed to fetch technicians", error);
            }
        }
    };

    const fetchTicket = async () => {
        try {
            setLoading(true);
            const data = await getIncidentById(id);
            setTicket(data);
            setStatus(data.status);
            setTechnicianId(data.technicianId || '');
            setResolutionNotes(data.resolutionNotes || '');
            setRejectedReason(data.rejectedReason || '');

            if (data.resourceId) {
                const facs = await facilityService.getAllFacilities();
                const matched = facs.find(f => String(f.id) === String(data.resourceId));
                setFacilityName(matched ? matched.name : data.resourceId);
            }
        } catch (error) {
            console.error('Failed to fetch ticket', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            setUpdating(true);
            await updateIncidentStatus(id, status, resolutionNotes, technicianId, rejectedReason);
            alert('Ticket updated successfully');
            fetchTicket();
        } catch (error) {
            alert('Failed to update ticket');
        } finally {
            setUpdating(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            await addIncidentComment(id, user ? user.username : 'Anonymous', commentText);
            setCommentText('');
            fetchTicket();
        } catch (error) {
            alert('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await deleteIncidentComment(id, commentId, user.username, user.role);
            fetchTicket();
        } catch (error) {
            alert('Not authorized or failed to delete');
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'OPEN': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'CLOSED': return 'bg-gray-50 text-gray-700 border border-gray-200';
            case 'REJECTED': return 'bg-red-50 text-red-700 border border-red-200';
            default: return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'LOW': return 'bg-green-400';
            case 'MEDIUM': return 'bg-yellow-400';
            case 'HIGH': return 'bg-orange-500';
            case 'CRITICAL': return 'bg-red-600';
            default: return 'bg-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!ticket) return <div className="p-8 text-center text-gray-500">Ticket not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 pb-16 font-sans">
            {/* Hero Header */}
            <div className="relative text-white pb-32 pt-16 px-6 shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #084298 0%, #0d6efd 100%)' }}>
                <div className="absolute inset-0 overflow-hidden opacity-40">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
                </div>

                <div className="container mx-auto max-w-4xl relative z-10">
                    <button
                        onClick={() => navigate('/incidents')}
                        className="mb-8 group relative px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg w-fit"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back to Tickets
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                                    {ticket.category ? `${ticket.category} Report` : 'Incident Details'}
                                </h1>
                                <div className="flex items-center gap-1.5 bg-blue-900/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-400/20 mt-2 md:mt-0" title={`Full ID: ${ticket.id}`}>
                                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                    </svg>
                                    <span className="text-blue-100 font-mono text-sm tracking-wider font-semibold">
                                        {ticket.id.slice(-6).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <p className="text-blue-200/90 text-lg flex items-center gap-2 mt-2">
                                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                {facilityName || ticket.resourceId || 'General Facility'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 text-xs font-bold uppercase rounded-lg tracking-wider border shadow-sm ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                            </span>
                            <div className={`w-4 h-4 rounded-full shadow-inner ${getPriorityColor(ticket.priority)}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl -mt-16 px-4 relative z-20">
                {/* Ticket Details Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
                    <div className={`h-2 w-full ${getPriorityColor(ticket.priority)}`}></div>
                    <div className="p-8">

                        {/* --- SLA TIMER INTEGRATION --- */}
                        <div className="mb-8 flex justify-end">
                            <SLATimer ticket={ticket} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Resource / Location</label>
                                    <p className="text-gray-800 text-lg font-bold">{facilityName || ticket.resourceId}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                        {ticket.category}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reported By</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm font-bold text-blue-700 uppercase shadow-sm">
                                            {ticket.reportedByUserId ? ticket.reportedByUserId.slice(0, 2) : 'A'}
                                        </div>
                                        <span className="text-gray-800 font-medium">{ticket.reportedByUserId}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</label>
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                                        <span className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(ticket.priority)}`}></span>
                                        {ticket.priority} Priority
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Created</label>
                                    <p className="text-gray-800 font-medium">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Unknown'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Details</label>
                                    <p className="text-gray-800 font-medium">{ticket.contactDetails || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Description</label>
                            <div className="bg-gray-50 rounded-xl p-5 text-gray-800 leading-relaxed border border-gray-100">
                                {ticket.description || "No description provided."}
                            </div>
                        </div>

                        {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                            <div className="border-t border-gray-100 pt-6 mt-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Attachments ({ticket.attachmentUrls.length})
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {ticket.attachmentUrls.map((url, i) => (
                                        <div key={i} className="relative group overflow-hidden rounded-xl border border-gray-200">
                                            <img
                                                src={"http://localhost:5173" + url}
                                                alt={`Attachment ${i + 1}`}
                                                className="w-full h-32 object-cover shadow-sm group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                onClick={() => window.open("http://localhost:5173" + url, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Management Section */}
                {user && user.role === 'ADMIN' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                Admin Controls
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-medium text-gray-700"
                                    >
                                        <option value="OPEN">🟡 Open</option>
                                        <option value="IN_PROGRESS">🔵 In Progress</option>
                                        <option value="RESOLVED">✅ Resolved</option>
                                        <option value="CLOSED">✔️ Closed</option>
                                        <option value="REJECTED">❌ Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Technician</label>
                                    <select
                                        value={technicianId}
                                        onChange={(e) => setTechnicianId(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-medium text-gray-700"
                                    >
                                        <option value="">-- Select a Technician --</option>
                                        {techniciansList.map(tech => (
                                            <option key={tech.id} value={tech.email}>{tech.username} ({tech.email})</option>
                                        ))}
                                    </select>
                                </div>
                                {status === 'REJECTED' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Rejection <span className="text-red-500">*</span></label>
                                        <textarea
                                            value={rejectedReason}
                                            onChange={(e) => setRejectedReason(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-400 transition-all h-24 resize-none"
                                            placeholder="Please provide a reason for rejection..."
                                        />
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resolution Notes</label>
                                    <textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all h-32 resize-none"
                                        placeholder="Describe the resolution or actions taken..."
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-400 text-white px-8 py-3.5 rounded-xl shadow-lg hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all transform hover:-translate-y-0.5 font-bold flex items-center gap-2"
                                >
                                    {updating ? "Updating..." : "Update Ticket"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Technician Controls */}
                {user && user.role === 'TECHNICIAN' && user.email === ticket.technicianId && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </div>
                                Technician Controls
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all font-medium text-gray-700"
                                    >
                                        <option value="IN_PROGRESS">🔵 In Progress</option>
                                        <option value="RESOLVED">✅ Resolved</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resolution Notes</label>
                                    <textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all h-32 resize-none"
                                        placeholder="Describe actions taken..."
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={handleUpdateStatus} disabled={updating} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5">
                                    {updating ? "Saving..." : "Save Updates"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Updates for Users */}
                {(ticket.resolutionNotes || ticket.technicianId || ticket.rejectedReason) && (!user || user.role !== 'ADMIN') && (
                    <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-200 mb-8 p-8">
                        <h3 className="text-xl font-bold mb-4 text-amber-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Updates
                        </h3>
                        {ticket.technicianId && <p className="mb-2 text-amber-800"><strong>Assigned Technician:</strong> {ticket.technicianId}</p>}
                        {ticket.resolutionNotes && <p className="mb-2 text-amber-800"><strong>Resolution:</strong> {ticket.resolutionNotes}</p>}
                        {ticket.rejectedReason && <p className="text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 mt-3 inline-block"><strong>Rejection Reason:</strong> {ticket.rejectedReason}</p>}
                    </div>
                )}

                {/* Comments Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        Comments <span className="bg-blue-50 text-blue-600 py-1 px-3 rounded-full text-sm">{ticket.comments ? ticket.comments.length : 0}</span>
                    </h3>
                    <div className="space-y-4 mb-8">
                        {ticket.comments && ticket.comments.map(c => (
                            <div key={c.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex justify-between group transition-colors hover:bg-gray-100/50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-xs font-bold text-blue-700 uppercase">
                                            {c.userId.slice(0, 2)}
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">{c.userId} <span className="text-xs text-gray-400 font-medium ml-2">{new Date(c.timestamp).toLocaleString()}</span></p>
                                    </div>
                                    <div className="mt-1 text-gray-700 ml-10">
                                        <ReactMarkdown className="prose prose-sm max-w-none">{c.text}</ReactMarkdown>
                                    </div>
                                </div>
                                {user && (user.username === c.userId || user.role === 'ADMIN') && (
                                    <button onClick={() => handleDeleteComment(c.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm h-fit opacity-0 group-hover:opacity-100">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {user && (
                        <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-gray-100">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment... (Markdown supported)"
                                className="p-4 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all"
                            />
                            <button onClick={handleAddComment} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold self-end shadow-md hover:shadow-lg transition-all">
                                Post Comment
                            </button>
                        </div>
                    )}
                </div>

                {/* Audit Logs */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-inner">
                    <h3 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Audit Trail
                    </h3>
                    <ul className="space-y-6 border-l-2 border-gray-200 ml-4 pl-6 relative">
                        {ticket.auditLogs && ticket.auditLogs.map((log, idx) => (
                            <li key={idx} className="relative">
                                <span className="absolute -left-[35px] top-1 w-4 h-4 bg-gray-200 rounded-full border-2 border-white shadow-sm"></span>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <p className="font-semibold text-gray-800">{log.action}</p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        {log.user} • {new Date(log.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;