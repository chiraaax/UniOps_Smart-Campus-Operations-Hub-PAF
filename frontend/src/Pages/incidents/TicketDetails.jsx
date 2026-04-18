import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, updateIncidentStatus, addIncidentComment, deleteIncidentComment } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [facilityName, setFacilityName] = useState('');
    const [commentText, setCommentText] = useState('');
    
    // Admin update states
    const [status, setStatus] = useState('');
    const [technicianId, setTechnicianId] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [rejectedReason, setRejectedReason] = useState('');

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
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
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await updateIncidentStatus(id, status, resolutionNotes, technicianId, rejectedReason);
            alert('Ticket updated successfully');
            fetchTicket();
        } catch (error) {
            alert('Failed to update ticket');
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

    if (!ticket) return <div className="p-8 text-center">Loading...</div>;

    const getStatusColor = (s) => {
        switch(s) {
          case 'OPEN': return 'bg-yellow-100 text-yellow-800';
          case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
          case 'RESOLVED': return 'bg-green-100 text-green-800';
          case 'CLOSED': return 'bg-gray-100 text-gray-800';
          case 'REJECTED': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
            <button onClick={() => navigate('/incidents')} className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Tickets</button>
            
            <div className="bg-white p-6 shadow rounded-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Ticket Details</h2>
                        <p className="text-sm text-gray-500">ID: {ticket.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                    </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                        <p className="text-sm font-bold text-gray-600">Resource / Location</p>
                        <p className="text-gray-800">{facilityName || ticket.resourceId}</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-600">Category</p>
                        <p className="text-gray-800">{ticket.category}</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-600">Reported By</p>
                        <p className="text-gray-800">{ticket.reportedByUserId}</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-600">Priority</p>
                        <p className="text-gray-800">{ticket.priority}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm font-bold text-gray-600">Description</p>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded">{ticket.description}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm font-bold text-gray-600">Contact Details</p>
                        <p className="text-gray-800">{ticket.contactDetails}</p>
                    </div>
                </div>

                {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm font-bold text-gray-600 mb-2">Attachments ({ticket.attachmentUrls.length})</p>
                        <div className="flex gap-4">
                            {ticket.attachmentUrls.map((url, i) => (
                                <img key={i} src={"http://localhost:5173" + url} alt={`Attachment ${i+1}`} className="h-32 w-32 object-cover border rounded shadow-sm" />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Admin Management Section */}
            {user && user.role === 'ADMIN' && (
                <div className="bg-white p-6 shadow rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold mb-4">Admin Controls</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full p-2 border rounded">
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Assign Technician ID</label>
                            <input type="text" value={technicianId} onChange={(e) => setTechnicianId(e.target.value)} className="mt-1 block w-full p-2 border rounded" placeholder="e.g. tech_01" />
                        </div>
                        {status === 'REJECTED' && (
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700">Reason for Rejection</label>
                                <textarea value={rejectedReason} onChange={(e) => setRejectedReason(e.target.value)} className="mt-1 block w-full p-2 border rounded"></textarea>
                            </div>
                        )}
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Resolution Notes</label>
                            <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} className="mt-1 block w-full p-2 border rounded"></textarea>
                        </div>
                    </div>
                    <button onClick={handleUpdateStatus} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Ticket</button>
                </div>
            )}

            {/* Non-Admin Status display if any */}
            {(ticket.resolutionNotes || ticket.technicianId || ticket.rejectedReason) && (!user || user.role !== 'ADMIN') && (
                <div className="bg-yellow-50 p-6 shadow rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-lg font-bold mb-3">Updates</h3>
                    {ticket.technicianId && <p><strong>Assigned Technician:</strong> {ticket.technicianId}</p>}
                    {ticket.resolutionNotes && <p><strong>Resolution:</strong> {ticket.resolutionNotes}</p>}
                    {ticket.rejectedReason && <p><strong>Rejection Reason:</strong> {ticket.rejectedReason}</p>}
                </div>
            )}

            {/* Comments Section */}
            <div className="bg-white p-6 shadow rounded-lg mb-10">
                <h3 className="text-xl font-bold mb-4">Comments</h3>
                
                <div className="space-y-4 mb-6">
                    {ticket.comments && ticket.comments.length > 0 ? (
                        ticket.comments.map(c => (
                            <div key={c.id} className="p-4 border rounded bg-gray-50 flex justify-between items-start">
                                <div className="w-full">
                                    <p className="text-sm font-bold text-gray-800">{c.userId} <span className="text-gray-400 font-normal text-xs ml-2">{new Date(c.timestamp).toLocaleString()}</span></p>
                                    <div className="mt-1 text-gray-700 prose prose-sm max-w-none">
                                        <ReactMarkdown>{c.text}</ReactMarkdown>
                                    </div>
                                </div>
                                {user && (user.username === c.userId || user.role === 'ADMIN') && (
                                    <button onClick={() => handleDeleteComment(c.id)} className="text-red-500 hover:text-red-700 text-sm ml-4 border border-red-200 px-2 rounded">Delete</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No comments yet. Support Markdown styling in your text!</p>
                    )}
                </div>

                {user && (
                    <div className="flex gap-2 flex-col">
                        <textarea 
                            value={commentText} 
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment... (Markdown like **bold** or *italic* is supported)" 
                            className="flex-1 p-3 border rounded h-24"
                        ></textarea>
                        <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-32 self-end">Post</button>
                    </div>
                )}
            </div>

            {/* Audit Logs Section */}
            <div className="bg-gray-50 p-6 shadow rounded-lg border border-gray-200 mb-10">
                <h3 className="text-lg font-bold mb-4 text-gray-700">Audit Trail</h3>
                <ul className="space-y-2 relative border-l border-gray-300 ml-3 pl-4">
                    {ticket.auditLogs && ticket.auditLogs.map((log, idx) => (
                        <li key={idx} className="text-sm">
                            <span className="absolute -left-1.5 w-3 h-3 bg-blue-400 rounded-full mt-1.5"></span>
                            <span className="font-semibold text-gray-800">{log.action}</span>
                            <span className="text-gray-500 ml-2">by {log.user}</span>
                            <span className="text-gray-400 text-xs block">{new Date(log.timestamp).toLocaleString()}</span>
                        </li>
                    ))}
                    {(!ticket.auditLogs || ticket.auditLogs.length === 0) && <p className="text-gray-500 text-sm">No audit history available.</p>}
                </ul>
            </div>
        </div>
    );
};

export default TicketDetails;
