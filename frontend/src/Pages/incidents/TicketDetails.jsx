import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, updateIncidentStatus, addIncidentComment, deleteIncidentComment } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { getTechnicians } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';

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
        switch(s) {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!ticket) return <div className="p-8 text-center text-gray-500">Ticket not found.</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-12 font-sans">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-purple-800 to-indigo-900 text-white pb-16 pt-12 px-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -m-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto max-w-4xl relative z-10">
                    <button 
                        onClick={() => navigate('/incidents')} 
                        className="mb-6 bg-white/10 backdrop-blur-md text-white border border-white/20 py-2 px-4 rounded-full hover:bg-white/20 transition flex items-center gap-2 text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back to Tickets
                    </button>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                                Ticket #{ticket.id}
                            </h1>
                            <p className="text-indigo-200 text-lg">Detailed view of the reported incident</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-3">
                            <span className={`px-4 py-2 text-sm font-bold uppercase rounded-full tracking-wider ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                            </span>
                            <div className={`w-4 h-4 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl -mt-8 px-4 relative z-20">
                {/* Ticket Details Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white mb-8 overflow-hidden">
                    <div className={`h-2 w-full ${getPriorityColor(ticket.priority)}`}></div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Resource / Location</label>
                                    <p className="text-gray-800 text-lg font-medium">{facilityName || ticket.resourceId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Category</label>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700">
                                        {ticket.category}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Reported By</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 uppercase">
                                            {ticket.reportedByUserId ? ticket.reportedByUserId.slice(0, 2) : 'A'}
                                        </div>
                                        <span className="text-gray-800">{ticket.reportedByUserId}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Priority</label>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-50 text-orange-700">
                                        {ticket.priority} Priority
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Created</label>
                                    <p className="text-gray-800">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Unknown'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Contact Details</label>
                                    <p className="text-gray-800">{ticket.contactDetails || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-bold text-gray-600 mb-3">Description</label>
                            <div className="bg-gray-50 rounded-xl p-4 text-gray-800 leading-relaxed">
                                {ticket.description || "No description provided."}
                            </div>
                        </div>

                        {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                            <div className="border-t border-gray-100 pt-6 mt-6">
                                <label className="block text-sm font-bold text-gray-600 mb-3">
                                    Attachments ({ticket.attachmentUrls.length})
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {ticket.attachmentUrls.map((url, i) => (
                                        <div key={i} className="relative group">
                                            <img 
                                                src={"http://localhost:5173" + url} 
                                                alt={`Attachment ${i+1}`} 
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => window.open("http://localhost:5173" + url, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white mb-8 overflow-hidden">
                        <div className="h-1 w-full bg-blue-500"></div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                Admin Controls
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                    <select 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                        <option value="CLOSED">Closed</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Assign Technician</label>
                                    <select 
                                        value={technicianId} 
                                        onChange={(e) => setTechnicianId(e.target.value)} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                    >
                                        <option value="">-- Select a Technician --</option>
                                        {techniciansList.map(tech => (
                                            <option key={tech.id} value={tech.email}>{tech.username} ({tech.email})</option>
                                        ))}
                                    </select>
                                </div>
                                {status === 'REJECTED' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Rejection</label>
                                        <textarea 
                                            value={rejectedReason} 
                                            onChange={(e) => setRejectedReason(e.target.value)} 
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-24 resize-none" 
                                            placeholder="Please provide a reason for rejection..."
                                        />
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Resolution Notes</label>
                                    <textarea 
                                        value={resolutionNotes} 
                                        onChange={(e) => setResolutionNotes(e.target.value)} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32 resize-none" 
                                        placeholder="Describe the resolution or actions taken..."
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={handleUpdateStatus} 
                                    disabled={updating}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 font-bold flex items-center gap-2"
                                >
                                    {updating ? "Updating..." : "Update Ticket"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Technician Controls */}
                {user && user.role === 'TECHNICIAN' && user.email === ticket.technicianId && (
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white mb-8 overflow-hidden">
                        <div className="h-1 w-full bg-green-500"></div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">Technician Controls</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                    <select 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Resolution Notes</label>
                                    <textarea 
                                        value={resolutionNotes} 
                                        onChange={(e) => setResolutionNotes(e.target.value)} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none" 
                                        placeholder="Describe actions taken..."
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={handleUpdateStatus} disabled={updating} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">
                                    {updating ? "Saving..." : "Save Updates"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Updates for Users */}
                {(ticket.resolutionNotes || ticket.technicianId || ticket.rejectedReason) && (!user || user.role !== 'ADMIN') && (
                    <div className="bg-yellow-50/80 backdrop-blur-xl rounded-2xl shadow-sm border border-yellow-200 mb-8 p-8">
                         <h3 className="text-xl font-bold mb-4">Updates</h3>
                         {ticket.technicianId && <p className="mb-2"><strong>Assigned Technician:</strong> {ticket.technicianId}</p>}
                         {ticket.resolutionNotes && <p className="mb-2"><strong>Resolution:</strong> {ticket.resolutionNotes}</p>}
                         {ticket.rejectedReason && <p className="text-red-700"><strong>Rejection Reason:</strong> {ticket.rejectedReason}</p>}
                    </div>
                )}

                {/* Comments Section */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-white mb-8 p-8">
                    <h3 className="text-2xl font-bold mb-6">Comments ({ticket.comments ? ticket.comments.length : 0})</h3>
                    <div className="space-y-4 mb-8">
                        {ticket.comments && ticket.comments.map(c => (
                            <div key={c.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between">
                                <div>
                                    <p className="text-sm font-bold">{c.userId} <span className="text-xs text-gray-500 font-normal ml-2">{new Date(c.timestamp).toLocaleString()}</span></p>
                                    <div className="mt-2 text-gray-700">
                                        <ReactMarkdown>{c.text}</ReactMarkdown>
                                    </div>
                                </div>
                                {user && (user.username === c.userId || user.role === 'ADMIN') && (
                                    <button onClick={() => handleDeleteComment(c.id)} className="text-red-500 text-sm h-fit">Delete</button>
                                )}
                            </div>
                        ))}
                    </div>

                    {user && (
                        <div className="flex flex-col gap-4">
                            <textarea 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment... (Markdown supported)" 
                                className="p-4 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button onClick={handleAddComment} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold self-end">Post Comment</button>
                        </div>
                    )}
                </div>

                {/* Audit Logs */}
                <div className="bg-gray-50/80 rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-xl font-bold mb-6">Audit Trail</h3>
                    <ul className="space-y-4 border-l-2 border-gray-300 ml-4 pl-6">
                        {ticket.auditLogs && ticket.auditLogs.map((log, idx) => (
                            <li key={idx} className="relative">
                                <span className="absolute -left-8 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white"></span>
                                <div className="bg-white rounded-lg p-4 shadow-sm border">
                                    <p className="font-semibold text-gray-800">{log.action}</p>
                                    <p className="text-sm text-gray-600">by {log.user} • {new Date(log.timestamp).toLocaleString()}</p>
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
